# Generate Thumbnails for Gallery Features Implementation Plan

## Overview

This plan outlines the process of adding a command to produce thumbnail images for each feature under the `/gallery` path. Playwright will be used to take actual screenshots of the rendered pages, with specific viewport dimensions (800x600) and an optional cropping mechanism based on a `data-thumbnail-target` attribute. The generated thumbnails will be in JPEG format, and the `src/routes/gallery/+page.ts` file will be updated to display these thumbnails.

## Current State Analysis

The project currently uses Playwright for end-to-end testing, with a well-defined configuration in `playwright.config.ts` that handles launching a local development server. Existing e2e tests in the `e2e/` directory demonstrate the use of Playwright's screenshot capabilities. Gallery features are served as static HTML files from the `build/gallery/` directory. The `package.json` file contains various scripts, including those for running Playwright tests.

## Desired End State

After the implementation is complete, running a new `bun run generate:thumbnails` command will:

- Launch the application using the Playwright web server.
- Iterate through all directories in `src/routes/gallery/` to identify gallery features.
- For each gallery feature, navigate to its corresponding URL.
- If an element with the `data-thumbnail-target` attribute is present on the page, a screenshot of that specific element will be captured.
- Otherwise, a screenshot of the entire 800x600 viewport will be taken.
- Resize the image to 800x600, with cropping if necessary, and then save the screenshot as a JPEG image (e.g., `blob-morphing.jpeg`) in the `static/thumbnails/` directory.
- Any errors during the process (e.g., page loading failures) will be rethrown to notify the user.

After thumbnails are generated, the `src/routes/gallery/+page.ts` will be updated to fetch and display these thumbnails.

### Key Discoveries

- `playwright.config.ts:1-15`: Defines the web server and base URL, which are essential for Playwright to access the application.
- `e2e/home.test.ts:1-9`: Provides an example of Playwright's screenshot functionality.
- `package.json`: Will be updated with a new script to trigger thumbnail generation.
- `build/gallery/`: Contains the static HTML files for the gallery features, which will be targeted for screenshots.

## What We're NOT Doing

- Integrating thumbnail generation directly into the main build process. This will remain an on-demand command.
- Creating a complex UI for selecting the thumbnail target. The mechanism will be attribute-based.

## Implementation Approach

The implementation will involve creating a new Playwright script (not a test file) that acts as a utility. This script will programmatically navigate to each gallery feature and capture screenshots based on the defined criteria.

## Phase 1: Setup Playwright Script and Output Directory

### Overview

This phase involves creating the necessary file structure and adding the basic command to trigger the thumbnail generation process.

### Changes Required

#### 1. Create `scripts/generate-thumbnails.ts`

**File**: `/Users/jack.law/Projects/bitterwater/scripts/generate-thumbnails.ts`
**Changes**: Create a new Playwright script file to house the thumbnail generation logic. This will not be a Playwright test file.

```typescript
// scripts/generate-thumbnails.ts
import { chromium } from '@playwright/test';
import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';

const THUMBNAIL_DIR = './static/thumbnails';
const GALLERY_BUILD_DIR = './build/gallery';
const VIEWPORT_WIDTH = 800;
const VIEWPORT_HEIGHT = 600;
const BASE_URL = process.env.CI ? 'http://localhost:4173/bitterwater' : 'http://localhost:4173';

async function generateThumbnails() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await mkdir(THUMBNAIL_DIR, { recursive: true });

  const galleryFiles = await readdir(GALLERY_BUILD_DIR);

  await page.setViewportSize({ width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT });

  for (const file of galleryFiles) {
    if (file.endsWith('.html')) {
      const featureName = file.replace('.html', '');
      const url = `${BASE_URL}/gallery/${file}`;
      const outputPath = join(THUMBNAIL_DIR, `${featureName}.jpeg`);

      try {
        await page.goto(url, { waitUntil: 'networkidle' });

        const targetElement = await page.$('[data-thumbnail-target]');
        if (targetElement) {
          await targetElement.screenshot({ path: outputPath, type: 'jpeg', quality: 80 });
        } else {
          // Take a screenshot of the viewport at the specified dimensions
          await page.screenshot({ path: outputPath, fullPage: false, type: 'jpeg', quality: 80 });
        }
        console.log(`Generated thumbnail for ${featureName} at ${outputPath}`);
      } catch (error) {
        console.error(`Failed to generate thumbnail for ${featureName}:`, error);
        // Rethrow to notify user of failure
        throw error;
      }
    }
  }

  await browser.close();
}

generateThumbnails().catch((error) => {
  console.error('Error generating thumbnails:', error);
  process.exit(1);
});
```

#### 2. Create `static/thumbnails/` directory

**Directory**: `/Users/jack.law/Projects/bitterwater/static/thumbnails/`
**Changes**: Create a new directory to store the generated thumbnail images.

#### 3. Add `generate:thumbnails` script to `package.json`

**File**: `/Users/jack.law/Projects/bitterwater/package.json`
**Changes**: Add a new script to the `scripts` section to execute the Playwright thumbnail generation utility.

```json
// ... (existing package.json content)
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "prepare": "(svelte-kit sync || echo '') && husky",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "test:unit": "vitest",
    "test": "bun test:unit -- --run && bun test:e2e",
    "test:e2e": "playwright test",
    "test:e2e:ci-snapshot": "docker build -t bitterwater-e2e . && docker run --rm -v $(pwd)/e2e:/app/e2e -v $(pwd)/test-results:/app/test-results bitterwater-e2e",
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build",
    "generate:thumbnails": "bun ts-node scripts/generate-thumbnails.ts",
  },
// ... (rest of package.json)
```

### Success Criteria

#### Automated Verification

- [ ] File `scripts/generate-thumbnails.ts` exists.
- [ ] Directory `static/thumbnails/` exists.
- [ ] `package.json` contains the `generate:thumbnails` script.

#### Manual Verification

- [ ] Running `bun run generate:thumbnails` executes the Playwright script (even if it's empty at this stage).

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 2: Implement Thumbnail Generation Logic

### Overview

This phase will focus on writing the core logic within `scripts/generate-thumbnails.ts` to iterate through gallery features, navigate, set viewport, handle cropping, take screenshots, and save them.

### Changes Required

#### 1. Implement thumbnail generation in `scripts/generate-thumbnails.ts`

**File**: `/Users/jack.law/Projects/bitterwater/scripts/generate-thumbnails.ts`
**Changes**: Add the logic to read gallery files, loop, navigate, set viewport, capture, crop, and save screenshots. The provided code block in Phase 1 (under "Create `scripts/generate-thumbnails.ts`") already contains the correct implementation for `scripts/generate-thumbnails.ts`.

**Note**: The `fs/promises` and `path` imports will require a Node.js context, which Playwright tests run in. The `page.evaluate` part is a placeholder for `fs.mkdir` which should be handled by Node.js, not in the browser context. This will be an external step.

### Success Criteria

#### Automated Verification

- [ ] Running `bun run generate:thumbnails` completes without errors.
- [ ] The `static/thumbnails/` directory contains JPEG images for each gallery feature (e.g., `blob-morphing.jpeg`, `brownian-motion.jpeg`, etc.).
- [ ] Each generated thumbnail is 800x600 pixels, or cropped to the `data-thumbnail-target` element if present.

#### Manual Verification

- [ ] Visually inspect the generated thumbnails to ensure they accurately represent the gallery features and the cropping/viewport settings are correct.
- [ ] Verify that if `data-thumbnail-target` is added to a gallery page, the thumbnail correctly crops to that element.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests

N/A - This is an e2e-style utility script.

### Integration Tests

- The `e2e/generate-thumbnails.test.ts` script itself serves as the integration test. It verifies the end-to-end functionality of navigating to gallery pages and capturing screenshots.

### Manual Testing Steps

1. Run the thumbnail generation command: `bun run generate:thumbnails`
2. Open the `static/thumbnails/` directory.
3. Review each generated JPEG image:
   - Confirm the dimensions are approximately 800x600.
   - Confirm the image content accurately reflects the corresponding gallery feature.
   - (Optional) Add `data-thumbnail-target="true"` to an element in one of the `build/gallery/*.html` files, re-run the command, and verify the thumbnail is cropped to that element.

## Performance Considerations

- The process involves launching a browser for each thumbnail, which can be time-consuming for many gallery features. Parallelizing the screenshot capture could be considered for future optimization, but for an on-demand command, a sequential approach is acceptable initially.

## Migration Notes

N/A - This is a new feature and does not require data migration.

## References

- Related research: `thoughts/research/20260316-gallery-thumbnails.md`
  **Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Phase 3: Update Gallery Page to Use Thumbnails

### Overview

This phase involves modifying the `src/routes/gallery/+page.ts` file to include the generated thumbnails in the `FeatureCardData` and updating the Svelte component to display them.

### Changes Required

#### 1. Update `src/routes/gallery/+page.ts` to include thumbnail paths

**File**: `/Users/jack.law/Projects/bitterwater/src/routes/gallery/+page.ts`
**Changes**: Modify the `PageLoad` function to dynamically assign the `thumbnail` property to each `FeatureMetadata` object based on the generated JPEG files.

```typescript
import type { RouteId } from '$app/types';
import type { PageLoad } from './$types';
import { readdir } from 'fs/promises';
import { join } from 'path';

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
  const thumbnailFiles = await readdir('./static/thumbnails').catch(() => []); // Handle if directory doesn't exist yet

  for (const [path, module] of Object.entries(modules)) {
    // Extract slug from path: './brownian-motion/+page.svelte' -> 'brownian-motion'
    const slug = path.split('/')[1];

    // Cast module to FeatureModule
    const mod = module as FeatureModule;

    // Check if metadata exists
    if ('metadata' in mod && typeof mod.metadata === 'object' && mod.metadata !== null) {
      const metadata = mod.metadata as FeatureMetadata;
      if (metadata.title && metadata.description) {
        // Assign thumbnail if available
        const thumbnailFileName = `${slug}.jpeg`;
        if (thumbnailFiles.includes(thumbnailFileName)) {
          metadata.thumbnail = `/static/thumbnails/${thumbnailFileName}`;
        }
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
```

#### 2. Update `src/routes/gallery/+page.svelte` to display thumbnails

**File**: `/Users/jack.law/Projects/bitterwater/src/routes/gallery/+page.svelte`
**Changes**: Modify the Svelte component to use the `metadata.thumbnail` property for displaying the image. (This will be a conceptual change in the plan, as the actual Svelte code would depend on existing component structure.)

```svelte
<!-- Example snippet, actual implementation may vary -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="gallery-grid">
  {#each data.features as feature}
    <a href={feature.href} class="feature-card">
      {#if feature.metadata.thumbnail}
        <img src={feature.metadata.thumbnail} alt={feature.metadata.title} class="thumbnail" />
      {/if}
      <h3>{feature.metadata.title}</h3>
      <p>{feature.metadata.description}</p>
    </a>
  {/each}
</div>
```

### Success Criteria

#### Automated Verification

- [ ] `src/routes/gallery/+page.ts` compiles without errors.
- [ ] No linting errors after changes.

#### Manual Verification

- [ ] Navigate to the `/gallery` page.
- [ ] Verify that thumbnails are displayed for each gallery feature.
- [ ] Confirm that clicking on a thumbnail navigates to the correct feature page.
- [ ] Verify that if no thumbnail is generated for a feature, no broken image icon appears.

**Implementation Note**: After completing this phase and all automated verification passes, pause here for manual confirmation from the human that the manual testing was successful before proceeding to the next phase.

---

## Testing Strategy

### Unit Tests

N/A - This is an e2e-style utility script, with a small update to a SvelteKit `load` function.

### Integration Tests

- The `scripts/generate-thumbnails.ts` script itself serves as the integration test for thumbnail generation. It verifies the end-to-end functionality of navigating to gallery pages and capturing screenshots.
- For `src/routes/gallery/+page.ts` and `+page.svelte`, manual verification will be the primary method due to the visual nature of the changes.

### Manual Testing Steps

1. Run the thumbnail generation command: `bun run generate:thumbnails`
2. Open the `static/thumbnails/` directory.
3. Review each generated JPEG image:
   - Confirm the dimensions are approximately 800x600.
   - Confirm the image content accurately reflects the corresponding gallery feature.
   - (Optional) Add `data-thumbnail-target="true"` to an element in one of the `build/gallery/*.html` files, re-run the command, and verify the thumbnail is cropped to that element.
4. Start the development server: `bun dev`
5. Navigate to `http://localhost:4173/gallery` (or the appropriate base URL).
6. Verify that all gallery feature cards display their respective thumbnails.
7. Click on several thumbnails to ensure correct navigation.
8. Ensure no broken image icons or console errors related to thumbnails are present.

## Performance Considerations

- The thumbnail generation process involves launching a browser for each thumbnail, which can be time-consuming for many gallery features. Parallelizing the screenshot capture could be considered for future optimization, but for an on-demand command, a sequential approach is acceptable initially.
- Displaying thumbnails in the gallery page should be performant as they are static JPEG images. Consider lazy loading if many features are added in the future.

## Migration Notes

N/A - This is a new feature and does not require data migration.

## References

- Related research: `thoughts/research/20260316-gallery-thumbnails.md`
- Playwright documentation for `page.screenshot()` and `page.setViewportSize()`.
- SvelteKit documentation for `load` functions and component rendering.
