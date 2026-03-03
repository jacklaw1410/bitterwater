<script lang="ts">
  import { theme, toggleTheme } from '$lib/theme';
</script>

<header class="header">
  <div class="container">
    <a href="/" class="logo">Svelte 101</a>
    <nav>
      <a href="/">Home</a>
      <a href="/brownian-motion">Brownian Motion</a>
    </nav>
    <button class="theme-toggle" aria-label="Toggle theme" on:click={toggleTheme}>
      {#if $theme === 'dark'}🌙{/if}
      {#if $theme === 'light'}☀️{/if}
    </button>
  </div>
</header>

<style>
  .header {
    background-color: var(--color-primary);
  }
  .container {
    margin: 0 auto;
    padding: 0 1rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-gap: 1rem;
    align-items: center;
  }
  .logo {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--color-on-primary);
    text-decoration: none;
  }
  nav {
    display: flex;
    gap: 1rem;
  }
  nav a {
    color: var(--color-on-primary);
    text-decoration: none;
    font-size: 1rem;
  }
  .theme-toggle {
    background: none;
    border: none;
    color: var(--color-on-primary);
    font-size: 1.2rem;
    cursor: pointer;
  }
</style>
