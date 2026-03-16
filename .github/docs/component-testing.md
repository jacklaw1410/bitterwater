---
description: Specifies the strategy for testing Svelte components using Storybook interaction tests.
---

# Component Testing Strategy (Storybook)

This document outlines the best practices for writing component tests using Storybook interaction tests. All component testing must be done within Storybook stories.

## Guiding Principles

We follow the core principles of the Testing Library family:

> The more your tests resemble the way your software is used, the more confidence they can give you.

Our tests should focus on user-centric interactions and verify outcomes from a user's perspective, avoiding implementation details.

## Tools

- **Storybook**: For developing, documenting, and testing components in isolation.
- **`storybook/test`**: For assertions and test utilities within stories.

## Coverage & Thoroughness

Aim for **moderate to high coverage** of component states, prop variations, and user interaction paths. Focus on the component's public API and how it renders/behaves in isolation.

## Guidelines

- **Interaction Tests**: All component logic and user interaction testing must be implemented using Storybook's `play` function.
- **Querying Elements**:
  - **Prioritize Accessibility**: Use accessibility-based queries to find elements, as it reflects how users and assistive technologies interact with the application.
  - **Query Priority**: 1. `getByRole`: The preferred choice for most elements. 2. `getByLabelText`: Best for form fields. 3. `getByPlaceholderText` 4. `getByText` 5. `getByDisplayValue`
  - **Avoid Implementation Details**: Do not use class names, IDs, or `data-testid` attributes unless absolutely necessary.
- **Props Testing**: Verify component rendering and behavior across different prop values by creating separate stories for each significant state.
- **Assertions**: Use `expect` from `@storybook/test` for clear and semantic assertions (e.g., `await expect(element).toBeInTheDocument()`).
- **Snapshot Testing**: Visual snapshot testing is handled by Chromatic via Storybook. Avoid traditional snapshot tests.
- **Accessibility**: Use the Storybook A11y addon to automatically catch accessibility issues.

## Writing Interaction Tests

Storybook interaction tests allow us to verify the functional aspects of our components. They are written using a `play` function that executes after the story is rendered. For a comprehensive guide, refer to the [official documentation](https://storybook.js.org/docs/writing-tests/interaction-testing).

- **Tools**: We use `storybook/test` for assertions and `user-event` for simulating user interactions.
- **`play` Function**: This function receives the `canvasElement` as an argument, which can be used with `within` to scope queries to the component's container.
- **Assertions**: Use `expect` from `storybook/test` for assertions.
- **Importing Test Utilities**: Always import testing utilities from `'storybook/test'`. This ensures you are using the Storybook-instrumented versions of `expect`, `within`, etc.

  ```typescript
  import { within, expect } from 'storybook/test';
  ```

- **Example**:

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

### Best Practices for Interaction Tests

- **Focus on User Flows**: Test the component as a user would.
- **Use Accessibility-Based Queries**: Prioritize queries like `getByRole`, `getByLabelText`, and `getByText`. This ensures our components are accessible and our tests are resilient to implementation changes. Refer to the [Querying Elements](#querying-elements) section for the recommended query priority.
- **Keep it Simple**: Each `play` function should test a single interaction or a small, related set of interactions.
- **Primary Method for Component Testing**: Storybook interaction tests are the primary method for component testing in this project. They replace the need for separate `.svelte.spec.ts` files.

## References

- [Official Storybook Interaction Testing Documentation](https://storybook.js.org/docs/writing-tests/interaction-testing)
