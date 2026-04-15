<script lang="ts">
  import { resolve } from '$app/paths';
  import { page } from '$app/state';
  import favicon from '$lib/assets/favicon.svg';
  import { theme, toggleTheme } from '$lib/theme';

  const ROUTES = [
    { id: '/', name: 'Home' },
    { id: '/gallery', name: 'Gallery' },
  ] as const;
</script>

{#snippet curve()}
  <svg
    id="visual"
    viewBox="0 0 960 42"
    width="960"
    height="42"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
  >
    <rect x="0" y="0" width="960" height="42" fill="none"></rect>

    <path
      d="M0 40.5L16 37.1C32 33.8 64 27 96 24.9C128 22.7 160 25.3 192 27.4C224 29.5 256 31.3 288 30.2C320 29.1 352 25.3 384 23.3C416 21.3 448 21.3 480 21.7C512 22.1 544 22.7 576 25.8C608 28.8 640 34.1 672 37.3C704 40.5 736 41.6 768 42.3C800 43 832 43.4 864 40.7C896 38.1 928 32.3 944 29.5L960 26.7L960 0L944 0C928 0 896 0 864 0C832 0 800 0 768 0C736 0 704 0 672 0C640 0 608 0 576 0C544 0 512 0 480 0C448 0 416 0 384 0C352 0 320 0 288 0C256 0 224 0 192 0C160 0 128 0 96 0C64 0 32 0 16 0L0 0Z"
      class="shape-fill"
      stroke-linecap="round"
      stroke-linejoin="miter"
    ></path>
  </svg>
{/snippet}

<header class="header">
  <div class="curve top">
    {@render curve()}
  </div>
  <div class="nav-container" data-sveltekit-preload-code="viewport">
    <a href={resolve('/')} class="logo" aria-label="Bitter Water">
      <img src={favicon} alt="Logo" width="32" height="32" />
      <span>Bitter Water</span>
    </a>
    <nav>
      {#each ROUTES as route (route.id)}
        <a
          href={resolve(route.id)}
          aria-current={page.route.id === route.id ||
          (route.id === '/gallery' && page.route.id?.startsWith('/gallery'))
            ? 'page'
            : undefined}>{route.name}</a
        >
      {/each}
    </nav>
    <button class="theme-toggle" aria-label="Toggle theme" onclick={toggleTheme}>
      {#if $theme === 'dark'}🌙{/if}
      {#if $theme === 'light'}☀️{/if}
    </button>
  </div>
  <div class="curve bottom">
    {@render curve()}
  </div>
</header>

<style>
  .header {
    position: relative;
    background-color: var(--action-primary-bg);
    overflow-x: clip;
  }
  .nav-container {
    margin: 0 auto var(--space-8);
    padding: 0 var(--space-4);
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-gap: var(--space-4);
    align-items: center;
    height: 48px;
  }
  .logo {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--text-inverse);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: var(--space-1);
    margin-bottom: var(--space-1);
  }
  .nav-container > nav {
    display: flex;
    gap: var(--space-4);
  }
  .nav-container > nav a {
    color: var(--text-inverse);
    text-decoration: none;
    font-size: var(--text-base);
  }
  .nav-container > nav a[aria-current='page'] {
    border-bottom: 2px solid var(--text-inverse);
  }
  .theme-toggle {
    background: none;
    border: none;
    color: var(--text-inverse);
    font-size: 1em;
    cursor: pointer;
    justify-self: flex-end;
  }
  .curve {
    width: 100%;
    line-height: 0;
    position: absolute;
    z-index: -1;
  }
  .curve.top {
    transform: rotateX(180deg) scaleY(0.3);
    top: -24px;
  }
  .curve.bottom {
    transform: scaleY(0.8);
    top: 28px;
  }
  .shape-fill {
    fill: var(--action-primary-bg);
  }

  @media (max-width: 480px) {
    .nav-container {
      grid-template-columns: auto auto;
      grid-gap: 0.5rem;
    }
    .nav-container > nav {
      display: none;
    }
  }
</style>
