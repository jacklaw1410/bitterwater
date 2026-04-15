# Component Story Guidelines

Develop, test components in isolation. Living documentation of component library.

## File Naming

- `.stories.svelte` suffix.
- Same directory as component.

`src/lib/components/FeatureCard.svelte` → `src/lib/components/FeatureCard.stories.svelte`

## Story Structure

`@storybook/addon-svelte-csf` enables native Svelte syntax:

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import MyComponent from './MyComponent.svelte';

  const { Story } = defineMeta({
    title: 'Category/MyComponent',
    component: MyComponent,
    tags: ['autodocs'],
    argTypes: {
      propName: { control: 'select', options: ['option1', 'option2'] },
      anotherProp: { control: false },
    },
  });
</script>

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

```svelte
<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import type { ComponentProps } from 'svelte';
  import MyComponent from './MyComponent.svelte';

  const { Story } = defineMeta({
    title: 'Category/MyComponent',
    component: MyComponent,
    render: template,
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

- **Comprehensive**: Stories for all important states (variants, sizes, disabled, error).
- **Controls**: `argTypes` makes props editable in Storybook UI.
- **Interaction Testing**: `play` function from `storybook/test`. `userEvent`, `within`, `expect`.
- **Autodocs**: `tags: ['autodocs']` in `defineMeta` for UI primitives.
- **Design System Docs**: `src/stories/DesignSystem/` for tokens (Colors, Spacing, Typography).

See [Component Testing Strategy](./component-testing.md) for interaction test details.
