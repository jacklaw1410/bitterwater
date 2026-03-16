<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FeatureCard from './FeatureCard.svelte';
  import type { RouteId } from '$app/types';
  import type { ComponentProps } from 'svelte';

  const options = Array.from({ length: 16 }, (_, ix) => `/cover-flow/image_${ix + 1}.jpeg`);

  const { Story } = defineMeta({
    title: 'Components/FeatureCard',
    component: FeatureCard,
    tags: ['autodocs'],
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      href: { control: 'text' },
      thumbnail: { control: 'select', options, defaultValue: options[0] },
    },
    render: template,
  });
</script>

{#snippet template(args: ComponentProps<typeof FeatureCard>)}
  <div style="width: 300px">
    <FeatureCard {...args} />
  </div>
{/snippet}

<Story
  name="Default"
  args={{
    title: 'Sample Feature',
    description: 'This is a description of the sample feature.',
    href: '/gallery/default' as RouteId,
    thumbnail: options[0],
  }}
/>

<Story
  name="Long Text"
  args={{
    title: 'Feature with a Much Longer Title to Test Text Wrapping and Layout',
    description:
      'This is a much longer and more detailed description for the feature card. It is intended to test how the component handles larger amounts of text and to see if the layout breaks or if the text wraps correctly within the given constraints of the card design.',
    href: '/gallery/long-text' as RouteId,
    thumbnail: options[0],
  }}
/>

<Story
  name="No Thumbnail"
  args={{
    title: 'Feature Without a Thumbnail',
    description: 'This feature card does not have a thumbnail image.',
    href: '/gallery/no-thumbnail' as RouteId,
    thumbnail: undefined,
  }}
/>
