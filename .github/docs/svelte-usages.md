---
description: This document is the primary guide for writing Svelte 5 code in this project. It mandates the use of Runes for all reactivity. It also provides conventions for component structure, styling, event handling, and props design, while explicitly forbidding legacy Svelte features.
---

# Svelte Usages and Best Practices

This document outlines best practices for writing fast, robust Svelte 5 applications, with a focus on Runes.

## Svelte 5 Runes

- Always use Svelte 5 Runes (`$state`, `$derived`, `$props`, `$effect`) for all reactive declarations. Avoid `let` for reactive variables in most cases.

### $state

- Only use `$state` for variables that should be reactive (cause an `$effect`, `$derived`, or template expression to update).
- Objects and arrays (`$state({...})` or `$state([...])`) are made deeply reactive. Prefer inline mutations (e.g., `array.push(...)`, `object.property = value`) for these deeply reactive structures.
- For large objects that are only ever reassigned (not mutated), use `$state.raw` to avoid proxy overhead (e.g., with API responses).

### $props

- Treat props as though they will change. Values that depend on props should usually use `$derived`.
- Always define prop types.

### $derived

- Use `$derived` to compute values from state, rather than `$effect`.
- `$derived` takes an expression. For complex expressions, use `$derived.by`.
- Deriveds are writable, similar to `$state`, and re-evaluate when their dependencies change.
- If a derived expression is an object or array, it is not made deeply reactive by default. Use `$state` inside `$derived.by` for deep reactivity if strictly necessary.

### $effect

- Effects are an escape hatch and should generally be avoided, especially for updating state.
- Prefer event handlers for user interactions.
- Use `$inspect` for debugging.
- Never wrap effect contents in `if (browser) {...}` — effects do not run on the server.

### $inspect.trace

- `$inspect.trace(label)` is a debugging tool for reactivity. Use it as the first line of an `$effect` or `$derived.by` (or any function they call) to trace dependencies and identify update triggers.

## Component Structure

- Prefer small, focused components.
- Separate `<script lang="ts">`, `<style>`, and HTML sections logically.
- Use `export let` for props (which becomes `$props` in Svelte 5).

## Reactivity

- Understand that reactivity is based on assignments. However, for deeply reactive `$state` arrays and objects, **prefer inline mutations** (e.g., `myArray.push(newItem)` or `myObject.newProp = value`) as these will trigger updates automatically. For other reactive variables, ensure you reassign the variable to trigger updates (e.g., `myArray = [...myArray, newItem]` or `myObject = { ...myObject, newProp: value }`).

## Events

- Any element attribute starting with `on` is treated as an event listener (e.g., `<button onclick={...}>`).
- Use `<svelte:window>` and `<svelte:document>` for attaching listeners to `window` or `document`. Avoid `onMount` or `$effect` for this.

## Props Design for Custom Components

Custom components expose two main types of props:

- **Modifiers**: These are non-callback props that influence the component's behavior, defining its customization boundary.
- **Event Handlers**: These are callback props designed to hook into higher-level internal component events, exposing specific interaction points.

### Customary Event Naming and Intent

- Event handlers should be named using the `on[eventname]` pattern (e.g., `onsubmit`, `onrestartsimulation`).
- Prefer exposing "customary" (higher-level, intent-based) events rather than low-level mechanical events. For instance, a submit button should expose an `onsubmit` event (representing the user's intention) instead of a generic `onclick` event (representing the mechanism).

## Code Documentation

- **JSDoc for Props**: All components should use JSDoc comments to document their props. This provides essential context for both human developers and AI agents, explaining the purpose, type, and default value of each prop.

## Snippets

- Use `{#snippet ...}` and `{@render ...}` for reusable chunks of markup.
- Snippets declared at the top level can be referenced in `<script>`. Those not referencing component state can be exported from `<script module>`.

## Each Blocks

- Prefer keyed each blocks (`{#each items as item (item.id)}`) for better performance when inserting or removing items. The key must uniquely identify the object.
- Avoid using the index as a key.
- Avoid destructuring if you need to mutate the item within the block (e.g., with `bind:value={item.count}`).

## Styling

### Using JavaScript variables in CSS

- Set CSS custom properties with the `style:` directive (e.g., `<div style:--columns={columns}>`).
- Reference `var(--columns)` in the component's `<style>`.

### Styling child components

- Preferred: Use CSS custom properties passed as props (e.g., `<Child --color="red" />`).
- If custom properties are not possible (e.g., third-party library), use `:global` to override styles.

## Context

- Consider using `createContext` (for type safety) instead of `setContext`/`getContext` for scoping state to specific parts of the app. This helps prevent state leakage during server-side rendering.

## Async Svelte

- If using Svelte 5.36+, `await expressions` and `hydratable` can be used directly in components with `experimental.async` enabled in `svelte.config.js`.

## Avoid Legacy Features

Always use runes mode for new code, and avoid features that have more modern replacements:

- Use `$state` instead of implicit reactivity (e.g., `let count = 0; count += 1`).
- Use `$derived` and `$effect` instead of `$:` assignments and statements (use `$effect` sparingly).
- Use `$props` instead of `export let`, `$$props`, and `$$restProps`.
- Use `onclick={...}` instead of `on:click={...}`.
- Use `{#snippet ...}` and `{@render ...}` instead of `<slot>`, `$$slots`, and `<svelte:fragment>`.
- Use `<DynamicComponent>` instead of `<svelte:component this={DynamicComponent}>`.
- Use `import Self from './ThisComponent.svelte'` and `<Self>` instead of `<svelte:self>`.
- Use classes with `$state` fields to share reactivity between components, instead of using stores.
- Use `{@attach ...}` instead of `use:action`.
- Use `clsx`-style arrays and objects in `class` attributes, instead of the `class:` directive.
