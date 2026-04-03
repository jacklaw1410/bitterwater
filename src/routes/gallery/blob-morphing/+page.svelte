<script module lang="ts">
  export const metadata = {
    title: 'Blob Morphing',
    description: 'Animated SVG blob that morphs through different shapes using CSS animations.',
  } as const;
</script>

<script lang="ts">
  import PlayPauseToggle from '$lib/components/app/PlayPauseToggle.svelte';

  const PATHS = [
    'M660.1 163.6C710.9 177.9 740.9 242.8 764.2 307.0C787.5 371.1 804.0 434.5 783.2 483.6C762.4 532.8 704.2 567.8 655.8 595.4C607.3 623.1 568.6 643.4 521.6 675.3C474.7 707.2 419.4 750.7 365.4 752.3C311.3 753.8 258.4 713.3 227.9 662.2C197.4 611.2 189.2 549.5 164.5 480.7C139.7 411.9 98.3 335.9 108.9 271.6C119.4 207.3 182.0 154.6 250.2 148.3C318.4 142.0 392.3 181.9 465.0 183.7C537.7 185.6 609.3 149.2 660.1 163.6',
    'M635.8 240.0C690.1 276.2 757.7 290.3 779.0 328.1C800.3 366.0 775.2 427.5 773.7 498.0C772.2 568.6 794.3 648.0 768.7 697.2C743.2 746.4 670.1 765.2 606.7 755.5C543.4 745.7 489.8 707.4 430.7 689.4C371.5 671.5 306.8 673.9 243.1 648.6C179.4 623.3 116.9 570.2 112.7 511.5C108.5 452.7 162.6 388.3 214.2 342.5C265.9 296.6 314.9 269.3 362.1 229.8C409.2 190.3 454.5 138.7 497.5 142.1C540.6 145.4 581.5 203.8 635.8 240.0',
    'M524.9 188.4C593.1 214.3 685.4 220.7 733.6 265.1C781.8 309.6 786.0 392.1 746.3 448.0C706.7 504.0 623.3 533.3 571.3 585.4C519.3 637.5 498.6 712.4 450.9 752.8C403.1 793.3 328.3 799.4 281.7 761.7C235.1 724.1 216.7 642.7 191.8 583.8C166.9 524.9 135.5 488.4 128.4 447.7C121.3 406.9 138.4 361.9 157.9 317.3C177.3 272.6 199.1 228.5 234.5 187.7C270.0 146.9 319.2 109.4 365.9 113.4C412.6 117.3 456.7 162.6 524.9 188.4',
    'M591.8 215.1C653.1 238.2 725.8 259.6 753.4 305.9C781.0 352.1 763.4 423.1 730.5 475.7C697.6 528.2 649.4 562.2 617.0 623.1C584.7 684.0 568.2 771.8 528.1 787.1C488.1 802.3 424.5 745.1 350.9 723.0C277.3 700.9 193.6 714.1 157.8 681.1C121.9 648.1 134.0 569.0 139.5 500.7C144.9 432.3 143.8 374.8 150.8 304.8C157.8 234.9 172.8 152.6 220.8 123.6C268.9 94.5 350.0 118.7 415.4 143.1C480.8 167.5 530.6 192.1 591.8 215.1',
    'M625.6 182.1C688.1 197.4 766.3 213.0 809.1 258.8C852.0 304.6 859.3 380.7 835.8 442.9C812.3 505.2 757.8 553.6 710.3 607.6C662.8 661.6 622.2 721.1 568.3 738.5C514.3 756.0 447.0 731.4 382.7 707.4C318.5 683.4 257.4 660.1 198.2 619.6C138.9 579.1 81.7 521.4 60.4 451.4C39.1 381.3 53.9 298.9 107.9 256.7C161.8 214.5 255.0 212.4 321.8 199.1C388.7 185.8 429.3 161.3 472.9 156.5C516.5 151.7 563.2 166.8 625.6 182.1',
  ];
  const from = PATHS[0];
  const values = [...PATHS, from].join(';');

  // oxlint-disable-next-line no-unassigned-vars
  let svgElement: SVGSVGElement;

  let paused = $state(false);
  const ontoggle = () => {
    if (paused) {
      paused = false;
      svgElement.unpauseAnimations();
    } else {
      paused = true;
      svgElement.pauseAnimations();
    }
  };
</script>

{#snippet thumbnail(d: string)}
  <svg
    viewBox="0 0 900 900"
    width="100"
    height="100"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    version="1.1"
  >
    <path fill="#BB004B" {d} />
  </svg>
{/snippet}

<svelte:head>
  <title>Bitter Water - Blob Morphing</title>
</svelte:head>

<h1>Blob Morphing</h1>
<p>
  Morphing blobs generated using <a href="https://app.haikei.app/">Haikei</a>. The animation is
  achieved by applying the
  <a href="https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/animate">animate</a> element
  to the path of the SVG.
</p>

<PlayPauseToggle playing={!paused} onclick={ontoggle} />
<svg
  id="blob-svg"
  bind:this={svgElement}
  role="img"
  aria-label="Animated blob morphing"
  viewBox="0 0 900 900"
  width="360"
  height="360"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  version="1.1"
  data-thumbnail-target
>
  <path fill="#BB004B">
    <animate attributeName="d" {values} dur="5s" repeatCount="indefinite" />
  </path>
</svg>

<p>The animation cycles through the following blobs:</p>

<ol role="list" aria-label="Blobs used in animation">
  {#each PATHS as d, ix (ix)}
    <li role="listitem" aria-label={`Blob thumbnail ${ix + 1}`}>
      {@render thumbnail(d)}
    </li>
  {/each}
</ol>

<style>
  ol {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin: 0;
    padding: 0;
  }
</style>
