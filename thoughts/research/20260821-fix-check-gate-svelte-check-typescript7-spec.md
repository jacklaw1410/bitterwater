# Fix the check gate: svelte-check vs TypeScript 7

## Goal

Make `bun run check` and `bun run verify` exit 0 on a fresh install by resolving svelte-check's "TypeScript 7 support currently requires both TypeScript 7 and TypeScript 6 installed … and requires using the --tsgo or --tsgo-experimental-api flag" error, so the repo's check gate no longer blocks contributors.

## Context

Verified in repo (all read-only):

- `package.json:57` declares `"typescript": "^7.0.0"`; installed and locked at `7.0.2` (`bun.lock` line 1014, `node_modules/typescript/package.json` → `"version": "7.0.2"`).
- `package.json:11` runs the check gateway: `"check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"`. `bun run check` is the failing command.
- The failure comes from `node_modules/svelte-check/bin/ts-version-check.js`. It reads `require('typescript/package.json').version`; when the major is `>= 7` it throws exactly the reported message (lines 16–38). Its declared supported range is `TypeScript >= 5.0 and <= 6.0` (line 16).
- The thrown error text is svelte-check's own guidance: `npm install --save-dev typescript@~6 @typescript/native@npm:typescript@7`, or pin `typescript` to `~6` (lines 32–36).
- `bun run verify` (`package.json:16`) runs `bun scripts/check-toolchain.ts && CI=1 vp check && CI=1 vp test --run && CI=1 vp build`. It does NOT invoke `bun run check` today, but the task requires both to pass after the fix.
- `scripts/check-toolchain.ts` / `src/lib/toolchain-conformance.ts` only guard the vite/vitest/vite-plus triad (`TOOLCHAIN_ROLES = ['vite','vitest','vite-plus']`). **TypeScript is not part of the conformance gate**, so changing the `typescript` devDependency spec cannot trip step 1 of `verify`.
- `vite.config.ts` `lint.options` has `typeAware: true` and `typeCheck` commented out (`// typeCheck: true`), so `vp check` (format+lint via oxlint, implemented in vite-plus's native binding) does not invoke svelte-check/tsc — the gate failure is isolated to the `bun run check` script.
- `node_modules/svelte2tsx/package.json` declares peer `"typescript": "^4.9.4 || ^5.0.0 || ^6.0.0"` (TS 7 not supported). Under the fix, svelte2tsx's `require('typescript')` must resolve a version in that range.
- Related issue #54 ("restore storybook build — private TS5 for svelte2tsx") documents the same root cause for `build-storybook` (excluded from verify) and chose to keep the project `typescript` on `^7.0.0` for storybook's private compiler. This task is scoped to `check`/`verify`, not storybook, and explicitly authorizes changing the project `typescript` spec.

## Requirements

- REQ-1: `bun run check` exits 0 on a fresh install (no svelte-check TS-7 gate error, no diagnostic errors). Observable outcome: `bun run check` prints no "TypeScript 7 support currently requires both TypeScript 7 and TypeScript 6" text and exits with code 0.
- REQ-2: `bun run verify` exits 0 end-to-end (toolchain conformance → `vp check` → unit tests → production build all pass, in order, per DEVELOPMENT.md).
- REQ-3: `bun.lock` is regenerated to match the updated `package.json` so `bun install --frozen-lockfile` (CI/Docker path) succeeds. Observable outcome: `bun scripts/check-toolchain.ts` still passes and there is no lockfile/manifest spec mismatch.
- REQ-4: The resolved TypeScript that svelte-check/svelte2tsx consumes falls within svelte-check's supported `>= 5.0 && <= 6.0` range. Observable outcome: `bun run check` no longer hits the `ts-version-check.js` throw for major `>= 7`.
- REQ-5: No project code/format changes are introduced solely to mask the failure. Observable outcome: the diff touches only dependency specs, `bun.lock`, and (if Option A is chosen) the `check`/`check:watch` scripts and the two new TS deps.

## Acceptance criteria

- [ ] `bun run check` completes successfully on a clean checkout (exit 0) — the original failing command is green.
- [ ] `bun run verify` completes successfully (exit 0): conformance OK, `vp check` clean, unit tests pass, production build succeeds.
- [ ] `bun.lock` is regenerated and consistent with the new `package.json`; `bun install --frozen-lockfile` does not error.
- [ ] No unrelated code, config, or formatting changes are in the diff (surgical change only; AGENTS.md "Surgical Changes").
- [ ] A human reviewer can run `bun run check` and `bun run verify` on a fresh install and observe both pass.
- [ ] Conventional Commit message used for the fix (e.g. `chore(deps): ...` or `fix: ...`), referencing issue #74.

## Out of scope

- Fixing `build-storybook` or the storybook/svelte2tsx private-TS mechanism (issue #54 handles that separately).
- Upstream TypeScript 7 support in svelte-check/svelte2tsx/storybook.
- Any runtime or UI behavior changes.
- Upgrading/downgrading any dependency other than `typescript` (and, under Option A, adding `@typescript/native@npm:typescript@7` plus the `--tsgo`-family flag).

## Open questions

- Which of the two svelte-check-endorsed approaches should be implemented?
  - **Option A (TS7-native):** add `typescript@~6` + `@typescript/native@npm:typescript@7`, and pass `--tsgo-experimental-api` to `svelte-check` in the `check`/`check:watch` scripts. Keeps TS7 as the compiler but adds two deps and a flag; `--tsgo-experimental-api` cannot be combined with `--incremental` (svelte-check internals) and is an experimental path.
  - **Option B (pin `typescript` to `~6`):** change `typescript` spec to `~6` and regenerate `bun.lock`. Simplest, single-dep change, no script edit, satisfies svelte2tsx's and svelte-check's supported ranges. Recommended under AGENTS.md "Simplicity First".
  - Note: Option B conflicts with issue #54's stated preference to keep project TS on 7.x — but that preference was for the _storybook_ compiler, and #74 explicitly lists "pin typescript to ~6" as an acceptable fix. The implementer should pick one and document the choice; no further behavior depends on it.

## Non-negotiable deliverable

- Spec file: `thoughts/research/20260821-fix-check-gate-svelte-check-typescript7-spec.md`.
