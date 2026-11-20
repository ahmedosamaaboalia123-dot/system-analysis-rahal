import { pnpm } from './process.mjs';

const tasks = [
  'check:workspace',
  'check:scripts',
  'check:ownership',
  'check:security',
  'typecheck',
  'lint',
  'format:check',
  'test:unit',
  'build',
  'test:e2e',
  'test:negative',
];
const failed = [];
for (const task of tasks) {
  try {
    pnpm(['run', task], { stdio: 'inherit' });
    console.log(`S02_FOUNDATION_QUALITY ${task} PASS`);
  } catch (error) {
    failed.push(task);
    console.error(`S02_FOUNDATION_QUALITY ${task} FAIL: ${error.message}`);
  }
}
if (failed.length) process.exitCode = 1;
