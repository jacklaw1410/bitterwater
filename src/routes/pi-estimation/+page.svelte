<script lang="ts">
  import PiEstimation from './components/PiEstimation.svelte';
  import Controls from './components/Controls.svelte';
  import Statistics from './components/Statistics.svelte';
  import { state, initialize } from './state.svelte';

  initialize();
</script>

<svelte:head>
  <title>Pi Estimation</title>
</svelte:head>

<h1>Pi Estimation</h1>

<Controls />
<Statistics totalDarts={state.totalDarts} dartsInsideCircle={state.dartsInsideCircle} />
<PiEstimation darts={state.darts} />
