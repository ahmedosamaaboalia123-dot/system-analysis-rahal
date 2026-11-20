import { existsSync, readdirSync, realpathSync } from 'node:fs';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { isBuiltin } from 'node:module';
import ts from 'typescript';
import { json, root } from './process.mjs';

const repo = realpathSync(resolve(process.argv[2] ?? root));
const ignored = new Set(['node_modules', 'dist', 'coverage', 'artifacts', '.git', 'build']);
const sources = [];
const workspaces = new Map();
const configs = new Map();
const rel = (path) => relative(repo, path).replaceAll('\\', '/');

function collect(directory, visited = new Set()) {
  const physical = realpathSync(directory);
  if (visited.has(physical)) throw new Error(`Aliased source directory: ${rel(directory)}`);
  visited.add(physical);
  const manifest = join(directory, 'package.json');
  if (existsSync(manifest)) {
    const name = json(manifest).name;
    if (name) {
      if (workspaces.has(name)) throw new Error(`Duplicate workspace name: ${name}`);
      workspaces.set(name, directory);
    }
  }
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`Symlink in source boundary: ${rel(path)}`);
    if (entry.isDirectory()) collect(path, visited);
    else if (/\.(?:[cm]?ts|tsx|[cm]?js|jsx)$/i.test(entry.name)) sources.push(path);
  }
}

for (const directory of ['apps', 'backend', 'packages']) {
  const path = join(repo, directory);
  if (existsSync(path)) collect(path);
}
if (!sources.length) throw new Error('No module source inspected');

function optionsFor(file) {
  const config = ts.findConfigFile(dirname(file), ts.sys.fileExists);
  if (!config || rel(config).startsWith('../')) {
    return { module: ts.ModuleKind.NodeNext, moduleResolution: ts.ModuleResolutionKind.NodeNext };
  }
  if (!configs.has(config)) {
    const options = ts.getParsedCommandLineOfConfigFile(
      config,
      {},
      {
        ...ts.sys,
        onUnRecoverableConfigFileDiagnostic: (diagnostic) => {
          throw new Error(ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'));
        },
      },
    );
    if (!options) throw new Error(`Cannot read ${config}`);
    configs.set(config, options.options);
  }
  return configs.get(config);
}

function resolveImport(file, specifier) {
  if (specifier.includes('\\') || isAbsolute(specifier) || specifier.startsWith('file:')) {
    throw new Error(`Absolute or platform-specific import: ${specifier}`);
  }
  const options = optionsFor(file);
  const resolved = ts.resolveModuleName(specifier, file, options, ts.sys).resolvedModule;
  if (resolved) return rel(realpathSync(resolved.resolvedFileName));
  const workspace = [...workspaces.keys()].find(
    (name) => specifier === name || specifier.startsWith(name + '/'),
  );
  if (workspace) {
    const subpath = specifier.slice(workspace.length).replace(/^\//, '');
    const path = rel(resolve(workspaces.get(workspace), subpath));
    if (
      path !== rel(workspaces.get(workspace)) &&
      !path.startsWith(rel(workspaces.get(workspace)) + '/')
    ) {
      throw new Error(`Package path traversal: ${specifier}`);
    }
    return path;
  }
  if (
    specifier.startsWith('.') ||
    specifier.startsWith('#') ||
    Object.keys(options.paths ?? {}).some((pattern) => specifier.startsWith(pattern.split('*')[0]))
  ) {
    throw new Error(`Unresolved local import: ${specifier}`);
  }
  if (!isBuiltin(specifier)) throw new Error(`Unresolved dependency: ${specifier}`);
}

const domain = (path) => /^backend\/(?:domains|systems)\/[^/]+/.exec(path)?.[0];
function restricted(from, target) {
  if (process.platform === 'win32') {
    from = from.toLowerCase();
    target = target.toLowerCase();
  }
  if (/^packages\/contracts\//.test(target)) {
    return !/^packages\/contracts\/(?:public\/v\d+\/|openapi\/v\d+\.openapi\.json$)/.test(target);
  }
  if (!target.startsWith('backend/')) return false;
  if (from.startsWith('apps/') || from.startsWith('packages/')) return true;
  const owner = domain(from);
  return Boolean(owner && owner !== domain(target));
}

const violations = [];
let inspected = 0;
for (const file of sources) {
  const from = rel(file);
  const source = ts.createSourceFile(file, ts.sys.readFile(file), ts.ScriptTarget.Latest, true);
  const check = (node, argument) => {
    inspected++;
    try {
      if (!argument || !ts.isStringLiteralLike(argument))
        throw new Error('Nonliteral module specifier');
      const target = resolveImport(file, argument.text);
      if (target && restricted(from, target)) throw new Error(`Forbidden dependency → ${target}`);
      if (target?.startsWith('../') && !target.includes('/node_modules/')) {
        throw new Error(`Import outside repository: ${target}`);
      }
    } catch (error) {
      const line = source.getLineAndCharacterOfPosition(node.getStart()).line + 1;
      violations.push(`${from}:${line}: ${error.message}`);
    }
  };
  const visit = (node) => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) {
      check(node, node.moduleSpecifier);
    } else if (
      ts.isImportEqualsDeclaration(node) &&
      ts.isExternalModuleReference(node.moduleReference)
    ) {
      check(node, node.moduleReference.expression);
    } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
      check(node, node.argument.literal);
    } else if (
      ts.isCallExpression(node) &&
      (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
        (ts.isIdentifier(node.expression) && node.expression.text === 'require') ||
        (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'require'))
    )
      check(node, node.arguments[0]);
    ts.forEachChild(node, visit);
  };
  visit(source);
}

if (violations.length) throw new Error(violations.join('\n'));
console.log(
  `Boundaries: ${sources.length} files, ${inspected} imports, repository ${basename(repo)}`,
);
