# Fix the repo's check gate: `bun run check` fails on TypeScript 7

## Goal

Make `bun run check` and `bun run verify` pass again on a fresh install by restoring a TypeScript version that the repo's type tooling (svelte-check 4.7.5, typescript-eslint 8.67.0, @sveltejs/kit 2.70.2) actually supports.

## Context

Verified facts (all read from the repo at `bw/task-b3-1787404881505`):

- `package.json` devDependency is `"typescript": "^7.0.0"` (line 57). `bun.lock` resolves it to `typescript@7.0.2`, including the `@typescript/typescript-*` optional platform packages at `7.0.2`. 7.0.2 is also the npm `latest` dist-tag (verified against the npm registry).
- The bump to `^7.0.0` came from renovate: commit `chore(deps): update dependency typescript to v7 (#20)` changed `^6.0.3` → `^7.0.0`. The pre-bump, previously-healthy spec was `^6.0.3`. `main`'s `package.json` also carries `^7.0.0`, so this affects main too.
- `bun run check` = `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`; `bun run verify` = `bun scripts/check-toolchain.ts && CI=1 vp check && CI=1 vp test --run && CI=1 vp build && echo 'verify: PASS …'`. `vp` is the repo's pinned toolchain runner; scripts are unchanged from main.
- The failure reproduces locally: `bunx svelte-check --version` throws from `node_modules/svelte-check/bin/ts-version-check.js`:
  `TypeScript 7 support currently requires both TypeScript 7 and TypeScript 6 installed in your project, and requires using the --tsgo or --tsgo-experimental-api flag.` The check `major < 7` fails for 7.0.2; svelte-check's own peerDependency is `"typescript": "^5.0.0 || ^6.0.0"`.
- svelte-check's built-in guidance (the throw message, and the `formatTsGoNotFoundError` path) is `npm install --save-dev typescript@~6 @typescript/native@npm:typescript@7`. The repo's `check` script has no `--tsgo`/`--tsgo-experimental-api` flag today.
- Version support matrix (verified from installed `node_modules/*/package.json`):
  - `svelte-check@4.7.5` peer: `typescript ^5.0.0 || ^6.0.0`; `ts-version-check.js` hard-errors on major ≥ 7.
  - `typescript-eslint@8.67.0`, `@typescript-eslint/parser` (all `@typescript-eslint/*@8.67.0`): peer `typescript >=4.8.4 <6.1.0` — already violated by 7.0.2.
  - `@sveltejs/kit@2.70.2` optional peer: `typescript ^5.3.3 || ^6.0.0`.
- `@storybook/svelte-vite@10.5.7` _depends on_ `typescript ^4.9.4 || ^5.0.0` (its own nested copy) — unaffected by the root devDependency.
- Toolchain conformance (`scripts/check-toolchain.ts`, `src/lib/toolchain-conformance.ts`) only covers the `vite` / `vitest` / `vite-plus` triad + CI pins — it never inspects `typescript`, so a `typescript` pin change cannot trip it. Triad is unchanged.
- No `tsgo` / `@typescript/native` / other TS-7 requirement exists anywhere in the repo's own code, configs, or docs (only in `node_modules` and `bun.lock`); nothing requires TS 7.
- CI (`.github/workflows/deploy.yml`) does not run `bun run check`; it runs conformance + `vp build` + `vp test` per job. `bun run verify` covers all CI steps plus `vp check` plus `svelte-check`, so passing `verify` locally is the authoritative gate. (Known broken and excluded from verify: `build-storybook` — DEVELOPMENT.md attributes it to svelte2tsx lacking TS 7 support.)
- npm registry: stable 6.x releases are `6.0.2` and `6.0.3`; `~6.0.3` = `>=6.0.3 <6.1.0`, satisfying all three peers above and matching the prompt's "pin typescript to ~6" instruction.

Recommended approach (matches AGENTS.md simplicity/surgical change and repo history): pin the root `typescript` devDependency to a 6.0.x range, regenerate `bun.lock`, no script changes. The dual-install alternative (`@typescript/native@npm:typescript@7` + a `--tsgo`/`--tsgo-experimental-api` flag on the `check` script) is a valid svelte-check-endorsed path but is heavier and not required to make the gates pass.

## Requirements

- REQ-1: Change the `typescript` devDependency spec in `package.json` from `"^7.0.0"` to a 6.0.x pin, `"~6.0.3"`. Observable outcome: `bun install` resolves the root `typescript` to version `6.0.3` (from `~6.0.3`), and `node_modules/typescript/package.json` reports `"version": "6.0.3"` (major < 7).
- REQ-2: Regenerate `bun.lock` so its root `typescript` resolution matches the new spec (6.0.3), and remove the TS 7.0.2 entries (`typescript@7.0.2` and the `@typescript/typescript-*@7.0.2` platform packages). Observable outcome: `grep '7.0.2' bun.lock` returns no typescript entries; the first `"typescript"` key in the lock maps to `6.0.3`.
- REQ-3: `bun run check` exits 0 on a clean install. Observable outcome: after `bun install` and `bun run check`, the process exits 0, svelte-check reports diagnostics without error, and the `TypeScript 7 support currently requires…` throw message never appears.
- REQ-4: `bun run verify` exits 0. Observable outcome: `bun run verify` completes all four stages and prints the final line `verify: PASS - conformance, check, test, build (CI order)` with exit code 0.
- REQ-5: Surgical diff. Observable outcome: the `package.json` diff touches only the `typescript` devDependency line (no script, dependency, or peer changes); the only other file changed is `bun.lock`.
- REQ-6: Toolchain conformance is preserved. Observable outcome: `bun scripts/check-toolchain.ts` still exits 0 with `toolchain conformance: OK`, because the `vite` / `vitest` / `vite-plus` triad and CI pins are untouched.
- REQ-7: The fix is committed with a conventional message referencing the gate fix and includes exactly `package.json` + `bun.lock`. Observable outcome: `git show --stat HEAD` contains only those two files and the subject matches `fix:` (e.g. `fix: pin typescript to ~6 to restore svelte-check gate`).

## Acceptance criteria

- [ ] `bun install` succeeds and installs `typescript@6.0.3`.
- [ ] `bun run check` exits 0 with no `ts-version-check`/"TypeScript 7 support" throw.
- [ ] `bun run verify` exits 0 and prints the `verify: PASS - conformance, check, test, build (CI order)` banner.
- [ ] `bun scripts/check-toolchain.ts` exits 0.
- [ ] `bun.lock` regenerated; no `typescript@7.0.2` or `@typescript/typescript-*@7.0.2` entries remain.
- [ ] `git diff main -- package.json` shows only the `typescript` spec line; scripts unchanged.
- [ ] A conventional `fix:` commit containing only `package.json` and `bun.lock` exists.
- [ ] Human reviewer: no unrelated formatting, doc, or dependency changes slipped in.

## Out of scope

- Upgrading svelte-check / typescript-eslint / @sveltejs/kit / svelte2tsx to TS 7-compatible releases.
- Adopting the dual-install path (`@typescript/native@npm:typescript@7` + `--tsgo`/`--tsgo-experimental-api` on the `check` script).
- Changing CI workflow steps, `vite`/`vitest`/`vite-plus` pins, `overrides`, or the toolchain-conformance logic.
- Fixing `build-storybook` (documented upstream breakage; excluded from `verify`).
- Anything outside the `typescript` dependency and the lockfile.

## Open questions

- Exact pin spec choice: `~6.0.3` (recommended, matches "pin typescript to ~6") vs restoring the exact pre-bump `^6.0.3` — both satisfy all peers; implementer may pick either.
- No other inputs needed. The task prompt references no issue number; behavior was verified directly from the repo and the installed `node_modules` (including the live reproduction of the svelte-check throw).
