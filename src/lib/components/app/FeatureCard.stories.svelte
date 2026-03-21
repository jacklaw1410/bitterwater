<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import FeatureCard from './FeatureCard.svelte';
  import type { RouteId } from '$app/types';
  import type { ComponentProps } from 'svelte';
  import { within, expect } from 'storybook/test';

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
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole('link', { name: /view sample feature demo/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/gallery/default');

    const heading = canvas.getByRole('heading', { name: /sample feature/i });
    expect(heading).toBeInTheDocument();

    const description = canvas.getByText(/this is a description of the sample feature./i);
    expect(description).toBeInTheDocument();
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
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole('link', {
      name: /view feature with a much longer title to test text wrapping and layout demo/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/gallery/long-text');

    const heading = canvas.getByRole('heading', {
      name: /feature with a much longer title to test text wrapping and layout/i,
    });
    expect(heading).toBeInTheDocument();

    const description = canvas.getByText(
      /this is a much longer and more detailed description for the feature card./i,
    );
    expect(description).toBeInTheDocument();
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
  play={async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const link = canvas.getByRole('link', { name: /view feature without a thumbnail demo/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/gallery/no-thumbnail');

    const heading = canvas.getByRole('heading', { name: /feature without a thumbnail/i });
    expect(heading).toBeInTheDocument();

    const description = canvas.getByText(/this feature card does not have a thumbnail image./i);
    expect(description).toBeInTheDocument();

    const card = canvas.getByRole('link');
    expect(card).not.toHaveStyle({
      'background-image': /url/,
    });
  }}
/>
