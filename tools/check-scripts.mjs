import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { json, root } from './process.mjs';

export const requiredScripts = [
  'lint',
  'typecheck',
  'format:check',
  'format:write',
  'test:unit',
  'test:e2e',
  'build',
  'check:workspace',
  'check:boundaries',
  'check:ownership',
  'check:scripts',
  'check:contracts',
  'check:security',
  'test:negative',
  'verify:s02',
];
const requiredInvocation = {
  lint: /eslint .*&& node tools\/check-boundaries\.mjs/,
  typecheck: /^tsc -p tsconfig\.json && pnpm -r --if-present typecheck$/,
  'format:check': /^prettier \. --check$/,
  'format:write': /^prettier \. --write$/,
  'test:unit': /^node tools\/check-scripts\.mjs --test-inputs && vitest run$/,
  'test:e2e': /^playwright test$/,
  build: /^pnpm -r --if-present build && node tools\/check-build\.mjs$/,
};
const toolNames = {
  'check:workspace': 'check-workspace',
  'check:boundaries': 'check-boundaries',
  'check:ownership': 'check-ownership',
  'check:scripts': 'check-scripts',
  'check:contracts': 'check-contract-files',
  'check:security': 'check-security',
  'test:negative': 'test-quality-gates',
  'verify:s02': 'run-quality-gates',
};

export function verifyScripts(directory = root) {
  const scripts = json(resolve(directory, 'package.json')).scripts ?? {};
  for (const name of requiredScripts) {
    const command = scripts[name];
    if (!command || /\|\||[;|]|\b(?:echo|exit|true|passWithNoTests)\b/.test(command)) {
      throw new Error(`Missing or unsafe mandatory script: ${name}`);
    }
    if (requiredInvocation[name] && !requiredInvocation[name].test(command)) {
      throw new Error(`Mandatory tool bypassed by ${name}`);
    }
    if (toolNames[name] && command !== `node tools/${toolNames[name]}.mjs`) {
      throw new Error(`Mandatory checker bypassed by ${name}`);
    }
    for (const part of command.split(/\s+&&\s+/)) {
      const [tool, arg] = part.split(/\s+/);
      if (!['node', 'pnpm', 'eslint', 'prettier', 'vitest', 'playwright', 'tsc'].includes(tool)) {
        throw new Error(`Unknown quality executable in ${name}: ${tool}`);
      }
      if (tool === 'node' && !existsSync(resolve(directory, arg))) {
        throw new Error(`Missing script entry point: ${arg}`);
      }
    }
  }
}

export function verifyTestInputs(directory = root) {
  for (const path of [
    'packages/s02-fixture/index.test.ts',
    'tests/unit/s02-fixture-contract.test.ts',
    'tests/e2e/s02-fixture.spec.ts',
  ]) {
    if (!existsSync(resolve(directory, path)))
      throw new Error(`Required test file missing: ${path}`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv.includes('--test-inputs')) verifyTestInputs();
  else verifyScripts();
  console.log('Mandatory script inputs verified');
}
