<script lang="ts">
  import Typography from "$lib/components/ui/typography/Typography.svelte";

  interface Props {
    badge: number;
    heading: string;
    description: string;
    isFinal?: boolean;
    children?: import("svelte").Snippet;
  }

  let { badge, heading, description, children }: Props = $props();

  const headingId = $derived(`stage-${heading.toLowerCase().replace(/\s+/g, "-")}-heading`);
</script>

<section class="stage" aria-labelledby={headingId}>
  <header class="stage-header">
    <div class="stage-badge" aria-hidden="true">{badge}</div>
    <div>
      <Typography variant="h2" id={headingId}>{heading}</Typography>
      <Typography variant="muted">{description}</Typography>
    </div>
  </header>
  {@render children?.()}
</section>

<style>
  .stage {
    background: var(--surface-default);
    border: 1px solid var(--border-default);
    border-radius: var(--radius-lg);
    padding: var(--space-6);
    box-shadow: var(--shadow-sm);
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-gap: var(--space-5);
    transition:
      var(--duration-normal) var(--ease-in-out),
      box-shadow var(--duration-normal) var(--ease-in-out);
  }

  .stage:hover {
    box-shadow: var(--shadow-md);
    border-color: var(--border-focus);
  }

  .stage-header {
    margin: var(--space-0);
    display: flex;
    align-items: center;
    gap: var(--space-3);
  }

  .stage-badge {
    background: var(--brand-100);
    color: var(--brand-700);
    font-family: var(--font-mono);
    font-weight: var(--font-bold);
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-full);
    font-size: var(--text-sm);
    flex-shrink: 0;
  }
</style>
