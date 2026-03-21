# Bitter Water Development Commands

## Development

- `bun dev` - Start the Vite development server.
- `bun dev --port 3000` - Dev server on a specific port.

## Build & Preview

- `bun run build` - Create a production build.
- `bun preview` - Preview the production build.

## Type Checking

- `bun check` - Run `svelte-check` and TypeScript checks.
- `bun check:watch` - Watch mode for type checking.

## Linting & Formatting

- `bun lint` - Run ESLint and Prettier checks.
- `bun format` - Auto-format code with Prettier.

## Testing

- `bun test` - Run all tests (unit + e2e).
- `bun test:unit` - Run unit tests (Vitest).
- `bun test:e2e` - Run E2E tests (Playwright).
- `bun test:unit --project storybook` - Run Storybook interaction tests.

### Running Specific Tests

- `bun test:unit src/path/to/file.spec.ts` - Run a specific unit test.
- `bun test:e2e e2e/home.test.ts` - Run a specific E2E test.

## Storybook

- `bun storybook` - Start Storybook on port 6006.
- `bun build-storybook` - Build Storybook static site.

## System Utils (Darwin)

- `ls` - List directory contents.
- `cd` - Change directory.
- `grep` - Search for patterns in files.
- `find` - Find files and directories.
- `git` - Version control.
- `rm` - Remove files or directories.
- `cp` - Copy files or directories.
- `mv` - Move files or directories.
- `cat` - Concatenate and print files.
- `mkdir` - Create directories.
- `touch` - Create empty files.
