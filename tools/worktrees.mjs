import { existsSync } from 'node:fs';
import { isAbsolute, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { git, matches } from './check-ownership.mjs';
import { json, root } from './process.mjs';

export function list(cwd = root) {
  return git(['worktree', 'list', '--porcelain', '-z'], cwd)
    .trim()
    .split('\0\0')
    .filter(Boolean)
    .map((item) => {
      const fields = Object.fromEntries(
        item
          .split('\0')
          .filter(Boolean)
          .map((line) => {
            const separator = line.indexOf(' ');
            return separator === -1
              ? [line, true]
              : [line.slice(0, separator), line.slice(separator + 1)];
          }),
      );
      return {
        path: fields.worktree,
        branch: fields.branch?.replace('refs/heads/', ''),
        bare: fields.bare,
      };
    });
}

export function dirty(path) {
  return !!git(['status', '--porcelain=v1', '--untracked-files=all'], path);
}

export function add(cwd, target, branch) {
  target = resolve(target);
  if (!/^a[0-7]\/[a-z0-9][a-z0-9-]*$/i.test(branch))
    throw new Error('Use a0/sprint-id through a7/sprint-id');
  const rel = relative(cwd, target);
  if (!rel || (!isAbsolute(rel) && !/^\.\.(?:[\\/]|$)/.test(rel)) || existsSync(target)) {
    throw new Error('Worktree target must be an unused external directory');
  }
  if (list(cwd).some((item) => item.branch === branch))
    throw new Error('Branch already checked out');
  git(['worktree', 'add', '-b', branch, target, 'HEAD'], cwd);
}

export function remove(cwd, target, approved) {
  target = resolve(target);
  const [primary, ...linked] = list(cwd);
  if (!primary || !linked.some(({ path }) => resolve(path) === target))
    throw new Error('Unknown linked worktree');
  if (!approved) throw new Error('Removal requires explicit --approved-clean');
  if (dirty(target)) throw new Error('Dirty worktree');
  git(['worktree', 'remove', target], cwd);
}

function report(cwd, target) {
  const policy = json(resolve(cwd, 'ownership.json'));
  const entries = list(cwd)
    .filter(({ bare }) => !bare)
    .map(({ path, branch }) => {
      const owner = /^a[0-7](?=\/)/i.exec(branch ?? '')?.[0].toUpperCase();
      const paths = policy.rules.find((rule) => rule.owner === owner)?.paths ?? [];
      const changes = git(['diff', '--name-only', '-z', 'HEAD'], path)
        .split('\0')
        .concat(git(['ls-files', '--others', '--exclude-standard', '-z'], path).split('\0'))
        .filter(Boolean);
      return {
        path,
        branch,
        owner,
        dirty: dirty(path),
        changes: [...new Set(changes)],
        outsideScope: changes.filter(
          (file) => owner && !paths.some((pattern) => matches(file, pattern)),
        ),
      };
    });
  if (target) {
    const entry = entries.find(({ path }) => resolve(path) === resolve(target));
    if (!entry?.owner) throw new Error('No role-tagged worktree for target');
    console.log(JSON.stringify(entry, null, 2));
    if (entry.outsideScope.length)
      throw new Error('Worktree contains changes outside its declared role');
    return;
  }
  const conflicts = entries.flatMap((entry, i) =>
    entries
      .slice(i + 1)
      .flatMap((other) =>
        entry.changes.filter((file) =>
          other.changes.some((path) => path.toLowerCase() === file.toLowerCase()),
        ),
      ),
  );
  console.log(
    JSON.stringify({ worktrees: entries, conflictingPaths: [...new Set(conflicts)] }, null, 2),
  );
  if (conflicts.length) throw new Error('Worktrees have overlapping changes');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const [command = 'list', target, argument] = process.argv.slice(2);
  if (command === 'list') console.log(JSON.stringify(list(), null, 2));
  else if (command === 'add' && target && argument) add(root, target, argument);
  else if (command === 'remove' && target) remove(root, target, argument === '--approved-clean');
  else if (command === 'report') report(root, target);
  else
    throw new Error(
      'Usage: worktrees.mjs list | add PATH ROLE/SPRINT | report [PATH] | remove PATH --approved-clean',
    );
}
