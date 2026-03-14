# Implementation Plan: Feature Gallery (Portfolio Routing + Layout)

## Overview

We are reorganizing the app’s feature pages (Brownian Motion, π Estimation, Cover Flow, Blob Morphing) into a **gallery/portfolio** structure under `/gallery`. The goal is to make the site easier to navigate and extend by:

- Moving feature routes under a shared `src/routes/gallery/` folder
- Creating a `/gallery` landing page that discovers feature pages dynamically (no manual bookkeeping)
- Adding a shared `FeatureCard` component for consistent layout
- Updating navigation to point to `/gallery` and reducing hard-coded route lists

## Current State Analysis

### Routing

- Feature routes are top-level:
  - `/brownian-motion` → `src/routes/brownian-motion/+page.svelte`
  - `/pi-estimation` → `src/routes/pi-estimation/+page.svelte`
  - `/cover-flow` → `src/routes/cover-flow/+page.svelte`
  - `/blob-morphing` → `src/routes/blob-morphing/+page.svelte`

### Navigation

- Header links are hard-coded in `src/lib/components/layout/Header.svelte` (ROUTES constant)
- Active route highlighting uses `$app/state` `page.route.id`

### Tests

- `src/lib/components/layout/Header.svelte.spec.ts` asserts each feature link exists
- `e2e/navigation.test.ts` asserts feature links exist and navigates to `/brownian-motion`
- Individual feature e2e tests navigate to the old top-level routes

### Current Convention

- Feature pages are plain SvelteKit pages; some use state modules (Svelte 5 runes)
- No unified metadata export for discoverability

## Desired End State

- **Gallery landing page** at `/gallery` that lists all feature demos with cards.
- **Feature routes moved to** `/gallery/<slug>` (e.g. `/gallery/brownian-motion`).
- **Dynamic discovery** of features via `import.meta.glob` + opt-in metadata export (no manual route listing).
- **Header navigation** points to `/gallery` (vs. individual feature links).
- New feature additions should require only:
  - Adding a new `src/routes/gallery/<new-feature>/+page.svelte`
  - Exporting a metadata object (title/description/thumbnail)

## What We're NOT Doing

- Rewriting the visual design of the existing feature demos.
- Replacing the current state-management patterns (Svelte runes) used by Brownian Motion and π Estimation.
- Adding a full CMS or external data source for feature metadata.

---

## Implementation Approach

We will implement this in **three phases**:

1. **Create Gallery Infrastructure** — build the gallery landing page, `FeatureCard`, and metadata contract.
2. **Move Feature Routes + Add Metadata** — relocate feature pages under `/gallery` and add `metadata` exports.
3. **Update Navigation & Tests (and add redirects)** — update header, update tests, and optionally add redirect pages for legacy paths.

---

## Phase 1: Create Gallery Infrastructure

### Overview

Introduce the primary UX for browsing features via a `/gallery` landing page. This phase is self-contained and does not yet change existing routes.

### Changes Required

#### 1. Gallery page + loader

**File**: `src/routes/gallery/+page.ts`

- Implement a `load` function that uses `import.meta.glob` on `./*/+page.svelte` to discover all feature pages.
- Require each feature module to export a `metadata` object (see contract below).
- Normalize the results into an array of feature descriptors:
  - `slug` (derived from the filesystem path)
  - `href` (e.g. `/gallery/${slug}`)
  - `metadata` (title, description, thumbnail)

```ts
// Example shape returned from load:
export type FeatureMetadata = {
  title: string;
  description: string;
  thumbnail?: string;
};

export type FeatureCardData = {
  slug: string;
  href: string;
  metadata: FeatureMetadata;
};
```

#### 2. Gallery page UI

**File**: `src/routes/gallery/+page.svelte`

- Render a grid of `FeatureCard` components.
- Use `data.features` returned from `+page.ts`.
- Provide a lightweight “empty” state or error state if no features are found.

#### 3. FeatureCard component

**File**: `src/lib/components/FeatureCard.svelte`

- Props: `title`, `description`, `href`, `thumbnail?`
- Render a clickable/tappable card using `<a href={href}>`.
- Show thumbnail if provided; else show a simple placeholder (e.g., SVG shape or first-letter badge).
- Include accessible markup (role, aria-labels, focus states).

#### 4. Metadata contract for dynamic discovery

Each feature page must export a `metadata` object that provides essential information for the gallery. This metadata enables **dynamic discovery** — the gallery landing page automatically finds and displays all features without manual configuration.

**Why metadata?**

- Allows the gallery to render feature cards with titles, descriptions, and thumbnails
- Enables extensibility: adding a new feature requires only creating the page and exporting metadata
- Keeps the gallery up-to-date automatically as features are added/removed
- Provides a consistent interface for feature information

**Required export in each feature page:**

```ts
export const metadata = {
  title: 'Brownian Motion',
  description: 'Interactive particle simulation demonstrating Brownian motion.',
  thumbnail: '/path/to/thumbnail.png', // Optional: path to image asset
} as const;
```

**Field details:**

- `title` (required): Display name for the feature (used in card title and page `<title>`)
- `description` (required): Short description (1-2 sentences) explaining what the feature does
- `thumbnail` (optional): Path to a thumbnail image (e.g., screenshot or icon). If omitted, the `FeatureCard` shows a placeholder.

**How the gallery loader uses metadata:**

- Uses `import.meta.glob('./*/+page.svelte')` to find all feature pages under `src/routes/gallery/`
- For each discovered module, extracts the `metadata` export
- Derives the `slug` from the file path (e.g., `brownian-motion` from `./brownian-motion/+page.svelte`)
- Builds the `href` as `/gallery/${slug}`
- Passes the data to the gallery page for rendering

**Error handling:**

- If a feature page lacks the `metadata` export, log a warning and skip it (don't crash the gallery)
- If required fields (`title`, `description`) are missing, provide safe defaults or skip the feature
- Validate metadata at build time if possible (e.g., via TypeScript)

**Examples:**

- Brownian Motion: `{ title: 'Brownian Motion', description: 'Interactive particle simulation...', thumbnail: '/brownian-motion-preview.png' }`
- Pi Estimation: `{ title: 'π Estimation', description: 'Monte Carlo simulation for estimating π...', thumbnail: undefined }` (no thumbnail, uses placeholder)

### Success Criteria

#### Automated Verification

- [x] `bun check` passes
- [x] `bun lint` passes

#### Manual Verification

- [x] Visiting `/gallery` renders a grid of feature cards
- [x] Clicking a card navigates to its feature page
- [x] The page renders correctly when there are 0 feature modules (fallback message)

---

## Phase 2: Move Feature Routes + Add Metadata

### Overview

Rehome the current feature pages under `src/routes/gallery/` and add the required `metadata` exports so they appear in the gallery.

### Changes Required

#### 1. Move routes

**Files to move (rename path)**:

- `src/routes/brownian-motion/` → `src/routes/gallery/brownian-motion/`
- `src/routes/pi-estimation/` → `src/routes/gallery/pi-estimation/`
- `src/routes/cover-flow/` → `src/routes/gallery/cover-flow/`
- `src/routes/blob-morphing/` → `src/routes/gallery/blob-morphing/`

> _Note:_ Moving files may affect Vite caching and tests. Ensure paths are updated in imports (if any) and tests.

#### 2. Add metadata exports to each feature page

**Files**:

- `src/routes/gallery/brownian-motion/+page.svelte`
- `src/routes/gallery/pi-estimation/+page.svelte`
- `src/routes/gallery/cover-flow/+page.svelte`
- `src/routes/gallery/blob-morphing/+page.svelte`

**Changes**:

- Add `export const metadata = { ... } as const;` in the `<script>` block.
- Provide a short `description` and a `thumbnail` string. Use existing assets where possible (e.g., `/cover-flow/image_1.jpeg`).

#### 3. Update feature page internal imports (if needed)

- Since the route folder moved, ensure relative imports within each feature still resolve (likely they do if using `./` for local imports and `$lib` for shared imports).

### Success Criteria

#### Automated Verification

- [x] `bun check` passes (no TypeScript errors from moved files)
- [x] `bun lint` passes

#### Manual Verification

- [x] Each feature is accessible at `/gallery/<slug>` and behaves the same as before
- [x] Each feature appears in the `/gallery` landing page after navigation

---

## Phase 3: Update Navigation & Tests (and Add Legacy Redirects)

### Overview

Update site navigation to point at `/gallery` and refresh tests to match.

### Changes Required

#### 1. Update header navigation

**File**: `src/lib/components/layout/Header.svelte`

- Replace the hard-coded list of feature links with a shorter list:
  - Home (`/`)
  - Gallery (`/gallery`)
- Ensure active-route styling works for `/gallery` and its children (e.g., `page.route.id?.startsWith('/gallery')`).

#### 2. Update unit tests for Header

**File**: `src/lib/components/layout/Header.svelte.spec.ts`

- Assert that the header contains a "Gallery" link with `href='/gallery'`.
- Remove assertions that require individual feature links.

#### 3. Update E2E navigation test

**File**: `e2e/navigation.test.ts`

- Assert that the Header has a Gallery link.
- Navigate to `/gallery` and verify the gallery is displayed.
- Optionally, click a feature card and verify navigation works.

#### 4. Update individual e2e feature tests

**Files**:

- `e2e/brownian-motion.test.ts`
- `e2e/pi-estimation.test.ts`
- `e2e/cover-flow.test.ts`
- `e2e/blob-morphing.test.ts`

**Changes**:

- Update `page.goto('/<feature>')` to `page.goto('/gallery/<feature>')`.

### Success Criteria

#### Automated Verification

- [x] All unit tests pass: `bun test:unit -- --run` (or `bun test`)
- [x] All e2e tests pass: `bun test:e2e`
- [x] `bun check` passes
- [x] `bun lint` passes

#### Manual Verification

- [x] The header shows a “Gallery” link and highlights correctly when on `/gallery` and its child feature pages
- [x] The gallery landing page is usable & renders feature cards
- [x] Each feature works the same as before under `/gallery/<slug>`

---

## Testing Strategy

### Unit Tests

- Update the header unit test to assert the new `Gallery` link.
- Ensure the gallery page is rendered via a unit-style test (optional; could be integration + E2E.)

### Integration / E2E

- Update or add tests so that navigation to `/gallery` and feature detail pages is verified.
- Add a new E2E test that asserts the gallery landing page includes at least one card and that the card navigates correctly.

### Manual Testing Steps

1. Run the app locally: `bun dev`.
2. Visit `/gallery` as a new user, validate the grid and cards.
3. Click each card and ensure the demo runs as expected.

---

## References

- Related research: `thoughts/research/20260313-feature-gallery.md`
- Header implementation: `src/lib/components/layout/Header.svelte`
- Current feature pages:
  - `src/routes/brownian-motion/+page.svelte`
  - `src/routes/pi-estimation/+page.svelte`
  - `src/routes/cover-flow/+page.svelte`
  - `src/routes/blob-morphing/+page.svelte`
