<script lang="ts">
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';
  import Header from '$lib/components/app/layout/Header.svelte';
  import RouteLoading from '$lib/components/app/RouteLoading.svelte';
  let { children } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<RouteLoading />
<Header />
<main class="container">
  {#key page.url.pathname}
    <div class="fly-in">
      {@render children()}
    </div>
  {/key}
</main>

<style>
  @media (prefers-reduced-motion: no-preference) {
    .fly-in {
      transition-property: opacity, transform;
      transition-duration: 500ms;
      transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 1;
      transform: translateY(0);
      transition-delay: 100ms;

      /* Native CSS entry animation */
      @starting-style {
        opacity: 0;
        transform: translateY(20px);
      }
    }
  }

  .container {
    max-width: var(--max-width);
    margin: 0 auto;
    padding: 0 var(--space-4);
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 calc(var(--space-4) / 2);
    }
  }
</style>
