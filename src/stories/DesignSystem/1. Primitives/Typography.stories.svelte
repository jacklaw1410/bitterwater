<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Typography' });
</script>

<script>
  const texts = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].map((t) => `--text-${t}`);
</script>

<Story name="Typography">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Typography Scales</h1>
    {#each texts as t (t)}
      <div
        style="margin-bottom: var(--space-4); display: flex; align-items: center; gap: var(--space-4);"
      >
        <div style="width: 8rem; font-size: var(--text-sm); color: var(--text-secondary);">{t}</div>
        <div style="font-size: var({t});">The quick brown fox jumps over the lazy dog</div>
      </div>
    {/each}
  </div>
</Story>
