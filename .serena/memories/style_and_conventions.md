# Svelte 5 (MANDATORY)

- Use Runes for ALL reactivity: `$state`, `$derived`, `$props`, `$effect`.
- Avoid legacy Svelte features:
  - `export let` -> `$props()`
  - `$:` -> `$derived` or `$effect`
  - `on:click` -> `onclick`
  - `<slot>` -> `{#snippet}` + `{@render}`
- Use `$state.raw` for large objects that are only reassigned, not mutated.
- Prefer inline mutations for deeply reactive `$state` objects (e.g., `array.push()`).
- Prefer `$derived.by` for complex derived expressions.

# TypeScript

- **Strict Mode**: No implicit any.
- Prefer `interface` for object shapes, `type` for unions/aliases.
- Avoid `any`; use `unknown` and narrow types.
- Export types separately from values.
- Document exports with JSDoc.

# Naming Conventions

- **Components/Stories**: PascalCase (e.g., `Button.svelte`, `Button.stories.svelte`).
- **Utils/Tests**: kebab-case (e.g., `utils.spec.ts`, `data-fetching/`).
- **Props/Functions**: camelCase.
- **Types/Interfaces**: PascalCase.

# CSS & Styling

- Use the 3-tier token architecture in `static/app.css` (Primitives -> Semantics -> Component Tokens).
- Prefer native CSS variables and Vanilla CSS.

# Formatting

- 2 spaces, no tabs.
- Single quotes.
- Trailing commas (all).
- Print width: 100.
- Use `prettier-plugin-organize-imports` and `prettier-plugin-svelte`.
