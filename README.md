# WaveFlux Website

The marketing and download site for WaveFlux, built with [Astro](https://astro.build), Tailwind CSS, and TypeScript. Deployed to GitHub Pages.

## Stack

- **Astro 5** — static site generation
- **Tailwind CSS 3** — utility-first styling with a custom design token theme
- **TypeScript** — type-checked components and i18n
- **`@astrojs/sitemap`** — auto-generated sitemap
- **Prettier + ESLint** — formatting and linting

## Structure

```
src/
  components/
    brand/      Logo, wordmark, waveform motif, platform icons
    layout/     Header, footer, container, section heading
    pages/      Top-level page compositions
    sections/   Hero, features, showcase, downloads, trust sections
    ui/         Badge, button, card, code block
  content/
    release.ts              Release data types and loader
    release.json            Current release data (generated)
    release.fallback.json   Fallback release data for offline builds
    site.ts                 Site-wide constants, navigation, feature/download lists
  i18n/
    en.json     English strings
    ru.json     Russian strings
    index.ts    i18n helpers
  layouts/
    BaseLayout.astro
  pages/
    index.astro       English landing page
    ru/index.astro    Russian landing page
    robots.txt.ts     robots.txt endpoint
  styleguide/
    StyleguidePage.astro   Dev-only styleguide at /styleguide
  styles/
    global.css
scripts/
  generate-release-data.mjs   Fetch latest release from GitHub API → release.json
  check-release-data.mjs      Validate release.json before build
  check-i18n.mjs              Check for missing or extra keys between locales
public/
  favicon.svg
```

## Getting Started

Requires Node.js 22+.

```bash
npm install
```

## Development

```bash
npm run dev
```

Opens the dev server at `http://localhost:4321`. The `/styleguide` route is available in dev mode only.

## Build

```bash
npm run build
```

This runs `release:generate` first to fetch the latest release from GitHub, then produces a static build in `dist/`.

To skip the GitHub fetch (e.g., offline or CI without a token):

```bash
npm run astro:build
```

The build falls back to `src/content/release.fallback.json` if `release.json` is missing or stale.

Preview the production build locally:

```bash
npm run preview
```

## Release Data

The downloads section is driven by live release data fetched from the GitHub API:

```bash
npm run release:generate   # fetch → src/content/release.json
npm run release:check      # validate release.json
```

## i18n

The site ships in English (`/`) and Russian (`/ru/`). String files live in `src/i18n/`. To check for key mismatches between locales:

```bash
npm run i18n:check
```

## Quality Checks

```bash
npm run lint           # ESLint
npm run format:check   # Prettier
npm run astro:check    # Astro type check
npm run lhci:check     # Lighthouse CI (performance ≥ 0.9, a11y ≥ 0.9, SEO ≥ 0.9)
```

Lighthouse CI requires a running preview server; `lhci:check` starts one automatically.

## Deployment

The site deploys to GitHub Pages via CI. The Astro config reads `GITHUB_REPOSITORY` and `GITHUB_REPOSITORY_OWNER` to set the correct `site` and `base` path. A custom domain can be set via `PUBLIC_SITE_URL`.

| Variable | Effect |
|----------|--------|
| `GITHUB_REPOSITORY` | Sets repo name for base path (e.g. `leocallidus/waveflux`) |
| `GITHUB_REPOSITORY_OWNER` | Sets owner for default site URL |
| `PUBLIC_SITE_URL` | Override site URL (e.g. for a custom domain) |
| `GITHUB_TOKEN` | Used by `release:generate` to avoid API rate limits |
