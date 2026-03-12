<script lang="ts">
  import { asset } from '$app/paths';
  const srcs = Array.from(
    { length: 16 },
    (_, ix) => [asset(`/cover-flow/image_${ix + 1}.jpeg`), `Image ${ix + 1}`] as const,
  );
</script>

<svelte:head>
  <title>Cover Flow</title>
</svelte:head>

<h1>Cover Flow</h1>
<p>Scroll through the images to see the cover flow effect in action.</p>
<ul class="cards" role="region" aria-roledescription="carousell" aria-label="Cover flow of images">
  <li class="placeholder"></li>
  {#each srcs as [src, alt] (src)}
    <li class="card">
      <img {src} {alt} draggable="false" />
    </li>
  {/each}
  <li class="placeholder"></li>
</ul>

<style>
  :root {
    --cover-size: 250px;
  }
  @keyframes adjust-z-index {
    0% {
      z-index: 1;
    }
    50% {
      z-index: 100; /* when centered, bring to front */
    }
    100% {
      z-index: 1;
    }
  }
  @keyframes rotate-cover {
    0% {
      transform: translateX(-100%) rotateY(-45deg);
    }
    35% {
      transform: translateX(0) rotateY(-45deg);
    }
    50% {
      transform: rotateY(0deg) scale(1.5);
    }
    65% {
      transform: translateX(0) rotateY(45deg);
    }
    100% {
      transform: translateX(100%) rotateY(45deg);
    }
  }
  .cards {
    transform-style: preserve-3d;
    list-style: none;
    white-space: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding: 64px 0px;
    perspective: 40em;
  }
  .placeholder {
    display: inline-block;
    /* Arbitrary number large enough compared with --cover-size */
    width: 331.52px;
  }
  .card {
    display: inline-block;
    width: var(--cover-size);
    aspect-ratio: 1;
    scroll-snap-align: center;

    animation:
      rotate-cover linear both,
      adjust-z-index linear both;
    animation-timeline: view(inline);

    transform-style: preserve-3d;
    will-change: transform;
    position: relative;
  }
  .card > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;

    -webkit-box-reflect: below 0.5em linear-gradient(transparent, rgba(0, 0, 0, 0.25));

    user-select: none;
  }
</style>
