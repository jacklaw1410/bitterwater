<script module>
  import { defineMeta } from '@storybook/addon-svelte-csf';
  const { Story } = defineMeta({ title: 'Design System/1. Primitives/Colors' });
</script>

<script lang="ts">
  const groups = [
    {
      name: 'Brand',
      colors: [
        { weight: 50, hex: '#eff6ff' },
        { weight: 100, hex: '#dbeafe' },
        { weight: 200, hex: '#bfdbfe' },
        { weight: 300, hex: '#93c5fd' },
        { weight: 400, hex: '#60a5fa' },
        { weight: 500, hex: '#3b82f6' },
        { weight: 600, hex: '#2563eb' },
        { weight: 700, hex: '#1d4ed8' },
        { weight: 800, hex: '#1e40af' },
        { weight: 900, hex: '#1e3a8a' },
      ]
    },
    {
      name: 'Gray',
      colors: [
        { weight: 50, hex: '#f9fafb' },
        { weight: 100, hex: '#f3f4f6' },
        { weight: 200, hex: '#e5e7eb' },
        { weight: 300, hex: '#d1d5db' },
        { weight: 400, hex: '#9ca3af' },
        { weight: 500, hex: '#6b7280' },
        { weight: 600, hex: '#4b5563' },
        { weight: 700, hex: '#374151' },
        { weight: 800, hex: '#1f2937' },
        { weight: 900, hex: '#111827' },
      ]
    },
    {
      name: 'Success',
      colors: [
        { weight: 50, hex: '#f0fdf4' },
        { weight: 100, hex: '#dcfce7' },
        { weight: 200, hex: '#bbf7d0' },
        { weight: 300, hex: '#86efac' },
        { weight: 400, hex: '#4ade80' },
        { weight: 500, hex: '#22c55e' },
        { weight: 600, hex: '#16a34a' },
        { weight: 700, hex: '#15803d' },
        { weight: 800, hex: '#166534' },
        { weight: 900, hex: '#14532d' },
      ]
    },
    {
      name: 'Warning',
      colors: [
        { weight: 50, hex: '#fffbeb' },
        { weight: 100, hex: '#fef3c7' },
        { weight: 200, hex: '#fde68a' },
        { weight: 300, hex: '#fcd34d' },
        { weight: 400, hex: '#fbbf24' },
        { weight: 500, hex: '#f59e0b' },
        { weight: 600, hex: '#d97706' },
        { weight: 700, hex: '#b45309' },
        { weight: 800, hex: '#92400e' },
        { weight: 900, hex: '#78350f' },
      ]
    },
    {
      name: 'Error',
      colors: [
        { weight: 50, hex: '#fef2f2' },
        { weight: 100, hex: '#fee2e2' },
        { weight: 200, hex: '#fecaca' },
        { weight: 300, hex: '#fca5a5' },
        { weight: 400, hex: '#f87171' },
        { weight: 500, hex: '#ef4444' },
        { weight: 600, hex: '#dc2626' },
        { weight: 700, hex: '#b91c1c' },
        { weight: 800, hex: '#991b1b' },
        { weight: 900, hex: '#7f1d1d' },
      ]
    },
  ];

  const getLuminance = (hex: string) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const [rs, gs, bs] = [r, g, b].map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const getContrast = (hex1: string, hex2: string) => {
    const l1 = getLuminance(hex1);
    const l2 = getLuminance(hex2);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };

  const formatContrast = (ratio: number) => {
    return ratio.toFixed(2) + ':1';
  };

  const getWCAGRating = (ratio: number) => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA Large';
    return 'Fail';
  };
</script>

<Story name="Colors">
  <div style="font-family: var(--font-sans); color: var(--text-primary); padding: var(--space-8);">
    <h1 style="font-size: var(--text-4xl); margin-bottom: var(--space-8);">Color Primitives</h1>
    <p style="margin-bottom: var(--space-8); max-width: var(--max-width); color: var(--text-secondary);">
      Our color system is built on a 50-900 scale. Contrast ratios are calculated against pure white (#ffffff) and pure black (#000000).
      WCAG AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text.
    </p>
    
    {#each groups as group (group.name)}
      <section style="margin-bottom: var(--space-12);">
        <h3 style="font-size: var(--text-2xl); margin-bottom: var(--space-6); border-bottom: var(--border-width-thin) solid var(--border-default); padding-bottom: var(--space-2);">{group.name}</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: var(--space-6);">
          {#each group.colors as color (color.weight)}
            {@const contrastWhite = getContrast(color.hex, '#ffffff')}
            {@const contrastBlack = getContrast(color.hex, '#000000')}
            {@const ratingWhite = getWCAGRating(contrastWhite)}
            {@const ratingBlack = getWCAGRating(contrastBlack)}
            {@const passWhite = contrastWhite >= 4.5}
            {@const passBlack = contrastBlack >= 4.5}
            
            <div style="display: flex; flex-direction: column; border: var(--border-width-thin) solid var(--border-default); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-sm);">
              <div
                style="height: 100px; width: 100%; background-color: var(--{group.name.toLowerCase()}-{color.weight}); display: flex; align-items: flex-end; padding: var(--space-3);"
              >
                <span style="font-family: var(--font-mono); font-size: var(--text-sm); font-weight: var(--font-bold); color: {passWhite ? '#ffffff' : '#000000'}; background: {passWhite ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.5)'}; padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm);">
                  {color.weight}
                </span>
              </div>
              <div style="padding: var(--space-3); background: var(--surface-default); display: flex; flex-direction: column; gap: var(--space-2);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: var(--font-semibold); font-size: var(--text-sm);">Hex</span>
                  <span style="font-family: var(--font-mono); font-size: var(--text-xs); color: var(--text-secondary);">{color.hex}</span>
                </div>
                
                <div style="height: 1px; background: var(--border-default); margin: var(--space-1) 0;"></div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-xs);">
                  <span style="color: var(--text-secondary);">vs White</span>
                  <div style="display: flex; align-items: center; gap: var(--space-2);">
                    <span style="font-family: var(--font-mono);">{formatContrast(contrastWhite)}</span>
                    <span style="padding: 2px 6px; border-radius: var(--radius-sm); font-weight: var(--font-bold); font-size: 10px; background: {passWhite ? 'var(--success-100)' : 'var(--error-100)'}; color: {passWhite ? 'var(--success-800)' : 'var(--error-800)'};">
                      {ratingWhite}
                    </span>
                  </div>
                </div>
                
                <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-xs);">
                  <span style="color: var(--text-secondary);">vs Black</span>
                  <div style="display: flex; align-items: center; gap: var(--space-2);">
                    <span style="font-family: var(--font-mono);">{formatContrast(contrastBlack)}</span>
                    <span style="padding: 2px 6px; border-radius: var(--radius-sm); font-weight: var(--font-bold); font-size: 10px; background: {passBlack ? 'var(--success-100)' : 'var(--error-100)'}; color: {passBlack ? 'var(--success-800)' : 'var(--error-800)'};">
                      {ratingBlack}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</Story>
