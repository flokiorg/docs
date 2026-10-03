# Changelog

This site is continuously deployed: Cloudflare publishes docs.flokicoin.org on
every push to `main`. There are no versions or tags to hang headings off, so
entries are grouped by month, newest first, rather than by release.

## [2026-10]

### Added

- This changelog.

## [2026-09]

### Changed

- Lokinode references bumped to v0.1.6. (#2)

## [2026-07]

### Changed

- Release references brought up to date across Lokichain, flnd, tWallet v1,
  Lokinode, Gminer and Lokihub. (#1)

### Added

- Release notes for flnd v0.2.0-beta and go-flokicoin v0.26.0-alpha.

## [2026-06]

### Added

- **AskAI**: a custom navbar item and modal that replaced the local search box,
  including fallback instructions pointing at the community when it cannot
  answer.

### Changed

- Lokihub guides now recommend Lokinode over tWallet, with the change carried
  through every translation.
- Wallet sidebars reordered, a Lokinode screenshot added, and the Tap Wallet
  layout adjusted.
- hash2.cash added to the mining pools list.
- Lokihub index title and description rewritten, translated to all locales.
- Build scripts migrated from `make` to `just`, with dependencies locked.
- Lokihub references moved to 0.3.0-alpha and Lokinode to v0.1.4.

## [2026-05]

### Changed

- Lokinode documentation updated to v0.1.1 and then v0.1.2 across English,
  Arabic, Chinese, Spanish, Farsi and French.
- Lokinode download links corrected -- the architecture filenames were wrong,
  and the Windows link pointed at the wrong archive type.
- Lokihub setup and Lokinode operator guides updated, Tap Wallet layout synced
  across translations.
- tWallet release notes and index updated to 1.0.12-beta in all locales.

### Fixed

- Broken image paths in translations, which were failing the build.

## [2026-04]

### Added

- **Tap Wallet** documentation, including pages for the French, Spanish,
  Chinese, Farsi and Arabic locales, plus a reworked wallets overview.
- Telegram added to the navbar social icons and the footer community links.

### Changed

- flnd instructions overhauled and the global hero buttons refined.
- Tap Wallet translations synced and brought in line with the design standards,
  with the sidebar order finalised.
- "instant" replaced with "on-chain" for technical accuracy, with a selective
  rollback where the original wording was correct.
- Horizontal separators removed to match the Lokiwiki design chart.
- Tap Days section enriched with FAQ context.

## [2026-03]

### Added

- Unified wallets landing page, with expanded v1/v0 lifecycle guides.
- Shared design tokens and wallet UI components.
- Lokichain building now links through to Lokihub app-store deployment.

### Changed

- Information architecture overhauled for the mining and Web of Fun sections,
  and the economy section finalised.
- Lokihub setup guide and index rewritten -- active voice, reframed security
  labels, benefit-driven headline and SEO metadata.
- Hero buttons modernised with a full-width mobile layout.
- flnd data folder hierarchy corrected, with explicit channel-backup warnings
  added.

### Fixed

- MDX parsing errors from HTML anchors, and frontmatter YAML syntax in the
  Lokihub pages.
- Lokihub images not rendering, because the imported image was used directly
  instead of its `.src`.
- The new-tab shortcut now works cross-platform.

## [2026-01]

### Added

- Release notes for tWallet v1.0.9-beta and go-flokicoin v0.25.12-alpha.

### Changed

- Sharenote content updated in the Web of Fun section.

## [2025-12]

### Added

- tWallet v1.0.8-beta documentation and configs, then v1.0.8-beta.2 hotfix
  notes, with all download links updated.

### Changed

- Pools and community apps refreshed.
- Lokichain 0.25.10 surfaced, 0.25.1 clarified as a pre-release, and the
  release header layout tweaked.

## [2025-10]

### Added

- tWallet Electrum v0 setup guide, with responsive install buttons.
- Esplora API documentation link in the wallet section.

### Changed

- Mining and pools section improved, sections reordered, halving table dates
  refreshed.
- Discord tip about public Electrum instances clarified.

### Fixed

- Release URLs, the warning and disclaimer boxes, and the Electrum box.

## [2025-09]

### Added

- Initial site.
