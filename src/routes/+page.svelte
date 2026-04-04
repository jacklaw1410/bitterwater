<script lang="ts">
  import { resolve } from '$app/paths';
  import Button from '$lib/components/ui/button/Button.svelte';
  import Typography from '$lib/components/ui/typography/Typography.svelte';
</script>

<svelte:head>
  <title>Bitter Water - Home</title>
</svelte:head>

<div class="home-content">
  <svg class="ripple" viewBox="0 0 100 30" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M0 15 
         Q10 5 20 15 
         T40 15 
         T60 15 
         T80 15 
         T100 15"
      fill="none"
      stroke="var(--brand-200)"
      stroke-width="2"
    />
  </svg>
  <Typography variant="h1">Welcome to my digital garden</Typography>
  <Typography variant="body" class="font-body">
    This is my playful corner of the web where I <span class="font-technical">tinker</span>,
    <span class="font-technical">create</span>, and make <span class="font-technical">splashy</span>
    things with code. Think of it as a <span class="font-technical">visualization playground</span>
    and <span class="font-technical">creative coding lab</span> all rolled into one.
  </Typography>

  <Button variant="primary" size="lg" href={resolve('/gallery')} class="cta-button">
    Explore the Gallery
  </Button>
</div>

<style>
  .home-content {
    text-align: center;
    padding: var(--space-12) 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--space-6);
  }

  .ripple {
    width: 80px;
    height: 20px;
    margin: 0 auto var(--space-4);
    opacity: 0.7;
  }

  :global(.home-content .font-body) {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    max-width: 40rem;
  }

  .font-technical {
    font-family: var(--font-mono);
    font-weight: var(--font-medium);
    font-size: var(--text-sm);
    letter-spacing: -0.05em;
  }

  :global(.home-content .font-body) {
    font-size: var(--text-lg);
    color: var(--text-secondary);
    max-width: 40rem;
  }

  :global(.home-content .cta-button) {
    margin-top: var(--space-6);
    text-decoration: none;
    transition: all var(--duration-fast) var(--ease-in-out);
  }

  :global(.home-content .cta-button:hover),
  :global(.home-content .cta-button:focus) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
</style>
