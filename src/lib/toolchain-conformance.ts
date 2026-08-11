/**
 * Pure toolchain conformance check for the vite-plus triad (vite / vitest / vite-plus).
 *
 * The triad must move as one unit: the three roles are pinned together in package.json
 * (devDependencies + overrides), resolved consistently by the lockfile, and matched by the CI
 * workflow's global `bun add -g` pin. Floating `latest` specs and mixed resolved versions are the
 * July-outage crash class ("Running mixed versions is not supported").
 *
 * This module is deliberately pure: it takes explicit inputs and returns a verdict, with no file
 * access, no network, and no environment reads.
 */

export const TOOLCHAIN_ROLES = ['vite', 'vitest', 'vite-plus'] as const;

export type ToolchainRole = (typeof TOOLCHAIN_ROLES)[number];

/** The package each role must resolve to (via npm: aliases). */
export const TOOLCHAIN_PACKAGES: Record<ToolchainRole, string> = {
  vite: '@voidzero-dev/vite-plus-core',
  vitest: '@voidzero-dev/vite-plus-test',
  'vite-plus': 'vite-plus',
};

export interface ToolchainInput {
  /**
   * Spec strings declared in package.json (role -> spec), e.g.
   * `npm:@voidzero-dev/vite-plus-core@0.1.20`.
   */
  declared: Partial<Record<ToolchainRole, string>>;
  /** Spec strings declared in package.json overrides (role -> spec, pinned roles only). */
  overrides: Partial<Record<ToolchainRole, string>>;
  /** Versions the lockfile's alias entries resolve to (role -> `0.1.20`). */
  resolvedByRole: Partial<Record<ToolchainRole, string>>;
  /** Distinct versions the lockfile holds per toolchain package (package -> versions). */
  resolvedByPackage: Partial<Record<string, string[]>>;
  /** Versions from `bun add -g vite-plus@X.Y.Z` lines in the CI workflow. */
  ciPins: string[];
}

export interface Verdict {
  ok: boolean;
  /** Fatal problems; each names expected vs actual and where to fix. */
  errors: string[];
  /** Non-fatal observations. */
  notes: string[];
}

/**
 * Any character outside a plain version string (digits, dots, dashes, plus, letters) marks a
 * range/float.
 */
const RANGE_CHAR = /[^0-9A-Za-z.\-+]/;

export interface ParsedSpec {
  /** The package name when the spec is an `npm:` alias, otherwise null. */
  aliasName: string | null;
  /** The exact version when the spec is an exact pin, otherwise null. */
  version: string | null;
}

export function parseSpec(spec: string): ParsedSpec {
  let rest = spec.trim();
  let aliasName: string | null = null;
  if (rest.startsWith('npm:')) {
    rest = rest.slice(4);
    const at = rest.lastIndexOf('@');
    if (at <= 0) return { aliasName: rest, version: null };
    aliasName = rest.slice(0, at);
    rest = rest.slice(at + 1);
  }
  if (rest === '' || rest === 'latest' || /[xX]/.test(rest) || RANGE_CHAR.test(rest)) {
    return { aliasName, version: null };
  }
  return { aliasName, version: rest };
}

export function checkToolchain(input: ToolchainInput): Verdict {
  const errors: string[] = [];
  const notes: string[] = [];

  const anchor = parseSpec(input.declared['vite-plus'] ?? '');
  if (anchor.version === null) {
    const declared = input.declared['vite-plus'] ?? '(missing)';
    errors.push(
      `package.json devDependencies: 'vite-plus' spec '${declared}' is not an exact pin — floating 'latest'/range specs reintroduce the mixed-version hazard; pin an exact version such as 0.1.20`,
    );
  }

  for (const role of TOOLCHAIN_ROLES) {
    const spec = input.declared[role];
    const parsed = spec === undefined ? null : parseSpec(spec);
    if (parsed === null || parsed.version === null) {
      errors.push(
        `package.json devDependencies: '${role}' spec '${spec ?? '(missing)'}' is not an exact pin — pin '${TOOLCHAIN_PACKAGES[role]}' (via npm: alias if aliased) at the same exact version as vite-plus`,
      );
      continue;
    }
    if (parsed.aliasName !== null && parsed.aliasName !== TOOLCHAIN_PACKAGES[role]) {
      errors.push(
        `package.json devDependencies.${role}: alias 'npm:${parsed.aliasName}@${parsed.version}' points at the wrong package — expected 'npm:${TOOLCHAIN_PACKAGES[role]}@${parsed.version}'`,
      );
    }
    if (anchor.version !== null && parsed.version !== anchor.version) {
      errors.push(
        `package.json devDependencies.${role} pins ${parsed.version} but 'vite-plus' pins ${anchor.version} — the triad must move as one unit; update all three together`,
      );
    }
  }

  for (const role of TOOLCHAIN_ROLES) {
    const spec = input.overrides[role];
    if (spec === undefined) {
      notes.push(
        `package.json overrides has no '${role}' entry — transitive drift is not guarded for this role`,
      );
      continue;
    }
    const parsed = parseSpec(spec);
    if (parsed.version === null) {
      errors.push(
        `package.json overrides.${role}: spec '${spec}' is not an exact pin — the overrides block was the original drift vector; pin an exact version`,
      );
    } else {
      if (parsed.aliasName !== null && parsed.aliasName !== TOOLCHAIN_PACKAGES[role]) {
        errors.push(
          `package.json overrides.${role}: alias 'npm:${parsed.aliasName}@${parsed.version}' points at the wrong package — expected 'npm:${TOOLCHAIN_PACKAGES[role]}@${parsed.version}'`,
        );
      }
      if (anchor.version !== null && parsed.version !== anchor.version) {
        errors.push(
          `package.json overrides.${role} pins ${parsed.version} but 'vite-plus' pins ${anchor.version} — the overrides must follow the triad`,
        );
      }
    }
  }

  for (const role of TOOLCHAIN_ROLES) {
    const declared = input.declared[role];
    const declaredVersion = declared === undefined ? null : parseSpec(declared).version;
    const resolved = input.resolvedByRole[role];
    if (resolved === undefined) {
      errors.push(`bun.lock has no resolved entry for '${role}' — run bun install`);
      continue;
    }
    if (declaredVersion !== null && resolved !== declaredVersion) {
      errors.push(
        `bun.lock resolves '${role}' to ${resolved} but package.json devDependencies pins ${declaredVersion} — run bun install to reconcile`,
      );
    }
  }

  for (const role of TOOLCHAIN_ROLES) {
    const pkg = TOOLCHAIN_PACKAGES[role];
    const versions = input.resolvedByPackage[pkg];
    if (versions === undefined || versions.length === 0) {
      errors.push(`bun.lock has no entry for '${pkg}' — run bun install`);
      continue;
    }
    const distinct = [...new Set(versions)];
    if (distinct.length > 1) {
      errors.push(
        `bun.lock contains mixed versions of ${pkg}: ${distinct.join(', ')} — the mixed-version crash class from the July outage; run bun install to consolidate`,
      );
    } else {
      const resolved = input.resolvedByRole[role];
      if (resolved !== undefined && distinct[0] !== resolved) {
        errors.push(
          `bun.lock '${pkg}' resolves to ${distinct[0]} but the '${role}' alias resolves to ${resolved} — run bun install to reconcile`,
        );
      }
    }
  }

  if (input.ciPins.length === 0) {
    errors.push(
      "no 'bun add -g vite-plus@X.Y.Z' pin found in the CI workflow — the workflow must pin the same exact version as package.json",
    );
  }
  for (const pin of input.ciPins) {
    if (anchor.version !== null && pin !== anchor.version) {
      errors.push(
        `CI workflow pins vite-plus@${pin} but package.json pins ${anchor.version} — update the workflow's global install line`,
      );
    }
  }

  return { ok: errors.length === 0, errors, notes };
}
