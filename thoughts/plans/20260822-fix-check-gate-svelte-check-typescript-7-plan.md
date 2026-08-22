# Pipeline plan for issue #0: Fix the repo's check gate: `bun run check` fails on TypeScript 7

Task title: fix(check gate): pin typescript to ~6.0.3 to restore svelte-check / typescript-eslint support.

## Phases

### Phase 1: Pin `typescript` devDependency to ~6.0.3

- Goal: Restore a TypeScript major version that svelte-check 4.7.5 (`^5.0.0 || ^6.0.0`), typescript-eslint 8.67.0 (`>=4.8.4 <6.1.0`) and @sveltejs/kit 2.70.2 (`^5.3.3 || ^6.0.0`) support, per the spec's REQ-1/REQ-5 (spec: "Recommended approach" + Open questions pick `~6.0.3`).
- Changes:
  - `package.json` line 57: change `"typescript": "^7.0.0"` → `"typescript": "~6.0.3"`. Touch only this line; no script, peer, or dependency changes.
  - `bun.lock`: run `bun install` to regenerate so the root `typescript` resolves to `6.0.3`, removing `typescript@7.0.2` and all `@typescript/typescript-*@7.0.2` platform-package entries.
  - Commit (conventional, closes the gate fix): `fix: pin typescript to ~6 to restore svelte-check gate` containing exactly `package.json` and `bun.lock`.
- Success criteria:
  - [x] `bun install` succeeds and installs `typescript@6.0.3`; `node_modules/typescript/package.json` reports `"version": "6.0.3"` (major < 7).
  - [x] `grep '7.0.2' bun.lock` returns no `typescript@7.0.2` / `@typescript/typescript-*@7.0.2` entries.
  - [x] `grep '6.0.3' bun.lock` shows the root `typescript` resolves to `6.0.3`.
  - [x] `bun run check` exits 0; no `TypeScript 7 support currently requires…` throw.
  - [x] `git diff main -- package.json` shows only the `typescript` spec line; scripts unchanged.
  - [x] `git show --stat HEAD` lists exactly `package.json` and `bun.lock`; subject starts with `fix:`.
- [x] Phase 1 complete

### Phase 2: Verify the full gate end-to-end

- Goal: Confirm the whole check gate and toolchain conformance pass on the fixed tree (REQ-3/REQ-4/REQ-6).
- Changes:
  - None to source files; run verification commands only.
- Success criteria:
  - [ ] `bun scripts/check-toolchain.ts` exits 0 with `toolchain conformance: OK`.
  - [ ] `bun run verify` exits 0 and prints the final line `verify: PASS - conformance, check, test, build (CI order)`.
- [ ] Phase 2 complete

## Tickets

| Ticket title                                                              | Scope                                                           | Depends on |
| ------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------- |
| Pin `typescript` to `~6.0.3` and regenerate lockfile so check/verify pass | `package.json` line 57 + `bun.lock`, conventional `fix:` commit | —          |

## Verify plan

Per-phase commands (run from repo root after the phase's changes):

- Phase 1: `bun install` → `grep -n '7.0.2' bun.lock` → `node -p "require('./node_modules/typescript/package.json').version"` → `bun run check` → `git diff main -- package.json` → commit → `git show --stat HEAD`
- Phase 2: `bun scripts/check-toolchain.ts` → `bun run verify`
- Final: `bun run check` (always per phase) then `bun run verify` (end), exit 0 with `verify: PASS - conformance, check, test, build (CI order)`.
