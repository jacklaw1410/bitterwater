# Pipeline plan for issue #74: Fix check gate: svelte-check vs TypeScript 7

## Phases

### Phase 1: Pin `typescript` to `~6` and regenerate the lockfile

- Goal: Make `bun run check` and `bun run verify` exit 0 on a fresh install by downgrading the project `typescript` devDependency to the range svelte-check/svelte2tsx support (>= 5.0 && <= 6.0), following Option B from the spec (simplest, single-dep change, no script edits).
- Changes:
  - `package.json`: change the `typescript` devDependency spec from `^7.0.0` to `~6` (line 57). This is the only manifest edit.
  - Regenerate the lockfile: run `bun install` so `bun.lock` is consistent with the updated manifest (TypeScript resolved to the latest 6.x, e.g. 6.0.x).
  - Do NOT touch the `check`/`check:watch` scripts, `vite.config.ts`, `scripts/check-toolchain.ts`, or any source file — the fix is dependency-only (REQ-5, surgical change).
- Success criteria:
  - `bun run check` exits 0 with no "TypeScript 7 support currently requires both TypeScript 7 and TypeScript 6" text (REQ-1, REQ-4).
  - `bun install --frozen-lockfile` does not error (lockfile/manifest in sync) and `scripts/check-toolchain.ts` still passes (REQ-3).
  - `git diff` touches only `package.json` and `bun.lock` (REQ-5).
  - A fresh install (`rm -rf node_modules bun.lock && bun install`) followed by `bun run check` passes, matching the failing reproduction.

- [x] Phase 1 complete.

### Phase 2: End-to-end verify

- Goal: Prove the whole gate is green and the diff is minimal and committable.
- Changes:
  - Run the full verification chain (no code changes; read-only inspection only).
  - Confirm the resolved `typescript` version installed is `~6` (major 6) so svelte-check's `ts-version-check.js` no longer throws.
  - Review `git status`/`git diff` to confirm only `package.json` and `bun.lock` changed.
  - Commit the fix with a Conventional Commit message referencing issue #74 (e.g. `chore(deps): pin typescript to ~6 for svelte-check gate (#74)`).
- Success criteria:
  - `bun run verify` exits 0 end-to-end: toolchain conformance → `vp check` → unit tests → production build (REQ-2).
  - `bun run check` still exits 0 after verify ran.
  - Diff is surgical (only dependency spec + lockfile), no unrelated formatting/code/config changes.
  - Commit created with a conventional message referencing `#74`.

- [x] Phase 2 complete.

## Tickets

| Ticket title                                             | Scope                                                                                                                                                                                    | Depends on |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Pin typescript to ~6 and fix the svelte-check check gate | Edit `package.json` typescript spec to `~6`, regenerate `bun.lock` via `bun install`, verify `bun run check` + `bun run verify` exit 0, commit with conventional message referencing #74 | —          |

## Verify plan

Per-phase / final verification commands (run in repo root):

1. After Phase 1:
   - `bun install` (regenerate lockfile)
   - `bun install --frozen-lockfile` (lockfile/manifest consistency)
   - `bun run check`
   - `bun scripts/check-toolchain.ts`
   - Confirm `node_modules/typescript/package.json` version major is `6`
2. After Phase 2 (final):
   - `bun run check`
   - `bun run verify`
   - `git status` / `git diff` to confirm only `package.json` and `bun.lock` changed
   - Commit message references `#74`
