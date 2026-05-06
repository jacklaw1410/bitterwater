# Bitter Water Commands

All commands prefixed with `bun run` unless noted.

## Development

```bash
bun run dev              # Start dev server
bun run dev -- --port 3000  # Dev server on specific port
```

## Build & Preview

```bash
bun run build            # Production build
bun run preview         # Preview production build
```

## Quality Checks

```bash
bun run check           # svelte-check + TypeScript (alias: bun run check)
bun run lint           # Lint with Oxc + ESLint
bun run format         # Auto-format with Oxfmt
```

## Testing

```bash
bun run test:all        # All tests (unit + e2e)
bun run test:e2e        # E2E tests (Playwright)
bun run test:e2e:ci-snapshot  # Docker-based E2E snapshot CI
```

### Single Test (via vp directly)

```bash
bunx vp test src/routes/gallery/utils.spec.ts
bunx vp test src/stories/Button.stories.svelte --project storybook
```

## Storybook

```bash
bun run storybook        # Start Storybook on port 6006
bun run build-storybook  # Build static Storybook site
bun run generate:thumbnails  # Generate thumbnails
```

## Docker (E2E CI)

```bash
bunx vp docker:build    # Build Docker image
bunx vp docker:run     # Run E2E in Docker
```

## Git (via vp staged)

```bash
bunx vp staged '*'       # Run check --fix on staged files
```

## Notes

- Uses `vp` (Vite+ CLI) for linting, formatting, testing
- Unit tests via `vitest` browser mode (not separate script)
- Three test projects: `client`, `server`, `storybook`
- Visual regression uses platform-specific snapshots (`*-darwin.png`, `*-linux.png`)
