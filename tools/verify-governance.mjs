import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './process.mjs';

const guide = readFileSync(join(root, 'AGENTS.md'), 'utf8');
for (const rule of [
  'SRS V1.2',
  'OPEN',
  'one worktree/branch per agent',
  'A7 alone',
  'pnpm install --frozen-lockfile',
  'pnpm verify:s02',
  'S00 → S01',
  'S00 → S02',
  'S01 + S02 → S03',
  'independent A6',
  'negative tests',
  'Failure escalation',
]) {
  if (!guide.includes(rule)) throw new Error(`Expected governance rule missing: ${rule}`);
}
console.log('S02 agent governance markers verified');
