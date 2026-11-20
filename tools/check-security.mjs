import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';
import { git } from './check-ownership.mjs';
import { root } from './process.mjs';

const files = git(['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
  .split('\0')
  .filter(Boolean);
if (!files.length) throw new Error('Security scan received no files');
const extensions = /\.(?:md|json|mjs|ts|tsx|ya?ml|ps1|sh|csv)$/i;
const credential =
  /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----|(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[A-Z0-9]{16})/;
for (const path of new Set(files)) {
  const file = join(root, path);
  if (!existsSync(file)) continue;
  if (
    /(^|\/)(?:\.env(?!\.example$)[^/]*|id_rsa|id_ed25519|credentials\.json)$|\.(?:key|pem|pfx|p12)$/i.test(
      path,
    )
  ) {
    throw new Error(`Potential credential file: ${path}`);
  }
  if (extensions.test(path) && credential.test(readFileSync(file, 'utf8'))) {
    throw new Error(`Potential credential in ${path}`);
  }
}
const directory = join(root, '.github/workflows');
for (const file of readdirSync(directory).filter((name) => /\.ya?ml$/.test(name))) {
  const raw = readFileSync(join(directory, file), 'utf8');
  const workflow = parse(raw);
  if (
    workflow.on?.pull_request_target ||
    workflow.permissions?.contents !== 'read' ||
    /\$\{\{\s*secrets\.|strict-ssl\s*[:=]\s*false|NODE_TLS_REJECT_UNAUTHORIZED\s*[:=]\s*['"]?0|continue-on-error:/i.test(
      raw,
    )
  ) {
    throw new Error(`Unsafe workflow configuration: ${file}`);
  }
  for (const job of Object.values(workflow.jobs)) {
    if (Object.values(job.permissions ?? {}).includes('write'))
      throw new Error(`Unnecessary write permissions: ${file}`);
    for (const step of job.steps ?? []) {
      if (step.uses && !/^[\w.-]+\/[\w.-]+@[\da-f]{40}$/.test(step.uses)) {
        throw new Error(`Unpinned external action: ${file}`);
      }
      if (
        step.uses?.startsWith('actions/checkout@') &&
        step.with?.['persist-credentials'] !== false
      ) {
        throw new Error(`Checkout persists credentials: ${file}`);
      }
    }
  }
}
console.log(`Security scan checked ${new Set(files).size} pathnames and workflow policies`);
