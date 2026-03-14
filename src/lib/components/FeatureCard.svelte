<script lang="ts">
  import type { RouteId } from '$app/types';
  import { resolve } from '$app/paths';

  interface Props {
    title: string;
    description: string;
    href: RouteId;
    thumbnail?: string;
  }

  let { title, description, href, thumbnail }: Props = $props();
</script>

<a href={resolve(href)} class="feature-card" aria-label={`View ${title} demo`}>
  {#if thumbnail}
    <img src={thumbnail} alt={`${title} preview`} class="thumbnail" />
  {:else}
    <div class="placeholder">
      <span>{title.charAt(0).toUpperCase()}</span>
    </div>
  {/if}
  <div class="content">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
</a>

<style>
  .feature-card {
    display: block;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    text-decoration: none;
    color: inherit;
    transition: box-shadow 0.2s ease;
    background: var(--bg-color);
  }

  .feature-card:hover {
    box-shadow: 0 4px 12px var(--color-shadow);
  }

  .thumbnail {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
    margin-bottom: 1rem;
  }

  .placeholder {
    width: 100%;
    height: 150px;
    background: var(--accent-color);
    border-radius: 4px;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 3rem;
    font-weight: bold;
  }

  .content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.25rem;
  }

  .content p {
    margin: 0;
    color: var(--text-secondary);
    line-height: 1.4;
  }
</style>
