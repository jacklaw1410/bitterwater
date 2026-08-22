# Spec: Fix the repo's check gate (`bun run check` breaks on TypeScript 7)

## Goal

Make `bun run check` and `bun run verify` pass again on a fresh install by bringing the
project's TypeScript back to a version svelte-check supports, so the check gate no longer
hard-fails with the "TypeScript 7 support currently requires…" error.

## Context

Verified repo facts:

- `package.json:57` declares `"typescript": "^7.0.0"`; `bun.lock` resolves the hoisted
  `typescript` entry to `typescript@7.0.2` (one entry at `bun.lock:1014`). A fresh
  `bun install` therefore installs TS 7.0.2.
- `bun run check` is `svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`
  (`package.json:11`) — no `--tsgo*` flags are passed. `check:watch` (`package.json:12`)
  is the same plus `--watch`.
- Failure mechanism (read from the installed package, not reproduced by running):
  `node_modules/svelte-check/bin/ts-version-check.js` reads `typescript/package.json`,
  returns silently only when the major is `> 4` and `< 7`, and otherwise throws exactly the
  reported error ("TypeScript 7 support currently requires both TypeScript 7 and TypeScript
  6 installed in your project, and requires using the --tsgo or --tsgo-experimental-api
  flag"). It also prints svelte-check's own guidance:
  `npm install --save-dev typescript@~6 @typescript/native@npm:typescript@7`.
- Peer constraints that a TS 6 pin satisfies and that TS 7.0.2 violates (from `bun.lock`
  manifests): `svelte-check@4.7.5` → `typescript ^5.0.0 || ^6.0.0`;
  `svelte2tsx@0.7.59` → `^4.9.4 || ^5.0.0 || ^6.0.0`;
  `@sveltejs/kit@2.70.2` → `^5.3.3 || ^6.0.0`;
  `typescript-eslint`/`@typescript-eslint/*@8.67.0` → `>=4.8.4 <6.1.0` (so the resolved
  version must be **below 6.1.0**); `ts-node@10.9.2` → `>=2.7`.
- Registry fact (queried `npm view`, read-only): `typescript@latest` is `7.0.2`; the TS 6
  stable line tops out at `6.0.3` (`6.0.1-rc`, `6.0.2`, `6.0.3` exist; no `6.1.x` stable).
  `~6.0.0` therefore resolves to `6.0.3` today and stays `< 6.1.0`; `~6` also resolves to
  `6.0.3` today but would drift to a future `6.1.x` and break the `typescript-eslint` peer.
- `bun run verify` (`package.json:16`) is
  `bun scripts/check-toolchain.ts && CI=1 vp check && CI=1 vp test --run && CI=1 vp build`.
  Per DEVELOPMENT.md it is conformance + `vp check` (format + lint) + unit tests + build; it
  does **not** itself invoke svelte-check. The conformance check
  (`src/lib/toolchain-conformance.ts`, `TOOLCHAIN_ROLES`) only audits the
  vite/vitest/vite-plus triad, not TypeScript, so a TS pin cannot trip step 1.
- CI (`.github/workflows/deploy.yml`) does not run `bun run check`; it runs conformance,
  build, unit, and e2e only.
- Repo precedent: `DEVELOPMENT.md:55` already documents that `build-storybook` is excluded
  from `verify` because "svelte2tsx has no TS 7 support" — root TS 7 is a known-bad state
  for this tree; a TS 6 pin also re-satisfies every svelte2tsx/kit/eslint peer.
- Commit convention (`AGENTS.md`): Conventional Commits; a dependency change is
  `chore(deps): <what changes> (<#issue>)`. The open tracking issue for this task is **#82**
  (`ready-for-agent`; #74/#76/#78/#80 are closed duplicates of the same title).
- `renovate.json` only groups `typescript` into its own Renovate group — no pin conflict; a
  future Renovate major-bump proposal back to `7` is expected churn and out of scope.

Two acceptable approaches exist (from svelte-check's own guidance):

- **B (recommended): pin `typescript` to `~6.0.0`**, regenerate `bun.lock`, no script or
  source changes, no extra packages. Simplest, matches repo "Simplicity First", satisfies
  every peer listed above.
- **A: `typescript` → `~6` plus `@typescript/native@npm:typescript@7` plus adding the
  `--tsgo`/`--tsgo-experimental-api` flag** to the `check`/`check:watch` scripts. More
  moving parts; svelte-check's `--tsgo` path additionally expects a tsgo binary
  (`@typescript/native-preview` per `svelte-check/dist/src/index.js`). Required only if B
  fails verification.

## Requirements

- **REQ-1**: `package.json` `devDependencies."typescript"` is changed from `^7.0.0` to a
  TS-6 spec (recommended `~6.0.0`; any 6.0.x-compatible range that resolves below `6.1.0`
  is acceptable). Observable: `bun install` completes with **no** peer warnings, and
  `node -e "console.log(require('typescript/package.json').version)"` prints a `6.0.x`
  version (`6.0.3` today).
- **REQ-2**: `bun run check` exits 0 on a fresh install with no `--tsgo*` flags.
  Observable: the command runs `svelte-kit sync` then svelte-check cleanly;
  `node_modules/svelte-check/bin/ts-version-check.js` no longer throws (major 6 returns
  silently).
- **REQ-3**: `bun run verify` exits 0 end-to-end and prints the
  `verify: PASS - conformance, check, test, build (CI order)` banner.
  Observable: exit code 0 from `bun scripts/check-toolchain.ts`, `vp check`, `vp test`,
  `vp build` run sequentially.
- **REQ-4**: The diff is surgical — only `package.json` (the `typescript` spec) and the
  regenerated `bun.lock` change; the `check`/`check:watch` scripts and all source code are
  untouched.
- **REQ-5**: `bun.lock` is regenerated and committed such that the hoisted `typescript`
  entry resolves to the pinned `6.0.x` (no stale `7.0.2` entry remains for it).
  Observable: `rg '"typescript": \[' bun.lock` shows `typescript@6.0.x`.
- **REQ-6**: `bun run lint` exits 0 under the pinned TS (`typescript-eslint@8.67.0` peer
  `>=4.8.4 <6.1.0` satisfied by the 6.0.x resolution).
- **REQ-7**: The fix is committed with a Conventional Commit referencing the issue and the
  `chore(deps)` type, subject ≤72 chars, e.g.
  `chore(deps): pin typescript to ~6.0.0 so svelte-check passes (#82)`.
  Observable: `git log -1 --format=%s` matches the convention and includes `(#82)`.

## Acceptance criteria

- [ ] `git diff` after `bun install` contains only `package.json` and `bun.lock`.
- [ ] `bun.lock` resolves `typescript` to `6.0.x` (not `7.0.2`).
- [ ] `bun install` completes without peer-dependency warnings.
- [ ] `bun run check` exits 0 on a clean environment.
- [ ] `bun run verify` exits 0 and prints the PASS banner.
- [ ] `bun run lint` exits 0.
- [ ] `bun scripts/check-toolchain.ts` still exits 0 (toolchain triad unaffected).
- [ ] Commit subject is Conventional, `chore(deps)`, references `(#82)`.
- [ ] Human smoke check: `node_modules/svelte-check/bin/ts-version-check.js`'s throw path
      is no longer reached (major is 6).

## Out of scope

- Adopting the dual TS6+TS7 setup with `--tsgo`/`--tsgo-experimental-api` flags / adding
  `@typescript/native@npm:typescript@7` (only as a fallback if the pin approach fails).
- Upgrading svelte-check to a version with first-class TS 7 support.
- Fixing `build-storybook` (explicitly excluded from `verify`; upstream svelte2tsx gap).
- Adding svelte-check (or any checker) to the CI workflow, or changing CI at all.
- Touching any other dependency spec or any source code.

## Open questions

- none blocking. Note: as the research agent I read the failure mechanism from the installed
  `svelte-check/bin/ts-version-check.js` source but did not execute `bun run check` /
  `bun run verify`; the pass/fail outcomes are enforced by the acceptance criteria at
  implementation time. Whether `verify` was already failing pre-fix (TS7 + typescript-eslint)
  was not exercised; REQ-3 covers the post-fix state regardless.
