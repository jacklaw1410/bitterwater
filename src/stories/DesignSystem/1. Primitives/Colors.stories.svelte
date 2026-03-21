<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Colors' });
</script>

<script>
  const colors = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
  const groups = [
    { name: 'Brand', vars: colors.map((w) => `--brand-${w}`) },
    { name: 'Gray', vars: colors.map((w) => `--gray-${w}`) },
    { name: 'Success', vars: colors.map((w) => `--success-${w}`) },
    { name: 'Warning', vars: colors.map((w) => `--warning-${w}`) },
    { name: 'Error', vars: colors.map((w) => `--error-${w}`) },
  ];
</script>

<Story name="Colors">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Color Primitives</h1>
    {#each groups as group (group.name)}
      <section style="margin-bottom: var(--space-8);">
        <h3 style="font-size: var(--text-xl); margin-bottom: var(--space-4);">{group.name}</h3>
        <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
          {#each group.vars as v (v)}
            <div style="width: 4rem;">
              <div
                style="height: 4rem; width: 4rem; background-color: var({v}); border-radius: var(--radius-sm); border: var(--border-width-thin) solid var(--border-default);"
              ></div>
              <div style="font-size: var(--text-xs); margin-top: var(--space-1);">{v}</div>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</Story>
