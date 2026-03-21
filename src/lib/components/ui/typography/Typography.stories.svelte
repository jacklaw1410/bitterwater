<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import Typography from './Typography.svelte';

  const { Story } = defineMeta({
    title: 'UI/Typography',
    component: Typography,
    tags: ['autodocs'],
  });
</script>

<Story name="H1" args={{ variant: 'h1' }}>Taxing Laughter</Story>

<Story name="H2" args={{ variant: 'h2' }}>The People of the Kingdom</Story>

<Story name="H3" args={{ variant: 'h3' }}>The Joke Tax</Story>

<Story name="H4" args={{ variant: 'h4' }}>People stopped telling jokes</Story>

<Story name="Lead" args={{ variant: 'lead' }}>
  A modal dialog that interrupts the user with important content and expects a response.
</Story>

<Story name="Body" args={{ variant: 'body' }}>
  Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his
  throne.
</Story>

<Story name="Large" args={{ variant: 'large' }}>Are you sure absolutely sure?</Story>

<Story name="Small" args={{ variant: 'small' }}>Email address</Story>

<Story name="Muted" args={{ variant: 'muted' }}>Enter your email address.</Story>
