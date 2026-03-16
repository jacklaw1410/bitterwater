# Storybook Cleanup and Refinement Implementation Plan

## Overview

This document outlines the plan to clean up the existing Storybook implementation, remove unused demo components, and integrate Storybook with our actual application components. The goal is to make Storybook a useful tool for developing and documenting our component library.

## Current State Analysis

- The `src/stories` directory contains demo components and stories that are not used in the application.
- Application components in `src/lib/components` are not represented in Storybook.
- There is an outdated sample unit test file `src/demo.spec.ts`.
- There is no documentation on how to create new stories for components.

## Desired End State

- The `src/stories` directory is removed.
- `src/demo.spec.ts` is removed.
- `FeatureCard.svelte` and `Header.svelte` have comprehensive Storybook stories located alongside the component files.
- A new document exists at `.github/docs/component-testing.md` outlining how to write stories.

### Key Discoveries:

- Unused components were confirmed by a codebase analysis.
- The main application component directory is `src/lib/components`.

## What We're NOT Doing

- This plan does not cover adding stories for every single component in `src/lib/components`. We will start with `FeatureCard.svelte` and `Header.svelte` as a template for future work.
- This plan does not involve changing the Storybook configuration files beyond what's necessary for cleanup.

## Implementation Approach

The plan will be executed in three phases:

1.  **Cleanup**: Remove all obsolete files.
2.  **Story Creation**: Add new stories for existing application components.
3.  **Documentation**: Add a guide for creating stories.

---

## Phase 1: Cleanup

### Overview

This phase removes all the identified demo and sample files from the repository.

### Changes Required:

#### 1. Delete `src/stories` directory

**Action**: Remove the entire `src/stories` directory.
**Command**: `rm -rf src/stories`

#### 2. Delete `src/demo.spec.ts`

**Action**: Remove the sample test file.
**Command**: `rm src/demo.spec.ts`

### Success Criteria:

#### Automated Verification:

- [x] `src/stories` directory no longer exists.
- [x] `src/demo.spec.ts` file no longer exists.
- [x] All existing tests pass: `bun test:unit --run` and `bun test:e2e`
- [x] Type checking passes: `bun run check`
- [x] Linting passes: `bun run lint`

#### Manual Verification:

- [x] Verify that the application still builds and runs correctly.
- [x] Verify Storybook still runs, but without the old stories.

---

## Phase 2: Create New Stories

### Overview

This phase adds comprehensive Storybook stories for the `FeatureCard` and `Header` components.

### Changes Required:

#### 1. `FeatureCard.svelte` Story

**File**: `src/lib/components/FeatureCard.stories.svelte`
**Changes**: Create a new story file for the `FeatureCard` component.

```svelte
<script lang="ts">
  import type { Meta, StoryObj } from '@storybook/svelte';
  import FeatureCard from './FeatureCard.svelte';

  const meta: Meta<FeatureCard> = {
    title: 'Components/FeatureCard',
    component: FeatureCard,
    tags: ['autodocs'],
    argTypes: {
      title: { control: 'text' },
      description: { control: 'text' },
      link: { control: 'text' },
    },
  };

  export default meta;
  type Story = StoryObj<FeatureCard>;

  export const Default: Story = {
    args: {
      title: 'Sample Feature',
      description: 'This is a description of the sample feature.',
      link: '/gallery/sample',
    },
  };

  export const LongText: Story = {
    args: {
      title: 'Feature with a Much Longer Title to Test Text Wrapping and Layout',
      description:
        'This is a much longer and more detailed description for the feature card. It is intended to test how the component handles larger amounts of text and to see if the layout breaks or if the text wraps correctly within the given constraints of the card design.',
      link: '/gallery/long-text',
    },
  };

  export const NoLink: Story = {
    args: {
      title: 'Feature Without a Link',
      description:
        'This feature card does not have a link. The entire card should not be interactive in the same way a linked card is.',
      link: undefined,
    },
  };
</script>

<storybook-meta />
```

#### 2. `Header.svelte` Story

**File**: `src/lib/components/layout/Header.stories.svelte`
**Changes**: Create a new story file for the `Header` component.

```svelte
<script lang="ts">
  import type { Meta, StoryObj } from '@storybook/svelte';
  import Header from './Header.svelte';

  const meta: Meta<Header> = {
    title: 'Layout/Header',
    component: Header,
    tags: ['autodocs'],
    argTypes: {},
  };

  export default meta;
  type Story = StoryObj<Header>;

  export const Default: Story = {
    args: {},
  };
</script>

<storybook-meta />
```

### Success Criteria:

#### Automated Verification:

- [x] New story files exist: `src/lib/components/FeatureCard.stories.svelte` and `src/lib/components/layout/Header.stories.svelte`.
- [x] Storybook builds successfully: `bun run build-storybook`

#### Manual Verification:

- [x] Open Storybook and verify that the `FeatureCard` and `Header` components are present.
- [x] Interact with the controls for each story to see the component update.
- [x] Verify all states of the components look correct.

---

## Phase 3: Documentation

### Overview

This phase adds a new guide to our documentation explaining how to create Storybook stories for components.

### Changes Required:

#### 1. Create `component-testing.md`

**File**: `.github/docs/component-testing.md`
**Changes**: Create a new documentation file.

```markdown
# Component Story Guidelines

This document provides guidelines for creating Storybook stories for Svelte components in this project.

## Why We Use Storybook

Storybook allows us to develop and test components in isolation. This helps us build more robust, reusable components and provides a living documentation of our component library.

## File Naming and Location

- Story files should have the suffix `.stories.svelte`.
- Stories should be located in the same directory as the component they are for.

For example, the story for `src/lib/components/FeatureCard.svelte` should be at `src/lib/components/FeatureCard.stories.svelte`.

## Story Structure

A typical story file should have the following structure:

\`\`\`svelte

<script lang="ts">
	import type { Meta, StoryObj } from '@storybook/svelte';
	import MyComponent from './MyComponent.svelte';

	// 1. Meta configuration for the component
	const meta: Meta<MyComponent> = {
		title: 'Category/MyComponent', // How it appears in the Storybook sidebar
		component: MyComponent,
		tags: ['autodocs'], // Enables automatic documentation generation
		argTypes: {
			// Define controls for your component's props
			propName: { control: 'select', options: ['option1', 'option2'] },
		}
	};

	export default meta;
	type Story = StoryObj<MyComponent>;

	// 2. Define individual stories
	export const DefaultState: Story = {
		args: {
			// Props for this story
			propName: 'option1',
		}
	};

    export const AnotherState: Story = {
        args: {
            propName: 'option2',
        }
    };
</script>

<!-- 3. Render the component for Storybook -->
<storybook-meta />
\`\`\`

## Best Practices

- **Be Comprehensive**: Create stories for all the important states of your component. Think about edge cases, long text, missing props, etc.
- **Use Controls**: Use `argTypes` to make your component props editable in the Storybook UI. This makes it easier to test different variations.
- **Add Documentation**: Use comments in your code and the `docs` tag to provide context for your stories.

By following these guidelines, we can maintain a clean, useful, and up-to-date component library.
```

### Success Criteria:

#### Automated Verification:

- [ ] The file `.github/docs/component-testing.md` exists.

#### Manual Verification:

- [ ] Review the content of the new documentation for clarity and correctness.

---

## References

- Related research: `thoughts/research/20260315-storybook-cleanup.md`
