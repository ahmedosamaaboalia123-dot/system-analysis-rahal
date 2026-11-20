import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse, parseAllDocuments } from 'yaml';
import { execute, json, pnpm, root } from './process.mjs';
import { verifySourceIntegrity } from './check-contract-files.mjs';

verifySourceIntegrity();

const expected = ['apps/*', 'packages/*', 'backend/*', 'backend/domains/*', 'backend/systems/*'];
const workspace = parse(readFileSync(join(root, 'pnpm-workspace.yaml'), 'utf8'));
const manifest = json(join(root, 'package.json'));
const lockDocuments = parseAllDocuments(readFileSync(join(root, 'pnpm-lock.yaml'), 'utf8'));
if (lockDocuments.some((document) => document.errors.length))
  throw new Error('Invalid lockfile YAML');
const projectLocks = lockDocuments
  .map((document) => document.toJS())
  .filter((document) => document?.importers?.['.']?.devDependencies);
if (projectLocks.length !== 1)
  throw new Error('Expected one project dependency document in lockfile');
const [lock] = projectLocks;
const nodeVersion = readFileSync(join(root, '.node-version'), 'utf8').trim();
if (JSON.stringify(workspace.packages) !== JSON.stringify(expected))
  throw new Error('Workspace globs differ from S02');
if (
  process.versions.node !== nodeVersion ||
  manifest.engines.node !== nodeVersion ||
  pnpm(['--version']).trim() !== manifest.engines.pnpm ||
  !manifest.private ||
  manifest.type !== 'module' ||
  manifest.packageManager !== 'pnpm@12.19.0'
) {
  throw new Error('Runtime or private workspace manifest is incorrect');
}
const packages = new Map([[manifest.name, { path: '.', manifest }]]);
for (const pattern of expected) {
  const parent = pattern.slice(0, -2);
  const directory = join(root, parent);
  if (!existsSync(directory)) continue;
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = `${parent}/${entry.name}`;
    const file = join(root, path, 'package.json');
    if (!entry.isDirectory() || !existsSync(file)) continue;
    const data = json(file);
    if (!data.name || !data.version || packages.has(data.name))
      throw new Error(`Invalid or duplicate package: ${path}`);
    packages.set(data.name, { path, manifest: data });
  }
}
if (!packages.has('@madar/s02-fixture')) throw new Error('Fixture package missing');
for (const { path, manifest: data } of packages.values()) {
  if (!lock.importers?.[path]) throw new Error(`Missing lockfile importer: ${path}`);
  for (const group of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, specifier] of Object.entries(data[group] ?? {})) {
      if (packages.has(name) !== specifier.startsWith('workspace:')) {
        throw new Error(`Invalid workspace reference: ${path}: ${name}`);
      }
      if (lock.importers[path][group]?.[name]?.specifier !== specifier) {
        throw new Error(`Stale lockfile reference: ${path}: ${name}`);
      }
    }
  }
}
const tracked = execute(
  'git',
  ['-c', `safe.directory=${root.replaceAll('\\', '/')}`, 'ls-files', '-z'],
  { cwd: root },
).split('\0');
if (
  tracked.some((path) =>
    /(^|\/)(yarn\.lock|package-lock\.json|bun\.lockb?|node_modules|dist|artifacts|playwright-report|test-results)(\/|$)/.test(
      path,
    ),
  )
) {
  throw new Error('Unexpected generated artifact or alternate lockfile tracked');
}
console.log(`Workspace verified: ${[...packages.keys()].join(', ')}`);
