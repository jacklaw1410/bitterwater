# Pipeline plan for issue #78: Fix the check gate: `bun run check` fails on fresh install with svelte-check's TypeScript 7 error

## Phases

### Phase 1: Reproduce the failure on a clean install

- Goal: Prove `bun run check` fails with the svelte-check TypeScript 7 error on a fresh, dependency-consistent install.
- Changes:
  - No source changes. Only reset local install state in the working tree (or a fresh worktree): delete `node_modules` and `bun.lock`, then `bun install`.
  - Run `bun run check` and confirm the exact failure: `TypeScript 7 support currently requires both TypeScript 7 and TypeScript 6 installed in your project, and requires using the --tsgo or --tsgo-experimental-api flag`.
- Success criteria:
  - `bun install` succeeds and installs `typescript@7.0.2` (per current `^7.0.0` spec).
  - `bun run check` exits non-zero with the known TS 7 error above.
  - Failure is recorded, then install state is left intact for Phase 2.

- [x]

### Phase 2: Pin `typescript` to `~6` and regenerate `bun.lock`

- Goal: Change the `typescript` devDependency so the resolved version satisfies every repo peer range (svelte-check, svelte2tsx, typescript-eslint, @sveltejs/kit) and svelte-check's TS-version check passes.
- Changes:
  - `package.json` line 57: change `"typescript": "^7.0.0"` to `"typescript": "~6"` (Route B — recommended; no script changes, no `--tsgo` flag, no second TS install).
  - Regenerate `bun.lock` with `bun install` (same command already run in Phase 1; run again after the package.json edit so the lockfile resolves to `typescript@6.x`).
  - Do NOT touch: `scripts/check-toolchain.ts`, the vite/vitest/vite-plus triad, `overrides`, `.github/workflows/deploy.yml`, or application source.
- Success criteria:
  - `bun.lock` now records `typescript` at a `6.x` version (per `~6`).
  - `bun install` resolves without network-time disagreements (lockfile matches package.json).
  - `git diff -- package.json bun.lock` shows only the dependency change and resulting lockfile churn.

- [x]

### Phase 3: Verify `bun run check` and `bun run verify` pass

- Goal: Both gates exit 0 from the fixed install, proving the check gate is unblocked and full CI-order verification passes.
- Changes:
  - No further file changes. This phase is observation-only against the Phase 2 state.
- Success criteria:
  - `bun run check` exits 0 with no `TypeScript 7 support currently requires...` error and no new type diagnostics.
  - `bun run verify` exits 0 and prints `verify: PASS - conformance, check, test, build (CI order)`.
  - `git status` shows only `package.json` and `bun.lock` modified (plus the `thoughts/plans` plan file).

- [x]

### Phase 4: Commit the fix

- Goal: Land the fix as a Conventional Commit referencing issue #78.
- Changes:
  - Stage `package.json` and `bun.lock` only.
  - Commit with a conventional message referencing `#78`, subject ≤ 72 chars, e.g. `chore(deps): pin typescript to ~6 for svelte-check compatibility (#78)`; add a body noting the failure mechanism (svelte-check's TS7 gate) and why TS 7 cannot stay (peer ranges, svelte2tsx/Storybook blocker per DEVELOPMENT.md).
  - Do NOT include the plan file in the commit; do NOT include any generated/scratch files.
- Success criteria:
  - `git log -1 --oneline` shows the commit message in Conventional Commits format ending in `(#78)`.
  - `git show --stat HEAD` lists exactly `package.json` and `bun.lock`.
  - `git diff HEAD --stat` is clean.

- [x]

## Tickets

| Ticket title                                                       | Scope                                                                                            | Depends on |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ---------- |
| Fix check gate: pin `typescript` to `~6` and regenerate `bun.lock` | `package.json` line 57, `bun.lock` regen, `bun run check` + `bun run verify` green, commit (#78) | —          |
| (not needed) — fix is single-part, no ticket split                 | —                                                                                                | —          |

## Verify plan

Sequence the pipeline runs; every phase ends with `bun run check`, the whole task ends with `bun run verify`:

1. Phase 1: `rm -rf node_modules bun.lock && bun install && bun run check` → expect non-zero with the TS 7 error (records reproduction).
2. Phase 2: edit `package.json` (`typescript` → `~6`), then `bun install` (regenerates `bun.lock`), then `bun run check` → expect exit 0.
3. Phase 3: `bun run check && bun run verify` → expect both exit 0 and the `verify: PASS - conformance, check, test, build (CI order)` banner.
4. Phase 4: `git status && git diff --stat` → only `package.json` + `bun.lock`; commit with Conventional Commit message referencing `(#78)`.
5. Final confirmation: `bun run check` and `bun run verify` both exit 0 from the committed state.
