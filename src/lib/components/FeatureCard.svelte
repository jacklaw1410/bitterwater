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

<a
  href={resolve(href)}
  class="feature-card"
  style:--bg-image={thumbnail ? `url(${thumbnail})` : 'none'}
  aria-label={`View ${title} demo`}
>
  <div class="content">
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
</a>

<style>
  .feature-card {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border-radius: 12px;
    padding: 1.25rem;
    text-decoration: none;
    border: 1px solid var(--color-border);
    transition: transform 0.2s ease;
    overflow: hidden;
    background-color: var(--color-bg-surface);
    color: var(--color-text-primary);
    aspect-ratio: 4 / 3;
  }

  .feature-card {
    color: white;
    background: var(--bg-image) center/cover;
  }

  .feature-card:hover {
    transform: translateY(-4px) scale(1.02);
  }

  .feature-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 75%);
    z-index: 1;
    pointer-events: none;
  }

  .content {
    position: relative;
    z-index: 2;
  }

  .content h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.5em;
    line-height: 1.2;
  }

  .feature-card > .content > h3,
  .feature-card > .content > p {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    color: rgba(255, 255, 255, 0.9);
  }

  .content p {
    margin: 0;
    color: var(--color-text-secondary);
    line-height: 1.4;
    font-size: 0.9em;
  }
</style>
