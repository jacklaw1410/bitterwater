<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Spacing' });
</script>

<script>
  const spacings = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16'].map(
    (s) => `--space-${s}`,
  );
</script>

<Story name="Spacing">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Spacing Scale</h1>
    {#each spacings as s (s)}
      <div
        style="margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-4);"
      >
        <div style="width: 6rem; font-size: var(--text-sm); color: var(--text-secondary);">{s}</div>
        <div
          style="height: 1rem; background-color: var(--brand-500); width: var({s}); border-radius: var(--radius-sm);"
        ></div>
      </div>
    {/each}
  </div>
</Story>
