import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execute, json, root } from './process.mjs';

export const immutable = [
  [
    'docs/MADAR_V1_Master_SRS_V1.2_Reconciled_Complete_Arabic.md',
    '8B6CBFF5D2EF318A88B3E328A246CE9B44EFFD4661B3FEBFC4AABD3A8CDED2D7',
  ],
  [
    'docs/MADAR_V1_V5_AI_Execution_Master_Runbook_Arabic.md',
    '1EFF7D72426AB0DA3049BB41FC9A602DBEE18C63F5C0B4D95C540EA57BB0FD4E',
  ],
];
export function verifySourceIntegrity() {
  for (const [path, expected] of immutable) {
    const actual = createHash('sha256')
      .update(readFileSync(join(root, path)))
      .digest('hex')
      .toUpperCase();
    if (actual !== expected) throw new Error(`Authoritative source changed: ${path}`);
  }
}
export function lintContract(path) {
  const manifest = json(join(root, 'node_modules/@redocly/cli/package.json'));
  if (manifest.version !== '1.34.5') throw new Error('Unexpected Redocly version');
  const executable = join(root, 'node_modules/@redocly/cli', manifest.bin.redocly);
  console.log(`Redocly ${manifest.version} validating ${path}`);
  execute(process.execPath, [executable, 'lint', path], { cwd: root, stdio: 'inherit' });
}

function main() {
  verifySourceIntegrity();
  const directory = join(root, 'packages/contracts');
  const files = readdirSync(directory, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry) => join(entry.parentPath, entry.name));
  if (files.length < 16)
    throw new Error('Expected S01 OpenAPI, schema and fixture inventory is incomplete');
  for (const file of files) json(file);

  const contract = relative(root, join(directory, 'openapi/v1.openapi.json'));
  lintContract(contract);
  console.error(
    'S01_CONTRACT_QUALITY BLOCKED: verified instance, compatibility and anti-false-pass suites are outstanding',
  );
  process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (process.argv[2] === '--lint' && process.argv[3]) lintContract(process.argv[3]);
  else main();
}
