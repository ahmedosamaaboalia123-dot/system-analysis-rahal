import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const json = (path) => JSON.parse(readFileSync(path, 'utf8').replace(/^\uFEFF/, ''));
export const root = resolve(import.meta.dirname, '..');

export function execute(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error || result.signal || result.status !== 0) {
    throw new Error(
      `${command} ${args.join(' ')} failed (${result.status ?? result.signal ?? result.error?.code})\n${result.stderr ?? ''}${result.stdout ?? ''}`,
    );
  }
  return result.stdout;
}

export function pnpm(args, options = {}) {
  const executable = process.env.npm_execpath;
  if (!executable || !/pnpm/i.test(executable)) throw new Error('Invoke this command through pnpm');
  return /\.[cm]?js$/i.test(executable)
    ? execute(process.execPath, [executable, ...args], options)
    : execute(executable, args, options);
}
