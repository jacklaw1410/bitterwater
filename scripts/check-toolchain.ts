/**
 * Toolchain conformance CLI.
 *
 * Reads package.json (declared specs + overrides), bun.lock (resolved versions), and the CI
 * workflow (global vite-plus pins), then reports the verdict. Exits 0 when the triad is conformant,
 * 1 otherwise.
 *
 * Usage: bun scripts/check-toolchain.ts
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  checkToolchain,
  parseSpec,
  TOOLCHAIN_PACKAGES,
  TOOLCHAIN_ROLES,
  type ToolchainInput,
  type Verdict,
} from '../src/lib/toolchain-conformance';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Bun.lock is JSON with trailing commas (JSONC-lite). Strip them, string-aware, so strict
 * JSON.parse can read it.
 */
const stripTrailingCommas = (text: string): string => {
  let out = '';
  let inString = false;
  let escaped = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (inString) {
      out += ch;
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === ',') {
      let j = i + 1;
      while (j < text.length && /\s/.test(text[j])) j += 1;
      if (text[j] === '}' || text[j] === ']') continue; // drop trailing comma
    }
    out += ch;
  }
  return out;
};

const readJson = (file: string): Record<string, unknown> => {
  const path = join(root, file);
  return JSON.parse(stripTrailingCommas(readFileSync(path, 'utf8'))) as Record<string, unknown>;
};

const readManifest = () => {
  const pkg = readJson('package.json');
  const dependencies = (pkg.dependencies ?? {}) as Record<string, string>;
  const devDependencies = (pkg.devDependencies ?? {}) as Record<string, string>;
  const overrides = (pkg.overrides ?? {}) as Record<string, string>;
  return { pkg, dependencies, devDependencies, overrides };
};

const versionOf = (resolved: unknown): string | null => {
  if (!Array.isArray(resolved)) return null;
  const first = resolved[0];
  if (typeof first !== 'string') return null;
  const at = first.lastIndexOf('@');
  return at <= 0 ? null : first.slice(at + 1);
};

const readLock = () => {
  const lock = readJson('bun.lock');
  const packages = (lock.packages ?? {}) as Record<string, unknown>;
  const resolvedByRole: Partial<Record<string, string>> = {};
  const resolvedByPackage: Record<string, string[]> = {};
  for (const role of TOOLCHAIN_ROLES) {
    const viaAlias = versionOf(packages[role]);
    if (viaAlias !== null) resolvedByRole[role] = viaAlias;
    const pkg = TOOLCHAIN_PACKAGES[role];
    const versions = [viaAlias, versionOf(packages[pkg])].filter((v): v is string => v !== null);
    if (versions.length > 0) resolvedByPackage[pkg] = versions;
  }
  return { lock, resolvedByRole, resolvedByPackage };
};

const readCiPins = () => {
  const workflow = readFileSync(join(root, '.github', 'workflows', 'deploy.yml'), 'utf8');
  const pins: string[] = [];
  for (const match of workflow.matchAll(/bun\s+add\s+-g\s+vite-plus@([^\s'"\n]+)/g)) {
    pins.push(match[1]);
  }
  return pins;
};

// --- minimal semver range satisfaction (exact, ^, ~, >=, <=, >, <, *, ||, space conjunctions) ---

const parseVersion = (raw: string): number[] =>
  raw
    .trim()
    .split('.')
    .map((n) => Number.parseInt(n, 10));

const compareVersions = (a: number[], b: number[]): number => {
  for (let i = 0; i < 3; i += 1) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
};

const satisfiesPart = (version: number[], part: string): boolean => {
  if (part === '' || part === '*' || part === 'x') return true;
  const match = part.match(/^(>=|<=|>|<|\^|~)?(\d+(?:\.\d+){0,2})$/);
  if (match === null) return false;
  const op = match[1] ?? '';
  const target = parseVersion(match[2]);
  const cmp = compareVersions(version, target);
  if (op === '>=') return cmp >= 0;
  if (op === '<=') return cmp <= 0;
  if (op === '>') return cmp > 0;
  if (op === '<') return cmp < 0;
  if (op === '^') return version[0] === target[0] && cmp >= 0;
  if (op === '~') return version[0] === target[0] && version[1] === target[1] && cmp >= 0;
  return cmp === 0;
};

const satisfiesRange = (version: string, range: string): boolean =>
  range
    .split('||')
    .map((alternative) => alternative.trim().split(/\s+/))
    .some((parts) => parts.every((part) => satisfiesPart(parseVersion(version), part)));

const warnOnEngines = (pkg: Record<string, unknown>, notes: string[]) => {
  const engines = pkg.engines as { node?: unknown } | undefined;
  const nodeRange = engines?.node;
  if (typeof nodeRange !== 'string') return;
  if (!satisfiesRange(process.versions.node, nodeRange)) {
    notes.push(
      `engines.node is '${nodeRange}' but the running Node is ${process.versions.node} — informational, the package manager does not enforce engines`,
    );
  }
};

const format = (verdict: Verdict, input: ToolchainInput) => {
  for (const note of verdict.notes) console.log(`note: ${note}`);
  if (verdict.ok) {
    const anchor = parseSpec(input.declared['vite-plus'] ?? '').version ?? '?';
    const detail = TOOLCHAIN_ROLES.map(
      (role) => `${role} -> ${TOOLCHAIN_PACKAGES[role]}@${input.resolvedByRole[role] ?? '?'}`,
    ).join(', ');
    console.log(
      `toolchain conformance: OK — vite-plus ${anchor} (${detail}; CI pins: ${input.ciPins.join(', ')})`,
    );
    return;
  }
  for (const error of verdict.errors) console.error(`error: ${error}`);
};

const main = () => {
  const { pkg, dependencies, devDependencies, overrides } = readManifest();
  const declared: Record<string, string> = {};
  const notes: string[] = [];
  for (const role of TOOLCHAIN_ROLES) {
    if (devDependencies[role] !== undefined) declared[role] = devDependencies[role];
    else if (dependencies[role] !== undefined) {
      declared[role] = dependencies[role];
      notes.push(`'${role}' is declared in dependencies rather than devDependencies`);
    }
  }
  const { resolvedByRole, resolvedByPackage } = readLock();
  warnOnEngines(pkg, notes);

  const input: ToolchainInput = {
    declared,
    overrides,
    resolvedByRole,
    resolvedByPackage,
    ciPins: readCiPins(),
  };
  const verdict = checkToolchain(input);
  format({ ...verdict, notes: [...notes, ...verdict.notes] }, input);
  process.exitCode = verdict.ok ? 0 : 1;
};

main();
