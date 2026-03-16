---
date: 2026-03-15T12:00:00Z
git_commit: 92814bf177808d7bb2266e5a1e93382ce621fa94
branch: main
topic: 'Storybook Cleanup'
tags: [research, codebase, storybook, components]
status: complete
last_updated: 2026-03-15
last_updated_by: 'GitHub Copilot'
---

# Research: Storybook Cleanup

**Date**: 2026-03-15T12:00:00Z
**Researcher**: GitHub Copilot
**Git Commit**: 92814bf177808d7bb2266e5a1e93382ce621fa94
**Branch**: main
**Repository**: bitterwater

## Research Question

I'd like to clean up the storybook usage, primarily to (a) remove unused components and (b) add stories for components under `src/lib/components`.

## Summary

This research analyzes the current state of Storybook integration in the codebase. The findings indicate that all existing stories are for components located within the `src/stories` directory, which appear to be example or demo components. There are components in the main application's component library at `src/lib/components` that are currently not covered by any Storybook stories. There is also a name collision between a component in `src/stories` and one in `src/lib/components/layout`.

## Detailed Findings

### Existing Stories and Components

The `src/stories` directory contains both Storybook stories and the Svelte components they test. These components do not seem to be used by the main application.

- **Stories Found**:
  - `src/stories/Button.stories.svelte`
  - `src/stories/Header.stories.svelte`
  - `src/stories/Page.stories.svelte`

- **Corresponding Components (in `src/stories`)**:
  - `src/stories/Button.svelte` (used by `Button.stories.svelte`)
  - `src/stories/Header.svelte` (used by `Header.stories.svelte`)
  - `src/stories/Page.svelte` (used by `Page.stories.svelte`)

### Components Missing Stories

The components located in `src/lib/components` are not referenced by any existing Storybook stories.

- `src/lib/components/FeatureCard.svelte`
- `src/lib/components/layout/Header.svelte`

### Component Name Collision

There are two components named `Header.svelte`:

1.  `src/stories/Header.svelte`: Used for Storybook demos.
2.  `src/lib/components/layout/Header.svelte`: Likely the application's main header component.

The existing story at `src/stories/Header.stories.svelte` is for the component inside `src/stories`, not the one from `src/lib/components/layout`.

## Code References

- `src/stories/`: Contains all current stories and their associated components.
- `src/lib/components/`: Contains application components that are missing stories.

## Architecture Documentation

The current Storybook setup is self-contained within the `src/stories` directory. It is not integrated with the application's component library in `src/lib/components`. To improve Storybook's utility as a component development and documentation tool, stories should be created for the components in `src/lib/components`.
