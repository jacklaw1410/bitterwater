<script lang="ts">
  type Props = {
    totalDarts: number;
    dartsInsideCircle: number;
  };
  let { totalDarts, dartsInsideCircle }: Props = $props();

  const proportionInCircle = $derived(totalDarts > 0 ? dartsInsideCircle / totalDarts : 0);
  const piEstimation = $derived(4 * proportionInCircle);
</script>

<div class="statistics">
  <p>
    Darts Inside Circle: {dartsInsideCircle} / {totalDarts} = {(proportionInCircle * 100).toFixed(
      4,
    )}%
  </p>
  <p>Pi Estimation: {piEstimation.toFixed(6)}</p>
</div>

<style>
  .statistics {
    font-family: monospace;
  }
</style>
