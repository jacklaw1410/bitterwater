<script lang="ts">
</script>

<header class="header">
  <div class="container">
    <a href="/" class="logo">Svelte 101</a>
    <nav>
      <a href="/">Home</a>
      <a href="/brownian-motion">Brownian Motion</a>
    </nav>
  </div>
</header>

<style>
  .header {
    background-color: var(--header-background);
  }
  .container {
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .logo {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
    text-decoration: none;
  }
  nav {
    display: flex;
    gap: 1rem;
  }
  nav a {
    color: var(--text-color);
    text-decoration: none;
    font-size: 1rem;
  }
</style>
