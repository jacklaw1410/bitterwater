<script lang="ts">
  import type { Particle } from '../utils';

  let { particles }: { particles: Particle[] } = $props();

  const xbar = $derived(particles.reduce((acc, cur) => acc + cur.x, 0) / particles.length);
  const ybar = $derived(particles.reduce((acc, cur) => acc + cur.y, 0) / particles.length);
  const vxbar = $derived(particles.reduce((acc, cur) => acc + cur.vx, 0) / particles.length);
  const vybar = $derived(particles.reduce((acc, cur) => acc + cur.vy, 0) / particles.length);
  const vbar = $derived(
    particles.reduce((acc, cur) => acc + Math.sqrt(cur.vx ** 2 + cur.vy ** 2), 0) /
      particles.length,
  );
</script>

{#if particles.length > 0}
  <div class="container">
    <table aria-label="Position statistics">
      <tbody>
        <tr>
          <td><span class="bar">x</span></td>
          <td class="value"><code>{xbar.toFixed(4)}</code></td>

          <td><span class="bar">y</span></td>
          <td class="value"><code>{ybar.toFixed(4)}</code></td>
        </tr>
      </tbody>
    </table>

    <table aria-label="Velocity statistics">
      <tbody>
        <tr>
          <td><span class="bar">v<sub>x</sub></span></td>
          <td class="value"><code>{vxbar.toFixed(4)}</code></td>

          <td><span class="bar">v<sub>y</sub></span></td>
          <td class="value"><code>{vybar.toFixed(4)}</code></td>

          <td><span class="bar">v</span></td>
          <td class="value"><code>{vbar.toFixed(4)}</code></td>
        </tr>
      </tbody>
    </table>
  </div>
{:else}
  <p>No particles to display statistics.</p>
{/if}

<style>
  .container {
    display: flex;
    flex-direction: row;
    gap: 1em;
    margin-bottom: 1em;
  }
  .bar {
    border-top: 1px solid currentColor;
  }
  code {
    font-size: 0.8em;
  }
  td.value {
    width: 80px;
  }
</style>
