# Pipeline plan for issue #82: Fix check gate (`bun run check` breaks on TypeScript 7)

## Phases

### Phase 1: Pin TypeScript to `~6.0.0` and regenerate the lockfile

- Goal: Bring `typescript` back to a version every peer (svelte-check, svelte2tsx, kit, typescript-eslint) accepts, so svelte-check's TS 7 guard stops throwing.
- Changes:
  - In `package.json` `devDependencies`, change `"typescript": "^7.0.0"` to `"typescript": "~6.0.0"` (line 57). Do NOT touch the `check`/`check:watch` scripts or any source.
  - Run `bun install` to regenerate `bun.lock` so the hoisted `typescript` entry resolves to `typescript@6.0.3` and no stale `7.0.2` entry remains.
- Success criteria:
  - `git diff` (after install) touches only `package.json` and `bun.lock`.
  - `rg '"typescript": \[' bun.lock` shows `typescript@6.0.x`.
  - `bun install` completes with no peer-dependency warnings.
  - `node -e "console.log(require('typescript/package.json').version)"` prints `6.0.x` (`6.0.3` today).
  - `node_modules/svelte-check/bin/ts-version-check.js` no longer throws (major 6 < 7 returns silently).
- [x] Phase 1 complete.

### Phase 2: Verify the gate passes

- Goal: Prove `bun run check` and `bun run verify` exit 0 under the pinned TS.
- Changes:
  - No file changes. Run the verification commands below.
  - If `bun run check` still fails and only Approach B can't get us there, fall back per spec to Approach A (add `typescript@~6` + `@typescript/native@npm:typescript@7` + `--tsgo-experimental-api` flag) — only as a last resort, and only if pinned-6 fails.
- Success criteria:
  - `bun run check` exits 0 (runs `svelte-kit sync` then svelte-check cleanly) with no `--tsgo*` flags.
  - `bun run lint` exits 0 (typescript-eslint peer `>=4.8.4 <6.1.0` satisfied).
  - `bun scripts/check-toolchain.ts` still exits 0 (toolchain triad unaffected).
  - `bun run verify` exits 0 and prints the `verify: PASS - conformance, check, test, build (CI order)` banner.
- [x] Phase 2 complete.

### Phase 3: Commit the fix

- Goal: Record the dependency change as a Conventional Commit referencing the issue.
- Changes:
  - Stage only `package.json` and `bun.lock`.
  - Commit with subject ≤72 chars: `chore(deps): pin typescript to ~6.0.0 so svelte-check passes (#82)` (with a short body stating the "why" — TS 7 breaks svelte-check's ts-version guard and violates typescript-eslint's `<6.1.0` peer).
- Success criteria:
  - `git log -1 --format=%s` matches the Conventional `chore(deps)` convention and includes `(#82)`.
  - Working tree clean; only intented files committed (no secrets).
- [x] Phase 3 complete.

## Tickets

| Ticket title                                          | Scope                                                                                                                                                    | Depends on |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| Pin typescript to ~6.0.0 so svelte-check passes (#82) | `package.json` (typescript spec) + regenerated `bun.lock`; run `bun run check`, `bun run lint`, `bun run verify`; commit `chore(deps)` referencing (#82) | none       |

## Verify plan

Per phase, run:

```sh
bun install            # Phase 1: regenerate bun.lock from the new spec
git diff --stat        # Phase 1: confirm only package.json + bun.lock changed
rg '"typescript": \[' bun.lock   # Phase 1: confirm typescript@6.0.x
node -e "console.log(require('typescript/package.json').version)"   # Phase 1: expect 6.0.x
bun run check          # every phase (final signal per phase)
bun run lint           # Phase 2
bun scripts/check-toolchain.ts   # Phase 2
bun run verify         # final end-to-end gate (always last)
```
