import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { verifyJobs } from './aggregate-jobs.mjs';
import { changedPaths, evaluate, git } from './check-ownership.mjs';
import { verifyScripts, verifyTestInputs } from './check-scripts.mjs';
import { execute, json, pnpm, root } from './process.mjs';
import { add, list, remove } from './worktrees.mjs';

const ownershipOnly = process.argv.includes('--ownership-only');
const temp = mkdtempSync(join(tmpdir(), 'madar-s02-negative-'));
const cases = [];
const results = [];
const test = (id, fn) => cases.push({ id, fn });
const shellNode = (path, ...args) => execute(process.execPath, [join(root, path), ...args]);
const fixture = (name) => {
  const directory = join(temp, name);
  mkdirSync(directory, { recursive: true });
  return directory;
};
function write(directory, path, contents) {
  const entries = path.split('/');
  const file = entries.pop();
  const parent = join(directory, ...entries);
  mkdirSync(parent, { recursive: true });
  writeFileSync(
    join(parent, file),
    typeof contents === 'string' ? contents : JSON.stringify(contents),
  );
}
function repository(name) {
  const directory = fixture(name);
  git(['init', '-q'], directory);
  git(['config', 'user.name', 'S02 test identity'], directory);
  git(['config', 'user.email', 's02-test@example.invalid'], directory);
  return directory;
}
function commit(directory) {
  git(['add', '--all'], directory);
  git(['commit', '-qm', 'Controlled S02 fixture'], directory);
  return git(['rev-parse', 'HEAD'], directory).trim();
}

const ownershipCases = [
  ['OWN-01', 'A7', 'backend/domains/identity/new.ts', false],
  ['OWN-02', 'A4', 'backend/domains/identity/Internal Service.ts', false],
  ['OWN-03', 'A2', 'backend/systems/wallet/value.ts', false],
  ['OWN-04', 'A7', 'docs/MADAR_V1_Master_SRS_V1.2_Reconciled_Complete_Arabic.md', false],
  ['OWN-05', 'A7', 'backend/domains/identity/taken.ts', false],
  ['OWN-06', 'A7', 'unknown/file.ts', false],
  ['OWN-07', 'A7', 'infrastructure/Windows Space.md', true],
  ['OWN-08', 'A0', 'planning/sprints/S02/example.md', true],
  ['OWN-09', 'A7', 'backend/domains/identity/same.txt', false],
];
for (const [id, role, path, expected] of ownershipCases) {
  test(id, () => {
    const directory = repository(id);
    const policy = json(join(root, 'ownership.json'));
    write(directory, 'ownership.json', policy);
    if (id === 'OWN-09') write(directory, 'infrastructure/same.txt', 'rename probe');
    const base = commit(directory);
    if (id === 'OWN-05') {
      const changedPolicy = structuredClone(policy);
      changedPolicy.rules[1].owner = 'A7';
      write(directory, 'ownership.json', changedPolicy);
    }
    if (id === 'OWN-09') {
      write(directory, path, 'rename probe');
      git(['rm', '--', 'infrastructure/same.txt'], directory);
    } else {
      write(directory, path, 'isolated');
    }
    const head = commit(directory);
    const paths = changedPaths(base, head, directory);
    const trusted = JSON.parse(git(['show', `${base}:ownership.json`], directory));
    assert.ok(paths.includes(path));
    if (id === 'OWN-09') assert.ok(paths.includes('infrastructure/same.txt'));
    assert.equal(evaluate(paths, trusted, [role]).length === 0, expected);
  });
}

test('OWN-PR-CLI', () => {
  const directory = repository('trusted-pr-cli');
  const policy = json(join(root, 'ownership.json'));
  write(directory, 'ownership.json', policy);
  const base = commit(directory);
  const contract = join(temp, 'trusted-pr-event.json');
  const actor = policy.grants.find(({ task }) => task === 'S02').actor;
  const check = (head, author) => {
    writeFileSync(
      contract,
      JSON.stringify({
        pull_request: { base: { sha: base }, head: { sha: head }, user: { login: author } },
      }),
    );
    return execute(
      process.execPath,
      [join(root, 'tools/check-ownership.mjs'), '--pr', base, head, directory],
      { env: { ...process.env, GITHUB_EVENT_PATH: contract } },
    );
  };
  write(directory, 'tools/probe.mjs', 'export const permitted = true;');
  const allowed = commit(directory);
  assert.match(check(allowed, actor), /Verified 1 changed paths/);
  assert.throws(
    () => check(allowed, 'unreviewed-fixture-author'),
    /no applicable trusted task grant/,
  );
  write(directory, 'backend/domains/identity/denied.ts', 'export const denied = true;');
  const rejected = commit(directory);
  assert.throws(() => check(rejected, actor), /backend\/domains\/identity\/denied\.ts/);
});

if (!ownershipOnly) {
  const prohibited = [
    ['BND-01', 'apps/sample/a.ts', "import '../../backend/domains/identity/internal.js';"],
    ['BND-02', 'backend/systems/booking/a.ts', "import '../wallet/repository.js';"],
    ['BND-03', 'backend/systems/wallet/a.ts', "import '../booking/entity.js';"],
    ['BND-04', 'packages/technical/a.ts', "import '../../backend/domains/identity/internal.js';"],
    ['BND-05', 'apps/sample/a.ts', "import '@private/internal.js';"],
    [
      'BND-06',
      'apps/sample/a.ts',
      "import '../../packages/../backend/domains/identity/internal.js';",
    ],
    ['BND-07', 'apps/sample/a.ts', "export * from '../../backend/domains/identity/internal.js';"],
    ['BND-08', 'apps/sample/a.ts', "void import('../../backend/domains/identity/internal.js');"],
    ['BND-09', 'apps/sample/a.ts', "const moduleName = './x'; void import(moduleName);"],
    ['BND-10', 'apps/sample/a.cjs', "require('../../backend/domains/identity/internal.js');"],
  ];
  for (const [id, from, source] of prohibited) {
    test(id, () => {
      const directory = fixture(id);
      write(directory, from, source);
      write(directory, 'tsconfig.json', {
        compilerOptions: {
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          paths: { '@private/*': ['./backend/domains/identity/*'] },
        },
      });
      for (const path of [
        'backend/domains/identity/internal.ts',
        'backend/systems/wallet/repository.ts',
        'backend/systems/booking/entity.ts',
      ]) {
        write(directory, path, 'export const internal = 1;');
      }
      assert.throws(
        () => shellNode('tools/check-boundaries.mjs', directory),
        /Forbidden dependency|Nonliteral module specifier/,
      );
    });
  }
  test('BND-POS', () => {
    const directory = fixture('boundary-positive');
    write(directory, 'packages/contracts/public/v1/index.ts', 'export const fixture = 1;');
    write(directory, 'packages/technical/index.ts', 'export const diagnostic = 1;');
    write(
      directory,
      'backend/systems/booking/use.ts',
      "import '../../../packages/contracts/public/v1/index.js';",
    );
    write(
      directory,
      'apps/example/use.ts',
      "import '../../packages/contracts/public/v1/index.js';",
    );
    write(directory, 'packages/example/use.ts', "import '../technical/index.js';");
    assert.match(shellNode('tools/check-boundaries.mjs', directory), /3 imports/);
  });
  test('S02-T09-AC', () => {
    const directory = repository('worktree-origin');
    write(directory, 'fixture.txt', 'start');
    commit(directory);
    const target = join(temp, 'a7-worktree');
    add(directory, target, 'a7/s02-fixture');
    assert.equal(list(directory).length, 2);
    assert.throws(
      () => add(directory, join(temp, 'duplicate'), 'a7/s02-fixture'),
      /already checked out/,
    );
    assert.throws(() => add(directory, target, 'a6/s02-fixture'), /unused external/);
    assert.throws(() => remove(directory, join(temp, 'unregistered'), true), /Unknown/);
    write(target, 'dirty.txt', 'preserve');
    assert.throws(() => remove(directory, target, true), /Dirty/);
    rmSync(join(target, 'dirty.txt'));
    assert.throws(() => remove(directory, target, false), /explicit/);
    remove(directory, target, true);
    assert.equal(list(directory).length, 1);
  });
  test('AFP-S02-01', () => {
    const directory = fixture('missing-script');
    write(directory, 'package.json', { scripts: {} });
    assert.throws(() => verifyScripts(directory), /Missing or unsafe/);
  });
  test('AFP-S02-02', () => {
    assert.throws(() => execute(process.execPath, ['-e', 'process.exit(7)']), /failed \(7\)/);
    assert.throws(() => execute('madar-nonexistent-executable', []), /ENOENT/);
  });
  for (const [id, source, expected] of [
    [
      'AFP-S02-03',
      "test('failure', () => expect(1).toBe(2));",
      /AssertionError|expected 1 to be 2/,
    ],
    [
      'UNIT-EXCEPTION',
      "test('failure', () => { throw Error('intentional fixture failure') });",
      /intentional fixture failure/,
    ],
    ['AFP-S02-11', '', /No test files found|No test suite found/],
  ]) {
    test(id, () => {
      const directory = fixture(id);
      write(
        directory,
        'vitest.config.mjs',
        "export default { test: { globals: true, include: ['*.test.js'] } };",
      );
      if (source) write(directory, 'negative.test.js', source);
      write(directory, 'package.json', { type: 'module' });
      assert.throws(
        () =>
          pnpm([
            'exec',
            'vitest',
            'run',
            '--root',
            directory,
            '--config',
            join(directory, 'vitest.config.mjs'),
          ]),
        expected,
      );
      if (!source) assert.throws(() => verifyTestInputs(directory), /Required test file missing/);
    });
  }
  test('AFP-S02-04', () => {
    const directory = fixture('browser-assertion');
    const manifest = json(join(root, 'node_modules/@playwright/test/package.json'));
    const bin = join(root, 'node_modules/@playwright/test', manifest.bin.playwright);
    write(directory, 'playwright.config.cjs', 'module.exports = {testDir: ".", timeout: 10000};');
    const dependency = JSON.stringify(join(root, 'node_modules/@playwright/test'));
    write(
      directory,
      'failure.spec.cjs',
      `const { test, expect } = require(${dependency});
test('negative browser proof', async ({page}) => {
  await page.setContent('<title>actual</title>');
  await expect(page).toHaveTitle('intentionally wrong', {timeout: 350});
});`,
    );
    assert.throws(
      () =>
        execute(process.execPath, [bin, 'test', '-c', join(directory, 'playwright.config.cjs')], {
          cwd: directory,
        }),
      /intentionally wrong[\s\S]*actual|actual[\s\S]*intentionally wrong/,
    );
  });
  for (const [id, source, diagnostic] of [
    ['AFP-S02-05', 'export const bad = (input) => input;', /TS7006/],
    ['TS-NULL', 'export const bad: string = null;', /TS2322/],
    ['TS-INDEX', 'export const bad: string = ([] as string[])[0];', /TS2322/],
    ['TS-ASSIGNMENT', 'export const bad: number = "bad";', /TS2322/],
  ]) {
    test(id, () => {
      const directory = fixture(id);
      write(directory, 'negative.ts', source);
      write(directory, 'tsconfig.json', {
        extends: join(root, 'tsconfig.base.json'),
        compilerOptions: { types: [], noEmit: true },
        include: ['negative.ts'],
      });
      assert.throws(
        () => pnpm(['exec', 'tsc', '-p', join(directory, 'tsconfig.json')]),
        diagnostic,
      );
    });
  }
  for (const [id, source, diagnostic] of [
    ['LINT-UNUSED', 'const unused = 1;', /no-unused-vars/],
    ['LINT-ANY', 'export const value: any = 1;', /no-explicit-any/],
    ['LINT-PARSE', 'export const invalid = ;', /Parsing error/],
  ]) {
    test(id, () => {
      const result = spawnSync(
        process.execPath,
        [
          join(root, 'node_modules/eslint/bin/eslint.js'),
          '--stdin',
          '--stdin-filename',
          'tests/negative.ts',
        ],
        { input: source, encoding: 'utf8' },
      );
      assert.equal(result.status, 1);
      assert.match(result.stdout, diagnostic);
    });
  }
  test('FORMAT-NEG', () => {
    const directory = fixture('format');
    write(directory, 'messy.js', 'const broken={ x:1 }');
    assert.throws(
      () =>
        pnpm([
          'exec',
          'prettier',
          '--check',
          '--config',
          join(root, 'prettier.config.mjs'),
          join(directory, 'messy.js'),
        ]),
      /Code style issues/,
    );
  });
  test('AFP-S02-06', () => {
    assert.throws(
      () => shellNode('tools/check-boundaries.mjs', join(temp, 'BND-01')),
      /Forbidden dependency/,
    );
  });
  test('AFP-S02-07', () => {
    const policy = json(join(root, 'ownership.json'));
    assert.notEqual(
      evaluate(changedPaths('HEAD~1', 'HEAD', join(temp, 'OWN-01')), policy, ['A7']).length,
      0,
    );
  });
  test('AFP-S02-08', () => {
    const directory = fixture('lockfile');
    write(directory, 'package.json', {
      name: 'invalid-lockfile',
      private: true,
      dependencies: { 'broken-fixture': 'workspace:*' },
    });
    write(directory, 'pnpm-workspace.yaml', 'packages: []\n');
    write(directory, 'pnpm-lock.yaml', 'lockfileVersion: 9.0\nimporters:\n  .: {}\n');
    assert.throws(
      () => pnpm(['--dir', directory, 'install', '--offline', '--frozen-lockfile']),
      /LOCKFILE|WORKSPACE_PKG_NOT_FOUND|workspace/i,
    );
    assert.throws(
      () => pnpm(['--dir', directory, 'install', '--offline', '--no-frozen-lockfile']),
      /WORKSPACE_PKG_NOT_FOUND|No package named|not found.*workspace/i,
    );
  });
  test('AFP-S02-09', () => {
    assert.throws(
      () => shellNode('tools/check-build.mjs', fixture('empty-build')),
      /ENOENT|Empty build output/,
    );
  });
  test('AFP-S02-10', () => {
    assert.throws(() => verifyJobs({ build: { result: 'skipped' } }, ['build']), /build=skipped/);
    assert.throws(() => verifyJobs({}, ['build']), /build=missing/);
    verifyJobs({ build: { result: 'success' } }, ['build']);
    const workflow = readFileSync(join(root, '.github/workflows/s02-foundation.yml'), 'utf8');
    assert.match(workflow, /node tools\/aggregate-jobs\.mjs/);
  });
  test('AFP-S02-12', () => {
    const directory = fixture('disabled-validator');
    const manifest = json(join(root, 'package.json'));
    manifest.scripts['check:contracts'] = 'exit 0';
    write(directory, 'package.json', manifest);
    for (const command of Object.values(manifest.scripts)) {
      for (const match of command.matchAll(/(?:^| && )node (tools\/[^ ]+)/g)) {
        write(directory, match[1], '// Isolated script entry-point probe');
      }
    }
    assert.throws(() => verifyScripts(directory), /check:contracts/);
    write(directory, 'invalid-openapi.json', {
      openapi: '3.1.0',
      info: { title: 'Controlled invalid fixture' },
      servers: [{ url: 'https://example.invalid' }],
      paths: {},
    });
    const result = spawnSync(
      process.execPath,
      [
        join(root, 'tools/check-contract-files.mjs'),
        '--lint',
        join(directory, 'invalid-openapi.json'),
      ],
      { encoding: 'utf8' },
    );
    assert.equal(result.status, 1);
    assert.match(result.stderr, /field `version` must be present/);
    assert.match(result.stderr, /generated by the struct rule/);
  });
}

try {
  for (const { id, fn } of cases) {
    try {
      fn();
      results.push({ id, status: 'PASS' });
    } catch (error) {
      results.push({ id, status: 'FAIL', error: error.message });
    }
  }
  for (const result of results) console.log(JSON.stringify(result));
  const evidence = join(root, 'artifacts/s02');
  mkdirSync(evidence, { recursive: true });
  write(evidence, ownershipOnly ? 'ownership.json' : 'negative-tests.json', results);
  if (!results.length || results.some(({ status }) => status !== 'PASS')) process.exitCode = 1;
} finally {
  rmSync(temp, { recursive: true, force: true });
}
