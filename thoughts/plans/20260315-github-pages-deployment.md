# GitHub Pages Deployment Implementation Plan

## Overview

This plan details the steps required to configure the `svelte101` project for automated deployment to GitHub Pages. The goal is to set up a CI/CD pipeline using GitHub Actions that builds the SvelteKit application as a static site and deploys it. The target GitHub Pages site is `bitterwater`.

## Current State Analysis

- The project is named `svelte101` in `package.json`.
- It uses `@sveltejs/adapter-auto` for building, which is not suitable for a static site deployment on GitHub Pages.
- There is no existing CI/CD workflow for deployment.
- There is no `.nojekyll` file in the `static` directory.

## Desired End State

- The project will be configured to build a static site using `@sveltejs/adapter-static`.
- A GitHub Actions workflow will be in place at `.github/workflows/deploy.yml` to automatically build and deploy the site on every push to the `main` branch.
- The repository name and project configuration will be updated to reflect the target site `bitterwater`.
- The GitHub repository settings will be configured to serve the site from the `gh-pages` branch.

### Key Discoveries:

- `package.json`: Confirms project name is `svelte101` and dependency is `@sveltejs/adapter-auto`.
- `svelte.config.js`: Confirms usage of `adapter-auto`.
- The codebase is free of server-only features, making it suitable for static site generation.

## What We're NOT Doing

- This plan does not cover purchasing or configuring a custom domain name.
- This plan does not involve changing the repository name on GitHub directly; it assumes the user will do this.

## Implementation Approach

The implementation will be done in two phases. First, we will update the project's configuration and dependencies. Second, we will create the CI/CD workflow for automated deployment.

---

## Phase 1: Project Configuration

### Overview

This phase focuses on updating the SvelteKit project configuration to generate a static site compatible with GitHub Pages.

### Changes Required:

#### 1. Update Project Name in `package.json`

**File**: `package.json`
**Changes**: Modify the `name` property.

```json
{
  "name": "bitterwater",
  "private": true,
  "version": "0.0.1",
  "type": "module"
  /* ... */
}
```

#### 2. Update SvelteKit Adapter

**File**: `package.json`, `svelte.config.js`
**Changes**: Uninstall `@sveltejs/adapter-auto` and install `@sveltejs/adapter-static`, then update the SvelteKit configuration file to use the new adapter.

**Commands to run**:

1. `bun remove @sveltejs/adapter-auto`
2. `bun add -D @sveltejs/adapter-static`

**`svelte.config.js` changes**:

```javascript
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
```

#### 3. Create `.nojekyll` file

**File**: `static/.nojekyll`
**Changes**: Create an empty file to prevent GitHub Pages from running the build output through Jekyll.

### Success Criteria:

#### Automated Verification:

- [x] `package.json` contains `"name": "bitterwater"`.
- [x] `@sveltejs/adapter-static` is listed as a dev dependency in `package.json`.
- [x] `@sveltejs/adapter-auto` is removed from `package.json`.
- [x] `svelte.config.js` imports and uses `@sveltejs/adapter-static`.
- [x] The command `bun run build` completes successfully and generates files in the `build/` directory.

#### Manual Verification:

- [x] The local preview (`bun preview`) of the build output works correctly.

---

## Phase 2: CI/CD Workflow for Deployment

### Overview

This phase involves creating a GitHub Actions workflow to automate the build and deployment process.

### Changes Required:

#### 1. Create GitHub Actions Workflow File

**File**: `.github/workflows/deploy.yml`
**Changes**: Create a new workflow file with steps to check out the code, set up Node.js, install dependencies, build the site, and deploy to the `gh-pages` branch.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: bun install
      - name: Build
        run: bun run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './build'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Success Criteria:

#### Automated Verification:

- [x] The file `.github/workflows/deploy.yml` exists and contains the correct workflow configuration.
- [ ] After pushing to `main`, the "Deploy to GitHub Pages" action triggers and runs successfully on GitHub.
- [ ] A `gh-pages` branch is created in the repository with the build artifacts.

#### Manual Verification:

- [ ] The user configures the GitHub repository settings to deploy from the `gh-pages` branch.
- [ ] The website is successfully deployed and accessible at `https://jacklaw1410.github.io/bitterwater`.

## References

- Related research: `thoughts/research/20260315-github-pages-deployment.md`
- [SvelteKit Official Documentation - `adapter-static`](https://kit.svelte.dev/docs/adapter-static)
