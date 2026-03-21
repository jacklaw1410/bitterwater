<script lang="ts">
  import type { PageProps } from './$types';
  import FeatureCard from '$lib/components/app/FeatureCard.svelte';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Bitter Water - Gallery</title>
</svelte:head>

<h1>Gallery</h1>

{#if data.features.length > 0}
  <div class="gallery-grid">
    {#each data.features as feature (feature.slug)}
      <FeatureCard
        title={feature.metadata.title}
        description={feature.metadata.description}
        href={feature.href}
        thumbnail={feature.metadata.thumbnail}
      />
    {/each}
  </div>
{:else}
  <p>No features available yet. Check back soon!</p>
{/if}

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
    margin-top: 2rem;
  }
</style>
