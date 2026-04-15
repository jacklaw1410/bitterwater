---
description: Component testing strategy using Storybook interaction tests.
---

# Component Testing Strategy (Storybook)

Test Svelte components using Storybook interaction tests.

## Guiding Principles

> The more your tests resemble the way software is used, the more confidence they give you.

Tests focus on user-centric interactions, verify outcomes from user's perspective, avoid implementation details.

## Tools

- **Storybook**: Develop, document, test components in isolation.
- **`storybook/test`**: Assertions, test utilities.

## Coverage

Aim for **moderate to high coverage** — component states, prop variations, user interaction paths. Focus on public API, rendering/behaving in isolation.

## Guidelines

- **Interaction Tests**: Use Storybook's `play` function.
- **Querying Elements**:
  - **Accessibility-based**: Reflects how users + assistive tech interact.
  - **Priority**: 1. `getByRole` 2. `getByLabelText` 3. `getByPlaceholderText` 4. `getByText` 5. `getByDisplayValue`
  - **Avoid**: Class names, IDs, `data-testid` unless necessary.
- **Props Testing**: Separate stories for each significant state.
- **Assertions**: `expect` from `@storybook/test`.
- **Snapshot**: Chromatic handles visual snapshots. No traditional snapshots.
- **Accessibility**: Storybook A11y addon catches issues automatically.

## Writing Interaction Tests

`play` function executes after story renders. Receives `canvasElement`, use `within` to scope queries.

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { within, expect } from 'storybook/test';
  import MyComponent from './MyComponent.svelte';

  const { Story } = defineMeta({
    title: 'Category/MyComponent',
    component: MyComponent,
    tags: ['autodocs'],
  });
</script>

<Story
  name="Default"
  play={async ({ canvasElement, userEvent }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: /click me/i });
    await userEvent.click(button);
    await expect(canvas.getByText('Clicked!')).toBeInTheDocument();
  }}
/>
```

### Best Practices

- **User Flows**: Test as user would.
- **Accessibility Queries**: `getByRole`, `getByLabelText`, `getByText`. Resilient to implementation changes.
- **Single Focus**: Each `play` tests one interaction or small related set.
- **Primary Method**: Storybook interaction tests replace `.svelte.spec.ts` files.

## References

- [Storybook Interaction Testing](https://storybook.js.org/docs/writing-tests/interaction-testing)
