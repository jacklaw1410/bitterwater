import { describe, expect, it } from 'vitest';

import { checkToolchain, parseSpec, type ToolchainInput } from './toolchain-conformance';

/**
 * 0.2.x consumer shape: vite aliases the core package at the vite-plus version; vitest is the plain
 * package at the version vite-plus itself declares (no more
 *
 * Legacy vite-plus-test wrapper — that track ended at 0.1.x).
 */
const conformant: ToolchainInput = {
  vitestExpected: '4.1.10',
  declared: {
    vite: 'npm:@voidzero-dev/vite-plus-core@0.2.9',
    vitest: '4.1.10',
    'vite-plus': '0.2.9',
  },
  overrides: {
    vite: 'npm:@voidzero-dev/vite-plus-core@0.2.9',
    vitest: '4.1.10',
  },
  resolvedByRole: { vite: '0.2.9', vitest: '4.1.10', 'vite-plus': '0.2.9' },
  resolvedByPackage: {
    '@voidzero-dev/vite-plus-core': ['0.2.9'],
    vitest: ['4.1.10'],
    'vite-plus': ['0.2.9'],
  },
  ciPins: ['0.2.9', '0.2.9', '0.2.9'],
};

describe('parseSpec', () => {
  it('parses a plain exact pin', () => {
    expect(parseSpec('0.2.9')).toEqual({ aliasName: null, version: '0.2.9' });
  });

  it('parses an npm: alias with an exact version', () => {
    expect(parseSpec('npm:@voidzero-dev/vite-plus-core@0.2.9')).toEqual({
      aliasName: '@voidzero-dev/vite-plus-core',
      version: '0.2.9',
    });
  });

  it('rejects latest, ranges, and versionless aliases', () => {
    expect(parseSpec('latest').version).toBeNull();
    expect(parseSpec('^0.2.9').version).toBeNull();
    expect(parseSpec('0.2.x').version).toBeNull();
    expect(parseSpec('npm:@voidzero-dev/vite-plus-core').version).toBeNull();
    expect(parseSpec('npm:@voidzero-dev/vite-plus-core@').version).toBeNull();
    expect(parseSpec('>=24.19.0').version).toBeNull();
  });
});

describe('checkToolchain', () => {
  it('passes a fully conformant 0.2.x toolchain', () => {
    const verdict = checkToolchain(conformant);
    expect(verdict.ok).toBe(true);
    expect(verdict.errors).toEqual([]);
  });

  it('rejects a floating vite-plus spec', () => {
    const verdict = checkToolchain({
      ...conformant,
      declared: { ...conformant.declared, 'vite-plus': 'latest' },
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.errors.some((e) => e.includes('vite-plus') && e.includes('exact pin'))).toBe(
      true,
    );
  });

  it('rejects a floating override spec', () => {
    const verdict = checkToolchain({
      ...conformant,
      overrides: { ...conformant.overrides, vite: 'npm:@voidzero-dev/vite-plus-core@latest' },
    });
    expect(verdict.ok).toBe(false);
    expect(
      verdict.errors.some((e) => e.includes('overrides.vite') && e.includes('exact pin')),
    ).toBe(true);
  });

  it('rejects a versionless alias', () => {
    const verdict = checkToolchain({
      ...conformant,
      declared: { ...conformant.declared, vite: 'npm:@voidzero-dev/vite-plus-core' },
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.errors.some((e) => e.includes("devDependencies: 'vite'"))).toBe(true);
  });

  it('rejects a drifted vite role (not at the vite-plus anchor)', () => {
    const verdict = checkToolchain({
      ...conformant,
      declared: { ...conformant.declared, vite: 'npm:@voidzero-dev/vite-plus-core@0.2.8' },
    });
    expect(verdict.ok).toBe(false);
    expect(
      verdict.errors.some((e) => e.includes('vite') && e.includes('0.2.8') && e.includes('0.2.9')),
    ).toBe(true);
  });

  it('rejects a vitest that does not match the version vite-plus declares', () => {
    const verdict = checkToolchain({
      ...conformant,
      declared: { ...conformant.declared, vitest: '4.1.9' },
    });
    expect(verdict.ok).toBe(false);
    expect(
      verdict.errors.some(
        (e) => e.includes('vitest') && e.includes('4.1.9') && e.includes('4.1.10'),
      ),
    ).toBe(true);
  });

  it('rejects a vitest alias to the dead test-wrapper track', () => {
    const verdict = checkToolchain({
      ...conformant,
      declared: { ...conformant.declared, vitest: 'npm:@voidzero-dev/vite-plus-test@0.1.24' },
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.errors.some((e) => e.includes('vitest') && e.includes('wrong package'))).toBe(
      true,
    );
  });

  it('rejects an override that drifts from its role version', () => {
    const verdict = checkToolchain({
      ...conformant,
      overrides: { ...conformant.overrides, vitest: '4.1.9' },
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.errors.some((e) => e.includes('overrides.vitest') && e.includes('4.1.9'))).toBe(
      true,
    );
  });

  it('rejects a lockfile that resolves a role to a different version than declared', () => {
    const verdict = checkToolchain({
      ...conformant,
      resolvedByRole: { ...conformant.resolvedByRole, vite: '0.2.8' },
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.errors.some((e) => e.includes('bun.lock resolves') && e.includes('0.2.8'))).toBe(
      true,
    );
  });

  it('rejects mixed versions of a toolchain package in the lockfile', () => {
    const verdict = checkToolchain({
      ...conformant,
      resolvedByPackage: { ...conformant.resolvedByPackage, vitest: ['4.1.9', '4.1.10'] },
    });
    expect(verdict.ok).toBe(false);
    expect(
      verdict.errors.some(
        (e) => e.includes('mixed versions') && e.includes('4.1.9') && e.includes('4.1.10'),
      ),
    ).toBe(true);
  });

  it('rejects a CI pin that disagrees with the declared toolchain', () => {
    const verdict = checkToolchain({ ...conformant, ciPins: ['0.2.8'] });
    expect(verdict.ok).toBe(false);
    expect(
      verdict.errors.some(
        (e) => e.includes('CI workflow pins vite-plus@0.2.8') && e.includes('0.2.9'),
      ),
    ).toBe(true);
  });

  it('rejects a workflow with no vite-plus pin at all', () => {
    const verdict = checkToolchain({ ...conformant, ciPins: [] });
    expect(verdict.ok).toBe(false);
    expect(
      verdict.errors.some((e) => e.includes("no 'bun add -g vite-plus@X.Y.Z' pin found")),
    ).toBe(true);
  });

  it('rejects an alias pointing at the wrong package', () => {
    const verdict = checkToolchain({
      ...conformant,
      declared: { ...conformant.declared, vite: 'npm:@wrong/pkg@0.2.9' },
    });
    expect(verdict.ok).toBe(false);
    expect(
      verdict.errors.some((e) => e.includes('wrong package') && e.includes('@wrong/pkg')),
    ).toBe(true);
  });

  it('rejects a missing declared role', () => {
    const verdict = checkToolchain({
      ...conformant,
      declared: { vite: conformant.declared.vite, 'vite-plus': conformant.declared['vite-plus'] },
    });
    expect(verdict.ok).toBe(false);
    expect(verdict.errors.some((e) => e.includes("devDependencies: 'vitest'"))).toBe(true);
  });

  it('passes with a note when an override entry is missing', () => {
    const verdict = checkToolchain({
      ...conformant,
      overrides: { vite: conformant.overrides.vite },
    });
    expect(verdict.ok).toBe(true);
    expect(verdict.notes.some((n) => n.includes("overrides has no 'vitest' entry"))).toBe(true);
  });
});
