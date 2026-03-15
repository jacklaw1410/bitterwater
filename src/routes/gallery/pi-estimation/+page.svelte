<script module lang="ts">
  export const metadata = {
    title: 'π Estimation',
    description: 'Monte Carlo simulation for estimating the value of π using random points.',
  } as const;
</script>

<script lang="ts">
  import PiEstimation from './components/PiEstimation.svelte';
  import Controls from './components/Controls.svelte';
  import Statistics from './components/Statistics.svelte';
  import { state, initialize } from './state.svelte';

  initialize();
</script>

<svelte:head>
  <title>Bitter Water - π Estimation</title>
</svelte:head>

<h1>π Estimation</h1>
<p>
  This is an interactive visualization for estimating the value of <i>π</i>. The estimation is
  performed by throwing darts at a target and counting the proportion of darts that land inside a
  circle. The more darts thrown, the better the estimation of <i>π</i>.
</p>

<Controls />
<Statistics totalDarts={state.totalDarts} dartsInsideCircle={state.dartsInsideCircle} />
<PiEstimation darts={state.darts} />
