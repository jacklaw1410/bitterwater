<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Shadows' });
</script>

<script lang="ts">
  const shadows = [
    { var: '--shadow-none', name: 'None', value: 'none', use: 'Flat elements, inset containers' },
    { var: '--shadow-sm', name: 'Small', value: '0 2px 4px 0 rgb(0 0 0 / 0.3)', use: 'Buttons, small cards, subtle elevation' },
    { var: '--shadow-md', name: 'Medium', value: '0 8px 16px -2px rgb(0 0 0 / 0.4), 0 4px 8px -4px rgb(0 0 0 / 0.35)', use: 'Dropdowns, popovers, hovering cards' },
    { var: '--shadow-lg', name: 'Large', value: '0 24px 48px -12px rgb(0 0 0 / 0.5), 0 16px 24px -8px rgb(0 0 0 / 0.45)', use: 'Modals, dialogs, floating action buttons' },
  ];

  let hoveredIndex = $state<number | null>(null);
</script>

<Story name="Shadows">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8); max-width: var(--max-width);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Elevation & Shadows</h1>
    <p style="margin-bottom: var(--space-8); color: var(--text-secondary);">
      Shadows create depth and hierarchy in the interface. Hover over the cards below to see how elevation can be used interactively.
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--space-8);">
      {#each shadows as s, i}
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <!-- svelte-ignore a11y_no_static_element_interactions -->
          <div
            onmouseenter={() => hoveredIndex = i}
            onmouseleave={() => hoveredIndex = null}
            style="
              height: 12rem; 
              background-color: var(--surface-default); 
              border: var(--border-width-thin) solid var(--border-default); 
              border-radius: var(--radius-md); 
              box-shadow: {hoveredIndex === i && i < shadows.length - 1 ? `var(${shadows[i+1].var})` : `var(${s.var})`}; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              transition: box-shadow var(--duration-normal) var(--ease-in-out), transform var(--duration-normal) var(--ease-in-out);
              transform: {hoveredIndex === i && i < shadows.length - 1 ? 'translateY(-4px)' : 'translateY(0)'};
              cursor: pointer;
            "
          >
            <div style="text-align: center;">
              <div style="font-weight: var(--font-semibold); margin-bottom: var(--space-1);">{s.name}</div>
              {#if hoveredIndex === i && i < shadows.length - 1}
                <div style="font-size: var(--text-xs); color: var(--brand-500);">Elevated to {shadows[i+1].name}</div>
              {:else if i < shadows.length - 1}
                <div style="font-size: var(--text-xs); color: var(--text-secondary);">Hover to elevate</div>
              {/if}
            </div>
          </div>
          
          <div style="background: var(--surface-default); padding: var(--space-4); border-radius: var(--radius-md); border: var(--border-width-thin) solid var(--border-default);">
            <div style="font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--font-bold); margin-bottom: var(--space-2);">{s.var}</div>
            <div style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary); margin-bottom: var(--space-3); word-break: break-all;">{s.value}</div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); font-style: italic; border-top: var(--border-width-thin) solid var(--border-default); padding-top: var(--space-2);">
              {s.use}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</Story>
