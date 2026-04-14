<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Typography' });
</script>

<script>
  const scales = [
    { name: '4xl', var: '--text-4xl', size: '2.25rem (36px)', use: 'Hero headings, major section titles' },
    { name: '3xl', var: '--text-3xl', size: '1.875rem (30px)', use: 'Page titles, primary headings' },
    { name: '2xl', var: '--text-2xl', size: '1.5rem (24px)', use: 'Card titles, secondary headings' },
    { name: 'xl', var: '--text-xl', size: '1.25rem (20px)', use: 'Subheadings, prominent text' },
    { name: 'lg', var: '--text-lg', size: '1.125rem (18px)', use: 'Introductory text, large buttons' },
    { name: 'base', var: '--text-base', size: '1rem (16px)', use: 'Default body text, standard buttons' },
    { name: 'sm', var: '--text-sm', size: '0.875rem (14px)', use: 'Secondary text, metadata, small buttons' },
    { name: 'xs', var: '--text-xs', size: '0.75rem (12px)', use: 'Captions, tooltips, legal text' },
  ];

  const weights = [
    { name: 'Normal', var: '--font-normal', value: '400' },
    { name: 'Medium', var: '--font-medium', value: '500' },
    { name: 'Semibold', var: '--font-semibold', value: '600' },
    { name: 'Bold', var: '--font-bold', value: '700' },
  ];

  const lineHeights = [
    { name: 'None', var: '--line-height-none', value: '1' },
    { name: 'Tight', var: '--line-height-tight', value: '1.25' },
    { name: 'Snug', var: '--line-height-snug', value: '1.375' },
    { name: 'Normal', var: '--line-height-normal', value: '1.5' },
    { name: 'Relaxed', var: '--line-height-relaxed', value: '1.625' },
    { name: 'Loose', var: '--line-height-loose', value: '2' },
  ];
</script>

<Story name="Typography">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8); max-width: var(--max-width);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Typography</h1>
    
    <section style="margin-bottom: var(--space-12);">
      <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-6); border-bottom: var(--border-width-thin) solid var(--border-default); padding-bottom: var(--space-2);">Font Families</h2>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);">
        <div style="padding: var(--space-6); border: var(--border-width-thin) solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-default);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-4);">
            <h3 style="font-size: var(--text-xl); font-family: var(--font-sans);">Sans-serif</h3>
            <code style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);">var(--font-sans)</code>
          </div>
          <div style="font-size: var(--text-4xl); font-family: var(--font-sans); margin-bottom: var(--space-2);">Itim</div>
          <p style="font-family: var(--font-sans); color: var(--text-secondary); font-size: var(--text-sm);">
            Playful, organic, and approachable. Used for all headings and body text to give the brand its distinctive personality.
          </p>
          <div style="margin-top: var(--space-4); font-family: var(--font-sans); font-size: var(--text-lg); word-break: break-all;">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
            abcdefghijklmnopqrstuvwxyz<br/>
            0123456789 !@#$%^&*()
          </div>
        </div>
        
        <div style="padding: var(--space-6); border: var(--border-width-thin) solid var(--border-default); border-radius: var(--radius-md); background: var(--surface-default);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: var(--space-4);">
            <h3 style="font-size: var(--text-xl); font-family: var(--font-mono);">Monospace</h3>
            <code style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);">var(--font-mono)</code>
          </div>
          <div style="font-size: var(--text-4xl); font-family: var(--font-mono); margin-bottom: var(--space-2);">Roboto Mono</div>
          <p style="font-family: var(--font-sans); color: var(--text-secondary); font-size: var(--text-sm);">
            Technical, precise, and clear. Used for code snippets, data display, and technical information to contrast with the playful sans-serif.
          </p>
          <div style="margin-top: var(--space-4); font-family: var(--font-mono); font-size: var(--text-lg); word-break: break-all;">
            ABCDEFGHIJKLMNOPQRSTUVWXYZ<br/>
            abcdefghijklmnopqrstuvwxyz<br/>
            0123456789 !@#$%^&*()
          </div>
        </div>
      </div>
    </section>

    <section style="margin-bottom: var(--space-12);">
      <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-6); border-bottom: var(--border-width-thin) solid var(--border-default); padding-bottom: var(--space-2);">Scale & Guidelines</h2>
      
      <div style="display: flex; flex-direction: column; gap: var(--space-6);">
        {#each scales as scale}
          <div style="display: grid; grid-template-columns: 200px 1fr; gap: var(--space-4); align-items: center; padding-bottom: var(--space-4); border-bottom: var(--border-width-thin) solid var(--border-default);">
            <div>
              <div style="font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--font-bold);">{scale.var}</div>
              <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-1);">{scale.size}</div>
              <div style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: var(--space-1); font-style: italic;">{scale.use}</div>
            </div>
            <div style="font-size: var({scale.var}); line-height: var(--line-height-tight);">
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        {/each}
      </div>
    </section>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-8);">
      <section>
        <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-6); border-bottom: var(--border-width-thin) solid var(--border-default); padding-bottom: var(--space-2);">Font Weights</h2>
        <div style="display: flex; flex-direction: column; gap: var(--space-4);">
          {#each weights as weight}
            <div style="display: flex; align-items: center; gap: var(--space-4);">
              <div style="width: 120px;">
                <div style="font-family: var(--font-mono); font-size: var(--text-sm);">{weight.var}</div>
                <div style="font-size: var(--text-xs); color: var(--text-secondary);">{weight.value}</div>
              </div>
              <div style="font-size: var(--text-xl); font-weight: var({weight.var});">
                {weight.name} Itim
              </div>
            </div>
          {/each}
        </div>
      </section>

      <section>
        <h2 style="font-size: var(--text-2xl); margin-bottom: var(--space-6); border-bottom: var(--border-width-thin) solid var(--border-default); padding-bottom: var(--space-2);">Line Heights</h2>
        <div style="display: flex; flex-direction: column; gap: var(--space-6);">
          {#each lineHeights as lh}
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-2);">
                <span style="font-family: var(--font-mono); font-size: var(--text-sm);">{lh.var}</span>
                <span style="font-size: var(--text-xs); color: var(--text-secondary);">{lh.value}</span>
              </div>
              <div style="font-size: var(--text-sm); line-height: var({lh.var}); background: var(--surface-default); padding: var(--space-3); border-radius: var(--radius-sm); border: var(--border-width-thin) solid var(--border-default);">
                This is a multiline text example to demonstrate the {lh.name.toLowerCase()} line height. Notice how the vertical spacing between these lines changes depending on the applied token.
              </div>
            </div>
          {/each}
        </div>
      </section>
    </div>
  </div>
</Story>
