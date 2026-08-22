# Fix the check gate: `bun run check` fails on fresh install with svelte-check's TypeScript 7 error

## Goal

Make `bun run check` (and therefore the full `bun run verify` gate) pass on a fresh, dependency-consistent install, using svelte-check's own TypeScript 7 guidance.

## Context

Verified in the repo:

- **Issue**: `jacklaw1410/bitterwater#78` (state `OPEN`, label `ready-for-agent`) — the issue body is the exact task prompt. Remote is `git@github.com:jacklaw1410/bitterwater.git`, not the org slug used by the GitHub MCP server (`anomalyco/bitterwater` 404s).
- **`package.json` devDependency**: `"typescript": "^7.0.0"` (line 57). `bun.lock` resolves it to `typescript@7.0.2`.
- **Install layout**: `node_modules/typescript` is `7.0.2`, distributed as a native binary package (`typescript@7.0.2` with per-platform `@typescript/typescript-<platform>` optionalDependencies in `bun.lock`, lines 470–508).
- **Failure mechanism (verified from svelte-check source)**: `svelte-check` runs `bin/ts-version-check.js`, which inspects `typescript/package.json`. Major `>=7` without the `--tsgo`/`--tsgo-experimental-api` flag throws exactly: _"TypeScript 7 support currently requires both TypeScript 7 and TypeScript 6 installed in your project, and requires using the --tsgo or --tsgo-experimental-api flag. You can setup both version with an npm alias via the following command. `npm install --save-dev typescript@~6 @typescript/native@npm:typescript@7`"_ (from `node_modules/svelte-check/bin/ts-version-check.js` and `README.md` "TypeScript 7 support" section).
- **`bun run check` script** (package.json line 11): `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json` — no `--tsgo` flag, so it fails whenever the resolved `typescript` major is 7.
- **`bun run verify` script** (package.json line 16): `bun scripts/check-toolchain.ts && CI=1 vp check && CI=1 vp test --run && CI=1 vp build && echo 'verify: PASS ...'`. `bun run check` is not part of `verify`; `verify` fails on a fresh install because the svelte-check failure is a repo-state defect the team will hit, and because its gate intent (per DEVELOPMENT.md "Verification") is check + test + build + conformance.
- **Toolchain conformance** (`scripts/check-toolchain.ts`): only validates the `vite`/`vitest`/`vite-plus` triad (manifest + overrides + lockfile resolutions + CI pin). It does not reference `typescript`; a `typescript` devDependency/lockfile change does not affect it. CI (`deploy.yml`: `bun install` → `bun scripts/check-toolchain.ts` → build/test/e2e) does not run `bun run check`.
- **Peer-range constraints that rule out staying on TS 7 for the type-check path**: `svelte-check@4.7.5` peer `typescript "^5.0.0 || ^6.0.0"`; `svelte2tsx@0.7.59` peer `typescript "^4.9.4 || ^5.0.0 || ^6.0.0"`; `@typescript-eslint/*@8.67.0` and `typescript-eslint@8.67.0` peer `typescript ">=4.8.4 <6.1.0"`; `@sveltejs/kit@2.70.2` peer `typescript "^5.3.3 || ^6.0.0"`. The only non-TS6-capped peer is `@voidzero-dev/vite-plus-core@0.2.9` (`^5 || ^6 || ^7`).
- **DEVELOPMENT.md** (line 55): `build-storybook` is excluded from `verify` because "svelte2tsx has no TS 7 support" — TS 7 is an upstream blocker for the Storybook toolchain. Renovate groups `typescript` into its own group (`renovate.json`).
- **Checkout state**: fresh, no relevant uncommitted changes.

Two sanctioned fixes (svelte-check guidance + issue):

- **Route A — dual install + experimental flag**: set `typescript` to `~6` and add `@typescript/native@npm:typescript@7` devDependency, and run svelte-check with `--tsgo` (or `--tsgo-experimental-api`). Keeps TS 7 for the tsgo path but adds an experimental flag and a second TS install.
- **Route B — pin to ~6**: set `typescript` to `~6` (no other changes). Fully satisfied every repo peer range, no script change, no experimental flag, and consistent with DEVELOPMENT.md's noted svelte2tsx/TS7 blocker. **Recommended as the minimal fix that does not contradict any repo fact.**

## Requirements

- **REQ-1**: `package.json`'s `typescript` devDependency no longer ranges to TS 7 without svelte-check tsgo support — either pinned to `~6`, or `~6` plus `@typescript/native@npm:typescript@7` with the svelte-check invocation passing `--tsgo` / `--tsgo-experimental-api`.
- **REQ-2**: `bun.lock` is regenerated to match the exact post-change `package.json` (a fresh `bun install` must resolve without network-time disagreements and the lockfile must record the changed `typescript` package).
- **REQ-3**: `bun run check` exits 0 (svelte-check's TS version check passes and no type-checking errors are introduced; no changes to application code are allowed, so no new type errors should appear).
- **REQ-4**: `bun run verify` exits 0 on a fresh install (conformance + `vp check` + `vp test --run` + `vp build` all pass in CI order).
- **REQ-5**: No changes to `scripts/check-toolchain.ts`, the vite/vitest/vite-plus triad, `.github/workflows/deploy.yml`, or application source; the fix is confined to dependency files (and, only for Route A, the `check`/`check:watch` scripts).
- **REQ-6**: Committed with a Conventional Commit referencing `#78` (e.g. `chore(deps): pin typescript to ~6 for svelte-check compatibility (#78)` or similar), subject ≤72 chars.
- **REQ-7**: The installed `typescript` version after the fix matches a version within the new spec (e.g. a `6.x` for "~6") and, for Route B, also satisfies `svelte2tsx`, `@typescript-eslint`, and `@sveltejs/kit` peer ranges.

## Acceptance criteria

- [ ] In a worktree cloned fresh (or after deleting `node_modules` and `bun.lock` regeneration), `bun install` succeeds and installs `typescript@6.x` (Route B) or `typescript@6.x` + `@typescript/native@7.x` (Route A), with `bun.lock` committed.
- [ ] `bun run check` exits 0 with no `TypeScript 7 support currently requires...` error and no new type diagnostics.
- [ ] `bun run verify` exits 0 and prints the `verify: PASS - conformance, check, test, build (CI order)` banner.
- [ ] `git diff` touches only `package.json`, `bun.lock` (Route B) — and, for Route A, `package.json` `check`/`check:watch` scripts.
- [ ] Commit message is Conventional Commits and references `#78`.
- [ ] CI (`deploy.yml` conformance + build + tests) is unaffected — the change introduces no toolchain drift.

## Out of scope

- Adding/fixing native TS 7 support in `svelte2tsx`, `svelte-check`, Storybook, or `typescript-eslint` (upstream work).
- Changing `scripts/check-toolchain.ts`, the `vite`/`vitest`/`vite-plus` triad, overrides, or `deploy.yml`.
- Fixing unrelated dead code, or migrating application code to TS 7.
- The separate (`ready-for-agent`) issue about restoring Storybook's build with a private TS5 for svelte2tsx.

## Open questions

- **Route choice**: Route B (pin `~6`, no flags) is recommended; Route A (dual install + `--tsgo`) is equally sanctioned by the issue. Confirm whether the user prefers adopting the experimental tsgo path (which leaves `bun run check` green but adds the `--tsgo` flag and a second TS install) over the minimal pin.
- **Failure reproduction**: the exact CLI failure was confirmed from `ts-version-check.js` + fresh-clean state by inspection only — the implementation must reproduce it once (`bun install` on a reset lockfile/repo) before applying the fix, per Section Context. The existing workspace already shows `node_modules/typescript@7.0.2` vs `svelte-check`'s TS7 check.
- **Issue tracker**: issue #78 was read via the `gh` CLI against `jacklaw1410/bitterwater`; the GitHub MCP server's resolved slug (`anomalyco/bitterwater`) returns 404, so all GitHub operations for this fix should go through the workspace remote.
