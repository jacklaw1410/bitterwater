<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Shadows' });
</script>

<script>
  const shadows = ['none', 'sm', 'md', 'lg'].map((s) => `--shadow-${s}`);
</script>

<Story name="Shadows">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Shadows</h1>
    <div style="display: flex; gap: var(--space-8); flex-wrap: wrap;">
      {#each shadows as s (s)}
        <div
          style="display: flex; flex-direction: column; align-items: center; gap: var(--space-2);"
        >
          <div
            style="width: 8rem; height: 8rem; background-color: var(--surface-default); border: var(--border-width-thin) solid var(--border-default); border-radius: var(--radius-md); box-shadow: var({s}); display: flex; align-items: center; justify-content: center;"
          ></div>
          <div style="font-size: var(--text-sm); color: var(--text-secondary);">{s}</div>
        </div>
      {/each}
    </div>
  </div>
</Story>
