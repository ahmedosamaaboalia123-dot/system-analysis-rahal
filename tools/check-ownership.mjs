import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { execute, root } from './process.mjs';

function normalize(path) {
  const value = path.replaceAll('\\', '/').toLowerCase();
  if (value.startsWith('/') || value.split('/').some((part) => ['..', '.', ''].includes(part))) {
    throw new Error(`Invalid ownership path: ${path}`);
  }
  return value;
}

export function matches(path, pattern) {
  path = normalize(path);
  pattern = normalize(pattern);
  return pattern.endsWith('/**') ? path.startsWith(pattern.slice(0, -2)) : path === pattern;
}

export function git(args, cwd = root) {
  return execute('git', ['-c', `safe.directory=${cwd.replaceAll('\\', '/')}`, ...args], { cwd });
}

export function changedPaths(base, head, cwd = root) {
  const ancestor = git(['merge-base', base, head], cwd).trim();
  if (!ancestor) throw new Error('Cannot determine the PR merge base');
  const values = git(['diff', '--name-status', '-z', '-M', ancestor, head, '--'], cwd).split('\0');
  const changes = [];
  for (let index = 0; index < values.length - 1;) {
    const kind = values[index++];
    const path = values[index++];
    changes.push(path);
    if (/^[RC]/.test(kind)) changes.push(values[index++]);
  }
  return [...new Set(changes)];
}

export function evaluate(paths, policy, roles, allowed, approved = false) {
  if (policy.version !== 1 || !Array.isArray(policy.rules))
    throw new Error('Invalid ownership policy');
  return paths.flatMap((path) => {
    const rules = policy.rules.filter((rule) =>
      rule.paths.some((pattern) => matches(path, pattern)),
    );
    if (rules.length !== 1) return [`${path}: missing or ambiguous owner`];
    if (policy.policyPaths?.some((pattern) => matches(path, pattern))) {
      return approved ? [] : [`${path}: enforcement change requires repository-owner review`];
    }
    if (
      !roles.includes(rules[0].owner) ||
      (allowed && !allowed.some((pattern) => matches(path, pattern)))
    ) {
      return [`${path}: change outside authorized scope (${rules[0].owner})`];
    }
    return [];
  });
}

async function main() {
  const [mode, base, head, checkout = root] = process.argv.slice(2);
  if (!mode) {
    const policy = JSON.parse(readFileSync(resolve(root, 'ownership.json'), 'utf8'));
    const patterns = policy.rules.flatMap((rule) => rule.paths.map(normalize));
    for (const [i, pattern] of patterns.entries()) {
      if (
        patterns.some(
          (other, j) =>
            i !== j &&
            (pattern === other ||
              (pattern.endsWith('/**') && other.startsWith(pattern.slice(0, -2)))),
        )
      ) {
        throw new Error(`Overlapping ownership pattern: ${pattern}`);
      }
    }
    if (new Set(policy.rules.map(({ owner }) => owner)).size !== 8)
      throw new Error('Expected A0–A7');
    console.log(`Ownership manifest: ${patterns.length} exclusive patterns`);
    return;
  }
  if (mode !== '--pr' || ![base, head].every((sha) => /^[0-9a-f]{40}$/.test(sha ?? ''))) {
    throw new Error('Usage: check-ownership.mjs --pr BASE_SHA HEAD_SHA [CHECKOUT]');
  }
  const cwd = resolve(checkout);
  const event = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'));
  if (event.pull_request.base.sha !== base || event.pull_request.head.sha !== head) {
    throw new Error('PR event does not match diff revisions');
  }
  const actor = event.pull_request.user.login;
  const policy = JSON.parse(git(['show', `${base}:ownership.json`], cwd));
  const grants = policy.grants?.filter((grant) => grant.actor === actor) ?? [];
  const paths = changedPaths(base, head, cwd);
  let approved = false;
  if (paths.some((path) => policy.policyPaths.some((pattern) => matches(path, pattern)))) {
    const owner = event.repository.owner.login;
    const response = await fetch(
      `https://api.github.com/repos/${event.repository.full_name}/pulls/${event.number}/reviews?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      },
    );
    if (!response.ok || response.headers.get('link')?.includes('rel="next"')) {
      throw new Error('Cannot verify repository-owner review');
    }
    const reviews = await response.json();
    const latest = reviews
      .filter((review) => review.user?.login === owner && review.state !== 'COMMENTED')
      .sort((left, right) => left.id - right.id)
      .at(-1);
    approved = latest?.state === 'APPROVED' && latest.commit_id === head;
  }
  const errors = paths.flatMap((path) => {
    if (policy.policyPaths.some((pattern) => matches(path, pattern))) {
      return evaluate([path], policy, [], undefined, approved);
    }
    if (
      grants.some((grant) => !evaluate([path], policy, grant.roles, grant.paths, approved).length)
    )
      return [];
    return [`${path}: no applicable trusted task grant or required owner review`];
  });
  if (errors.length) throw new Error(errors.join('\n'));
  console.log(`Verified ${paths.length} changed paths against trusted base ${base}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href)
  await main();
