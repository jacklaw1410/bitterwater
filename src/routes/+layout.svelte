<script lang="ts">
  import favicon from '$lib/assets/favicon.svg';
  import Header from '$lib/components/app/layout/Header.svelte';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<Header />
<main class="container">
  {@render children()}
</main>
