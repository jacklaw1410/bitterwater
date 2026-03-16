# Using Bun, Vite, and SvelteKit for Web Development

This project uses Bun as the package manager and runtime, with Vite for tooling and SvelteKit for the framework. Bun wraps runtime management, package management, and frontend tooling in a single global CLI called `bun`. Bun is distinct from Vite, but it invokes Vite through `bun dev` and `bun run build`.

## Bun Workflow

`bun` is a global binary that handles the full development lifecycle. Run `bun --help` to print a list of commands and `bun <command> --help` for information about a specific command.

### Develop

- dev - Run the development server (using `bun dev`)
- check - Run format, lint, and TypeScript type checks (using `bun check`)
- lint - Lint code (using `bun lint`)
- format - Format code (using `bun format`)
- test - Run tests (using `bun test:unit` and `bun test:e2e`)

### Execute

- run - Run `package.json` scripts (e.g., `bun run <script-name>`)
- exec - Execute a command from local `node_modules/.bin` (using `bun x`)
- dlx - Execute a package binary without installing it as a dependency (using `bun x`)

### Build

- build - Build for production (using `bun build`)
- preview - Preview production build (using `bun preview`)

### Manage Dependencies

- add - Add packages to dependencies (using `bun add`)
- remove (`rm`, `uninstall`) - Remove packages from dependencies (using `bun remove`)
- update - Update packages to latest versions (using `bun update`)
- outdated - Check for outdated packages
- list (`ls`) - List installed packages
- why - Show why a package is installed
- info - View package information from the registry
- link / unlink - Manage local package links
- pm - Forward a command to the package manager

### Maintain

- upgrade - Update `bun` itself to the latest version

These commands map to their corresponding tools. For example, `bun dev --port 3000` runs Vite's dev server and works the same as Vite. `bun test:unit` runs JavaScript tests through the bundled Vitest. `bun test:e2e` runs integration tests through PlayWright. The version of all tools can be checked using `bun --version`. This is useful when researching documentation, features, and bugs.

## Common Pitfalls

- **Use Bun wrappers for one-off binaries:** Use `bun x` instead of package-manager-specific `dlx`/`npx` commands.

## Review Checklist for Agents

- [ ] Run `bun install` after pulling remote changes and before getting started.
- [ ] Run `bun check`, `bun lint`, `bun test:unit` and `bun test:e2e` to validate changes.
