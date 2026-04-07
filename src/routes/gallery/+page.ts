import { asset } from '$app/paths';
import type { RouteId } from '$app/types';

import type { PageLoad } from './$types';

export type FeatureMetadata = {
  title: string;
  description: string;
  thumbnail?: string;
};

export type FeatureCardData = {
  slug: string;
  href: RouteId;
  metadata: FeatureMetadata;
};

type FeatureModule = {
  metadata?: FeatureMetadata;
};

export const load: PageLoad = async () => {
  const modules = import.meta.glob('./*/+page.svelte', { eager: true });

  const features: FeatureCardData[] = [];

  for (const [path, module] of Object.entries(modules)) {
    // Extract slug from path: './brownian-motion/+page.svelte' -> 'brownian-motion'
    const slug = path.split('/')[1];

    // Cast module to FeatureModule
    const mod = module as FeatureModule;

    // Check if metadata exists
    if ('metadata' in mod && typeof mod.metadata === 'object' && mod.metadata !== null) {
      const metadata = mod.metadata as FeatureMetadata;
      if (metadata.title && metadata.description) {
        // TODO: Check the existence of files
        metadata.thumbnail = asset(`/thumbnails/${slug}.jpeg`);
        features.push({
          slug,
          href: `/gallery/${slug}` as RouteId,
          metadata,
        });
      } else {
        console.warn(`Feature ${slug} has incomplete metadata:`, metadata);
      }
    } else {
      console.warn(`Feature ${slug} does not export metadata`);
    }
  }

  return {
    features,
  };
};
