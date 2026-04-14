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
    '--action-secondary-hover',
    '--action-secondary-active',
    '--action-ghost-hover',
    '--action-ghost-active',
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

  let isDarkMode = $state(false);
</script>

<Story name="Colors">
  <div data-theme={isDarkMode ? 'dark' : 'light'} style="background-color: var(--surface-raised); min-height: 100vh; transition: background-color var(--duration-normal) var(--ease-in-out);">
    <div
      style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8); max-width: var(--max-width); margin: 0 auto;"
    >
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-8);">
        <h1 style="font-size: var(--text-4xl); margin: 0;">Semantic Colors</h1>
        
        <button 
          onclick={() => isDarkMode = !isDarkMode}
          style="
            display: flex; 
            align-items: center; 
            gap: var(--space-2); 
            padding: var(--space-2) var(--space-4); 
            background: var(--surface-default); 
            border: var(--border-width-thin) solid var(--border-default); 
            border-radius: var(--radius-full); 
            color: var(--text-primary);
            font-family: var(--font-sans);
            font-weight: var(--font-medium);
            cursor: pointer;
            box-shadow: var(--shadow-sm);
            transition: all var(--duration-fast) var(--ease-in-out);
          "
        >
          {#if isDarkMode}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            Light Mode
          {:else}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            Dark Mode
          {/if}
        </button>
      </div>
      
      <p
        style="margin-bottom: var(--space-8); color: var(--text-secondary); max-width: var(--max-width);"
      >
        Semantic colors change automatically based on the current theme. Use these tokens instead of primitive colors to ensure your components support both light and dark modes out of the box.
      </p>

      {#each groups as group (group.name)}
        <section style="margin-bottom: var(--space-12);">
          <h3 style="font-size: var(--text-2xl); margin-bottom: var(--space-6); border-bottom: var(--border-width-thin) solid var(--border-default); padding-bottom: var(--space-2);">{group.name}</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-6);">
            {#each group.vars as v (v)}
              <div
                style="display: flex; flex-direction: column; border: var(--border-width-thin) solid var(--border-default); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm); background: var(--surface-default);"
              >
                <div
                  style="height: 100px; width: 100%; background-color: var({v}); border-bottom: var(--border-width-thin) solid var(--border-default);"
                ></div>
                <div style="padding: var(--space-3);">
                  <div style="font-family: var(--font-mono); font-size: var(--text-xs); font-weight: var(--font-bold); word-break: break-all;">{v}</div>
                </div>
              </div>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  </div>
</Story>
