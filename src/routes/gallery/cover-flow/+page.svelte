<script module lang="ts">
  import { asset } from '$app/paths';
  export const metadata = {
    title: 'Cover Flow',
    description: 'Interactive cover flow carousel displaying a collection of images.',
    thumbnail: asset('/cover-flow/image_1.jpeg'),
  } as const;
</script>

<script lang="ts">
  let carousell: HTMLUListElement;
  const srcs = Array.from(
    { length: 16 },
    (_, ix) => [asset(`/cover-flow/image_${ix + 1}.jpeg`), `Image ${ix + 1}`] as const,
  );

  $effect(() => {
    const child = carousell.children[Math.floor(carousell.children.length / 2) - 1];
    if (child) {
      child.scrollIntoView({ behavior: 'instant', block: 'center', inline: 'center' });
    } else {
      carousell.scrollBy({ left: (carousell.scrollWidth - carousell.clientWidth) / 2 });
    }
  });
</script>

<svelte:head>
  <title>Cover Flow</title>
</svelte:head>

<h1>Cover Flow</h1>
<p>
  Experience the <a href="https://en.wikipedia.org/wiki/Cover_Flow">Cover Flow</a> effect by scrolling
  through the images. This effect is achieved using 100% CSS, making it fast and efficient.
</p>

<ul
  class="carousell"
  role="region"
  aria-roledescription="carousell"
  aria-label="Cover flow of images"
  bind:this={carousell}
>
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
      z-index: 100;
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
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .carousell {
    transform-style: preserve-3d;
    list-style: none;
    white-space: nowrap;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    padding: 64px 0px;
    perspective: 40em;

    /*
     * We use a fade-in animation to gracefully introduce the carousel.
     * On load, we programmatically scroll to a starting element. Using
     * `scrollIntoView({ behavior: 'instant' })` causes a jump, which this
     * animation hides to prevent a jarring flicker.
     *
     * Note that `scrollIntoView({ behavior: 'smooth' })` is not used
     * because its smooth scrolling animation does not respect the
     * `scroll-snap-type` property, leading to misaligned elements.
     */
    animation-name: fade-in;
    animation-timing-function: ease-in;
    animation-duration: 500ms;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }
  .placeholder {
    display: inline-block;
    /* Calibrated to match the cover size */
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
    will-change: transform, z-index;
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
