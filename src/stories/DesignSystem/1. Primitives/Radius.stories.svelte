<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Radius' });
</script>

<script>
  const radiuses = ['none', 'sm', 'md', 'lg', 'full'].map((r) => `--radius-${r}`);
</script>

<Story name="Radius">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Border Radius</h1>
    <div style="display: flex; gap: var(--space-6); flex-wrap: wrap;">
      {#each radiuses as r (r)}
        <div
          style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);"
        >
          <div
            style="width: 5rem; height: 5rem; background-color: var(--brand-500); border-radius: var({r});"
          ></div>
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">{r}</div>
        </div>
      {/each}
    </div>
  </div>
</Story>
