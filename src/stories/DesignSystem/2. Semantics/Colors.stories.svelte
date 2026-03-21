<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/2. Semantics/Colors' });
</script>

<script>
  const surfaceVars = ['--surface-default', '--surface-raised', '--surface-overlay'];
  const textVars = ['--text-primary', '--text-secondary', '--text-inverse', '--text-disabled'];
  const borderVars = ['--border-default', '--border-focus'];
  const actionVars = [
    '--action-primary-bg',
    '--action-primary-hover',
    '--action-primary-active',
    '--action-primary-focus',
    '--action-secondary-hover',
    '--action-secondary-active',
    '--action-secondary-focus',
    '--action-ghost-hover',
    '--action-ghost-active',
    '--action-ghost-focus',
    '--action-disabled-bg',
  ];
  const statusVars = ['--status-success', '--status-warning', '--status-error'];

  const groups = [
    { name: 'Surface', vars: surfaceVars },
    { name: 'Text & Icons', vars: textVars },
    { name: 'Borders', vars: borderVars },
    { name: 'Actions', vars: actionVars },
    { name: 'Status', vars: statusVars },
  ];
</script>

<Story name="Colors">
  <div
    style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8); background-color: var(--surface-raised);"
  >
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Semantic Colors</h1>
    <p
      style="margin-bottom: var(--space-8); color: var(--text-secondary); max-width: var(--max-width);"
    >
      Semantic colors change automatically based on the current theme (Light/Dark mode). Try
      toggling the theme in Storybook to see these values update.
    </p>

    {#each groups as group (group.name)}
      <section style="margin-bottom: var(--space-8);">
        <h3 style="font-size: var(--text-xl); margin-bottom: var(--space-4);">{group.name}</h3>
        <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
          {#each group.vars as v (v)}
            <div
              style="width: 10rem; display: flex; flex-direction: column; align-items: flex-start; gap: var(--space-2);"
            >
              <div
                style="height: 6rem; width: 100%; background-color: var({v}); border-radius: var(--radius-md); border: var(--border-width-thin) solid var(--border-default); box-shadow: var(--shadow-sm);"
              ></div>
              <div style="font-size: var(--text-sm); font-weight: var(--font-medium);">{v}</div>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</Story>
