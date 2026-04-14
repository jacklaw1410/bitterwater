<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Spacing' });
</script>

<script>
  const spacings = [
    { var: '--space-0', rem: '0rem', px: '0px', use: 'Reset margins/padding' },
    { var: '--space-1', rem: '0.25rem', px: '4px', use: 'Tiny gaps, border offsets, tight icon spacing' },
    { var: '--space-2', rem: '0.5rem', px: '8px', use: 'Small gaps, input padding, list item spacing' },
    { var: '--space-3', rem: '0.75rem', px: '12px', use: 'Medium gaps, button padding (vertical)' },
    { var: '--space-4', rem: '1rem', px: '16px', use: 'Standard padding, component gaps, button padding (horizontal)' },
    { var: '--space-5', rem: '1.25rem', px: '20px', use: 'Card padding (small), loose list spacing' },
    { var: '--space-6', rem: '1.5rem', px: '24px', use: 'Card padding (standard), section gaps (small)' },
    { var: '--space-8', rem: '2rem', px: '32px', use: 'Section gaps (standard), modal padding' },
    { var: '--space-10', rem: '2.5rem', px: '40px', use: 'Large section gaps, hero padding (vertical)' },
    { var: '--space-12', rem: '3rem', px: '48px', use: 'Major section dividers, page margins' },
    { var: '--space-16', rem: '4rem', px: '64px', use: 'Hero sections, massive layout gaps' },
  ];
</script>

<Story name="Spacing">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8); max-width: var(--max-width);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Spacing Scale</h1>
    <p style="margin-bottom: var(--space-8); color: var(--text-secondary);">
      Our spacing system is based on a 4px grid (0.25rem). Use these tokens for margins, padding, and gaps to ensure consistent rhythm across the UI.
    </p>
    
    <div style="display: flex; flex-direction: column; gap: var(--space-6);">
      {#each spacings as s}
        <div style="display: grid; grid-template-columns: 250px 1fr; gap: var(--space-6); align-items: center; padding-bottom: var(--space-4); border-bottom: var(--border-width-thin) solid var(--border-default);">
          <div>
            <div style="font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--font-bold);">{s.var}</div>
            <div style="display: flex; gap: var(--space-2); margin-top: var(--space-1);">
              <span style="font-size: var(--text-xs); color: var(--text-secondary);">{s.rem}</span>
              <span style="font-size: var(--text-xs); color: var(--text-secondary);">({s.px})</span>
            </div>
            <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-2); font-style: italic;">{s.use}</div>
          </div>
          
          <div style="display: flex; align-items: center; gap: var(--space-4);">
            <div
              style="height: 1.5rem; background-color: var(--brand-500); width: var({s.var}); border-radius: var(--radius-sm); opacity: 0.8;"
            ></div>
            
            {#if s.var !== '--space-0'}
              <div style="display: flex; align-items: center; border: var(--border-width-thin) dashed var(--brand-300); padding: var({s.var}); border-radius: var(--radius-md); background: var(--brand-50);">
                <div style="background: var(--surface-default); padding: var(--space-2); border-radius: var(--radius-sm); font-size: var(--text-xs); border: var(--border-width-thin) solid var(--border-default);">
                  Content
                </div>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  </div>
</Story>
