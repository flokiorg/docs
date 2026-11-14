# Lokiwiki (docs.flokicoin.org)

Lokiwiki is the Flokicoin Knowledge Source.

- Source for docs: `docs/`
- Custom theme/components: `src/`
- Static assets: `static/`

## Quick start

Prerequisites: Node.js LTS (v18+ recommended) with Corepack/Yarn enabled.

- Install dependencies: `yarn`
- Run locally: `yarn start`
  - Opens on http://localhost:3000 with hot reload.
- Build production: `yarn build`
  - Outputs to `build/` (static, can be hosted anywhere).

## Project layout

- `docs/` — Markdown/MDX pages. Each can include front matter for title, slug, sidebar position, etc.
- `src/components/` — Reusable React components (e.g., `EconomyNow.tsx`).
- `src/theme/` — Theme overrides for the docs framework. Footer wrapper also controls contributor display.
- `src/scss/custom.scss` — Global styles and homepage card interactions (mobile tap/reveal).
- `static/` — Files served at site root (favicons, downloads, etc.).
- `docusaurus.config.ts` — Site configuration, navbar/footer, plugins.
- `sidebars.js` — Sidebar structure.
- `makefile` — Container development and packaging helpers.

## Authoring docs

Front matter example:

```md
---
title: Wallet
description: How to set up, operate, and recover wallets
slug: /wallet
sidebar_position: 2
hide_title: true
hide_table_of_contents: true
hideContributors: true # default is hidden; set false to show
---

MDX content here…
```

Notes:
- Contributors are hidden by default. To show the GitHub contributors widget on a page, set `hideContributors: false` in that page’s front matter.
- Use MDX for richer pages (import components, images, and React where needed).
- Prefer short sections and task‑focused guides.

## LLM context files

We publish AI‑friendly, plain‑text snapshots of the docs under `static/downloads/`:

- `llms.txt` — streamlined Markdown‑style bundle of all pages.
- `llms-full.txt` — same content, provided for tools that expect a "full" variant.

These files are linked from the site and can be used to seed chatbots, embeddings/search, or offline readers.

To regenerate locally, run the helper (creates or updates both files):

```bash
node -e "console.log('Use the provided script task or your own export flow')"
```

If you prefer Python, see `scripts/build_llm_corpus.py` (generates `static/downloads/llms.txt`).

## Deployment

Static hosting options include GitHub Pages, Netlify, Vercel, or any static server.

- Build: `yarn build`
- Serve locally: `npx http-server ./build -p 3001`

GitHub Pages (example):

```bash
USE_SSH=true yarn deploy
# or
GIT_USER=<your_github_username> yarn deploy
```

## License

Content is available under [CC BY‑SA 4.0][cc-by-sa].

[![CC BY-SA 4.0][cc-by-sa-image]][cc-by-sa]

[cc-by-sa]: http://creativecommons.org/licenses/by-sa/4.0/
[cc-by-sa-image]: https://licensebuttons.net/l/by-sa/4.0/88x31.png
[cc-by-sa-shield]: https://img.shields.io/badge/License-CC%20BY--SA%204.0-lightgrey.svg
