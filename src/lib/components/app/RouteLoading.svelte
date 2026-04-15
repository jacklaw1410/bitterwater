<script lang="ts">
  import { navigating } from '$app/state';
</script>

{#if navigating.to}
  <div class="route-loading" role="status" aria-label="Loading new page">
    <div class="spinner"></div>
  </div>
{/if}

<style>
  .route-loading {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    height: 3px;
    overflow: hidden;
  }

  .spinner {
    height: 100%;
    background: linear-gradient(
      90deg,
      var(--brand-600) 0%,
      var(--brand-300) 50%,
      var(--brand-600) 100%
    );
    background-size: 200% 100%;
    animation: loading 2s ease-in-out infinite;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation: none;
      background: var(--brand-600);
    }
  }
</style>
