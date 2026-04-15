---
description: Svelte 5 code guide. Runes for all reactivity. Component structure, styling, events, props. Legacy features forbidden.
---

# Svelte Usages and Best Practices

## Svelte 5 Runes

Always use Runes (`$state`, `$derived`, `$props`, `$effect`) for reactive declarations. Avoid `let` for reactive variables.

### $state

- Only for reactive variables (trigger `$effect`, `$derived`, template updates).
- Objects/arrays (`$state({...})` / `$state([...])`) deeply reactive. Prefer inline mutations (`array.push(...)`, `object.prop = value`).
- Large objects only reassigned (not mutated) — use `$state.raw` to avoid proxy overhead.

### $props

- Treat props as changeable. Values depending on props usually use `$derived`.
- Always define prop types.

### $derived

- Compute values from state, not `$effect`.
- `$derived` takes expression. `$derived.by` for complex expressions.
- Deriveds writable like `$state`. Re-evaluate on dependency changes.
- Expression returning object/array not deeply reactive by default. Use `$state` inside `$derived.by` if needed.

### $effect

- Escape hatch. Generally avoid, especially for updating state.
- Prefer event handlers for user interactions.
- Use `$inspect` for debugging.
- Never wrap in `if (browser) {...}` — effects don't run on server.

### $inspect.trace

- `$inspect.trace(label)` debugging tool for reactivity. Use as first line in `$effect` or `$derived.by` to trace dependencies, identify update triggers.

## Component Structure

- Small, focused components.
- Separate `<script lang="ts">`, `<style>`, HTML logically.
- Use `export let` for props (becomes `$props` in Svelte 5).

## Reactivity

Reactivity based on assignments. For deeply reactive `$state` arrays/objects, **prefer inline mutations** (`myArray.push(...)`). For other reactive variables, reassign to trigger updates (`myArray = [...myArray, newItem]`).

## Events

- `on` prefix attributes treated as event listeners (`<button onclick={...}>`).
- Use `<svelte:window>`, `<svelte:document>` for window/document listeners. Avoid `onMount`, `$effect`.

## Props Design

Two main types:

- **Modifiers**: Non-callback props influencing behavior, defining customization boundary.
- **Event Handlers**: Callback props hooking into higher-level internal events.

### Customary Event Naming

- `on[Eventname]` pattern (e.g., `onsubmit`, `onrestartsimulation`).
- Prefer "customary" (higher-level, intent-based) events over low-level mechanical events. `onsubmit` over `onclick` for submit button.

## Code Documentation

- **JSDoc for Props**: All components use JSDoc comments documenting props.

## Snippets

- `{#snippet ...}` and `{@render ...}` for reusable markup.
- Top-level snippets can be referenced in `<script>`. Those not referencing state can export from `<script module>`.

## Each Blocks

- Prefer keyed each blocks (`{#each items as item (item.id)}`). Key uniquely identifies object.
- Avoid index as key.
- Avoid destructuring if mutating item within block (`bind:value={item.count}`).

## Styling

### JavaScript Variables in CSS

- Set CSS custom properties with `style:` directive (`<div style:--columns={columns}>`).
- Reference `var(--columns)` in `<style>`.

### Styling Child Components

- **Preferred**: CSS custom properties as props (`<Child --color="red" />`).
- **External Native Stylesheets**: For UI primitives wrapping headless libs (Bits UI), use sibling `.css` file imported in `<script>`. Prevents Svelte pruning "unused" selectors.
- Avoid `:global(...)` for internal component styling.

### Class Attribute

- Svelte 5 native **class arrays** instead of string joining or `clsx`.
- Example: `class={['ui-button', variantClass, className]}`

## Context

- Consider `createContext` (type-safe) over `setContext`/`getContext`. Prevents state leakage during SSR.

## Async Svelte

- Svelte 5.36+: `await expressions`, `hydratable` usable in components with `experimental.async` in `svelte.config.js`.

## Avoid Legacy Features

Always use runes mode for new code. Avoid:

| Old                                   | Use                            |
| ------------------------------------- | ------------------------------ |
| Implicit reactivity (`let count = 0`) | `$state`                       |
| `$:` assignments                      | `$derived`, `$effect`          |
| `export let`, `$$props`               | `$props`                       |
| `on:click={...}`                      | `onclick={...}`                |
| `<slot>`, `$$slots`                   | `{#snippet}`, `{@render}`      |
| `<svelte:component>`                  | `<DynamicComponent>`           |
| `<svelte:self>`                       | `import Self`, `<Self>`        |
| Stores                                | Classes with `$state` fields   |
| `use:action`                          | `{@attach ...}`                |
| `class:` directive                    | `clsx`-style arrays in `class` |
