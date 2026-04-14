<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Radius' });
</script>

<script>
  const radiuses = [
    { var: '--radius-none', px: '0px', rem: '0', use: 'Flush elements, full-width banners' },
    { var: '--radius-sm', px: '4px', rem: '0.25rem', use: 'Small buttons, inputs, checkboxes, tooltips' },
    { var: '--radius-md', px: '6px', rem: '0.375rem', use: 'Standard cards, dropdown menus, modals' },
    { var: '--radius-lg', px: '8px', rem: '0.5rem', use: 'Large cards, hero sections, prominent containers' },
    { var: '--radius-full', px: '9999px', rem: '9999px', use: 'Avatars, badges, pill buttons, radio buttons' },
  ];
</script>

<Story name="Radius">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8); max-width: var(--max-width);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Border Radius</h1>
    <p style="margin-bottom: var(--space-8); color: var(--text-secondary);">
      Border radius defines the roundness of UI elements. We use a subtle, slightly rounded aesthetic to complement the playful typography while maintaining a technical feel.
    </p>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-8);">
      {#each radiuses as r}
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          <div style="display: flex; justify-content: center; align-items: center; height: 160px; background: var(--surface-default); border: var(--border-width-thin) dashed var(--border-default); border-radius: var(--radius-md);">
            <div
              style="width: 100px; height: 100px; background-color: var(--brand-500); border-radius: var({r.var}); display: flex; align-items: center; justify-content: center; color: white; font-family: var(--font-mono); font-size: var(--text-xs); box-shadow: var(--shadow-sm);"
            >
              {r.px}
            </div>
          </div>
          
          <div style="background: var(--surface-default); padding: var(--space-4); border-radius: var(--radius-md); border: var(--border-width-thin) solid var(--border-default);">
            <div style="font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--font-bold); margin-bottom: var(--space-2);">{r.var}</div>
            <div style="display: flex; gap: var(--space-2); margin-bottom: var(--space-3);">
              <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);">{r.rem}</span>
              <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);">({r.px})</span>
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); font-style: italic; border-top: var(--border-width-thin) solid var(--border-default); padding-top: var(--space-2);">
              {r.use}
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</Story>
