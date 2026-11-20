import { statSync } from 'node:fs';
import { resolve } from 'node:path';

const directory = process.argv[2] ?? new URL('../packages/s02-fixture/dist/', import.meta.url);
for (const name of ['index.js', 'index.d.ts', 'index.js.map', 'server.js']) {
  const path = typeof directory === 'string' ? resolve(directory, name) : new URL(name, directory);
  if (!statSync(path).size) {
    throw new Error(`Empty build output: ${name}`);
  }
}
const { increment, fixtureLabel } = await import('@madar/s02-fixture');
if (increment(1) !== 2 || !fixtureLabel.includes('TEST FIXTURE ONLY')) {
  throw new Error('Compiled workspace import did not execute correctly');
}
console.log('Compiled workspace import verified');
