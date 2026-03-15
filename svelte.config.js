import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: process.env.NODE_ENV === 'production' ? '/bitterwater' : '',
    },
  },
  preprocess: [mdsvex()],
  extensions: ['.svelte', '.svx'],
};

export default config;
