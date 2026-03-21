# Component Story Guidelines

This document provides guidelines for creating Storybook stories for Svelte components in this project.

## Why We Use Storybook

Storybook allows us to develop and test components in isolation. This helps us build more robust, reusable components and provides a living documentation of our component library.

## File Naming and Location

- Story files must have the suffix `.stories.svelte`.
- Stories must be located in the same directory as the component they are for.

For example, the story for `src/lib/components/FeatureCard.svelte` should be at `src/lib/components/FeatureCard.stories.svelte`.

## Story Structure

We use the `@storybook/addon-svelte-csf` addon, which allows us to write stories in Svelte's native syntax. A typical story file has the following structure:

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MyComponent from './MyComponent.svelte';

  // 1. Define the meta configuration for the component.
  // This is done in the module script context.
  const { Story } = defineMeta({
    title: 'Category/MyComponent', // How it appears in the Storybook sidebar
    component: MyComponent,
    tags: ['autodocs'], // Enables automatic documentation generation
    argTypes: {
      // Define controls for your component's props
      propName: { control: 'select', options: ['option1', 'option2'] },
      anotherProp: { control: false }, // Disable control for a prop
    },
  });
</script>

<!-- 2. Define individual stories using the Story component -->
<Story
  name="Default"
  args={{
    propName: 'option1',
  }}
/>

<Story
  name="AnotherState"
  args={{
    propName: 'option2',
  }}
/>
```

### Shared Templates

If your stories require a wrapper or a more complex rendering structure, you can define a shared template snippet and apply it to all stories via the `render` property in `defineMeta`.

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { ComponentProps } from 'svelte';
  import MyComponent from './MyComponent.svelte';

  const { Story } = defineMeta({
    title: 'Category/MyComponent',
    component: MyComponent,
    // ... other meta properties
    render: template, // Apply the default template
  });
</script>

{#snippet template(args: ComponentProps<typeof MyComponent>)}
  <div style="width: 300px;">
    <MyComponent {...args} />
  </div>
{/snippet}

<Story name="Default" args={{...}} />
```

## Best Practices

- **Be Comprehensive**: Create stories for all the important states of your component (e.g., variants, sizes, disabled, error).
- **Use Controls**: Use `argTypes` to make your component props editable in the Storybook UI.
- **Interaction Testing**: Use the `play` function from `storybook/test` to verify interactivity (clicks, focus, keyboard nav). Standardize on `userEvent`, `within`, and `expect`.
- **Autodocs**: Always include `tags: ['autodocs']` in the `defineMeta` call for UI primitives to generate documentation automatically.
- **Design System Docs**: Use `src/stories/DesignSystem/` for documenting global tokens like Colors, Spacing, and Typography.

By following these guidelines, we can maintain a clean, useful, and up-to-date component library.

For details on writing interaction tests for components, please refer to the [Component Testing Strategy](./component-testing.md).
