// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion
// Import Types
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import type {Options as DocsOptions} from '@docusaurus/plugin-content-docs';
import type {Options as PageOptions} from '@docusaurus/plugin-content-pages';
// Setup our Prism themes.
import { themes } from 'prism-react-renderer';
const lightCodeTheme = themes.vsLight;
const darkCodeTheme = themes.vsDark;
// Define our admonitions config.
const admonitionsConfig = {
  admonitions: {
    keywords: [
      'discord',
      'info',
      'success',
      'danger',
      'note',
      'feature',
      'tip',
      'warning',
      'important',
      'caution',
      'powershell',
      'security',
      'ninja',
      'release',
      'credit'
    ],
  },
}
// Import our remark plugins.
import npm2yarn from '@docusaurus/remark-plugin-npm2yarn';
import tabBlocks from 'docusaurus-remark-plugin-tab-blocks';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkDefList from 'remark-deflist';

// Setup our common remark plugin config.
const remarkPluginsConfig = {
  remarkPlugins: [
    [ npm2yarn, { sync: true } ],
    tabBlocks,
    remarkMath,
    rehypeKatex,
    remarkDefList,
  ]
}
// Setup our common config options for docs plugin instances.
const commonDocsPluginConfig = {
  showLastUpdateAuthor: false,
  showLastUpdateTime: false,
  sidebarCollapsible: true,
  sidebarCollapsed: true,
  ...admonitionsConfig,
  ...remarkPluginsConfig,
}

const googleAnalyticsId = process.env.GOOGLE_ANALYTICS_ID ?? 'G-1TW1G5P62E';

/** @type {import('@docusaurus/types').Config} */
const config: Config = {
  title: 'Lokiwiki - Flokicoin Knowledge Source',
  tagline: 'Technical guides for Flokicoin, Lokichain, and the Lokihub ecosystem.',
  favicon: 'favicon.ico',
  url: 'https://docs.flokicoin.org',
  baseUrl: '/',
  organizationName: 'homotechsual', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  onBrokenLinks: 'warn',
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/flokiorg/docs/edit/main/',
          ...commonDocsPluginConfig,
        } satisfies DocsOptions,
        blog: false,
        pages: {
          ...admonitionsConfig,
          ...remarkPluginsConfig
        } satisfies PageOptions,
        theme: {
          // Ensure SCSS path is resolved and loaded by the preset
          customCss: require.resolve('./src/scss/custom.scss'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.7,
          filename: 'sitemap.xml',
          ignorePatterns: ['/tags/**'],
        },
        ...(googleAnalyticsId && {
          gtag: {
            trackingID: googleAnalyticsId,
            anonymizeIP: true,
          },
        }),
      } satisfies Preset.Options,
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      breadcrumbs: true,
      metadata: [
        { name: 'description', content: 'Explore the Lokiwiki: the official guide for Flokicoin, Lokihub node management, and decentralized mining.' },
        { name: 'keywords', content: 'Flokicoin, Lokihub, tWallet, crypto wallet, scrypt mining, blockchain guide' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Lokiwiki' },
        { property: 'og:title', content: 'Lokiwiki - Flokicoin & Lokihub Guide' },
        { property: 'og:description', content: 'Simple and technical guides for setting up your Flokicoin wallet, managing your node with Lokihub, and securing the network through mining.' },
        { property: 'og:url', content: 'https://docs.flokicoin.org' },
        { property: 'og:image', content: 'https://docs.flokicoin.org/og-image.png' },
        { property: 'og:image:alt', content: 'Lokiwiki social card featuring the Flokicoin community.' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Lokiwiki – Flokicoin Knowledge Source' },
        { name: 'twitter:description', content: 'Guides for Lokichain operations, Flokicoin economics, wallets, mining, and community resources.' },
        { name: 'twitter:image', content: 'https://docs.flokicoin.org/og-image.png' },
        { name: 'twitter:image:alt', content: 'Lokiwiki social card featuring the Flokicoin community.' }
      ],
      image: 'og-image.png',
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: false,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'Lokiwiki',
        logo: {
          alt: 'Flokicoin Logo',
          src: 'logo.svg',
        },
        hideOnScroll: false,
        items: [
          {
            type: 'doc',
            docId: 'wallets/index',
            position: 'left',
            label: 'Wallets',
            className: 'navbar__link--doc-section',
          },
          {
            type: 'doc',
            docId: 'lokichain/index',
            position: 'left',
            label: 'Lokichain',
            className: 'navbar__link--doc-section',
          },
          {
            type: 'doc',
            docId: 'economy/index',
            position: 'left',
            label: 'Economy',
            className: 'navbar__link--doc-section',
          },
          {
            type: 'doc',
            docId: 'mining/index',
            position: 'left',
            label: 'Mining',
            className: 'navbar__link--doc-section',
          },
          {
            type: 'doc',
            docId: 'lokihub/index',
            position: 'left',
            label: 'Lokihub',
            className: 'navbar__link--resources',
          },
          {
            type: 'doc',
            docId: 'wof/index',
            position: 'left',
            label: 'Web of Fun',
            className: 'navbar__link--wof',
          },
          {
            to: 'https://flokicoin.org/donate',
            label: 'Donate',
            position: 'right',
            target: '_blank',
            className: 'sponsorship-link no-external-icon',
          },
          {
            to: 'https://flokicoin.org/discord',
            position: 'right',
            target: '_blank',
            className: 'discord-link no-external-icon',
          },
          {
            to: 'https://github.com/flokiorg',
            position: 'right',
            target: '_blank',
            className: 'github-link no-external-icon',
          },
          {
            to: 'https://njump.me/nprofile1qqsvj806upqwfsqaza7lar7c2dmj2ey3f8r8p93kags5zvvl3cet3ygnn7h5f',
            position: 'right',
            target: '_blank',
            className: 'nostr-link no-external-icon',
          },
        ],
      },
      footer: {
        links: [
          {
            items: [
              {
                html: `
                  <div class="footer-brand">
                    <div class="footer-brand__container">
                      <img src="/img/loki.svg" alt="Flokicoin Logo" class="footer-brand__logo" />
                      <span class="footer-brand__title">Lokiwiki</span>
                    </div>
                    <p class="footer-brand__desc">
                      Maintained with <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -2px; margin: 0 2px; color: #e9669e;"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg> by the Flokicoin Community.
                    </p>
                  </div>
                `,
              }
            ],
          },
          {
            title: 'Setup',
            items: [
              {
                label: 'Get a Wallet',
                to: '/wallets',
              },
              {
                label: 'Run a Node',
                to: '/lokihub/setup',
              },
              {
                label: 'Start Mining',
                to: '/mining',
              },
            ],
          },
          {
            title: 'Ecosystem',
            items: [
              {
                label: 'Lokichain',
                to: '/lokichain',
              },
              {
                label: 'Economy',
                to: '/economy',
              },
              {
                label: 'Web of Fun',
                to: '/wof',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Discord',
                to: 'https://flokicoin.org/discord',
              },
              {
                label: 'Nostr',
                to: 'https://njump.me/nprofile1qqsvj806upqwfsqaza7lar7c2dmj2ey3f8r8p93kags5zvvl3cet3ygnn7h5f',
              },
              {
                label: 'Donate',
                to: 'https://flokicoin.org/donate',
              },
            ],
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['powershell', 'bash', 'docker', 'diff', 'json', 'sass'],
      },
    } satisfies Preset.ThemeConfig,
  plugins: [

    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: true,
        generateLLMsFullTxt: true,
        pathTransformation: {
          ignorePaths: ['docs'],
        }
      },
    ],
    [
      '@docusaurus/plugin-ideal-image',
      /** @type {import('@docusaurus/plugin-ideal-image').Options} */
      {
        quality: 100,
        max: 1030, // max resized image's size.
        min: 640, // min resized image's size. if original is lower, use that size.
        steps: 2, // the max number of images generated between min and max (inclusive)
      },
    ],
    'docusaurus-plugin-sass',
  ],
  themes: [
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      ({
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        docsRouteBasePath: ["/"],
        hashed: true,
        docsDir: ["docs"],
        highlightSearchTermsOnTargetPage: true,
      }),
    ],
  ],
  webpack: {
    jsLoader: (isServer: boolean) => ({
      loader: 'swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            }
          },
          target: 'es2017',
        },
        module: {
          type: isServer ? 'commonjs' : 'es6',
        },
      },
    }),
  },
  markdown: {
    format: 'detect',
    mermaid: true,
    mdx1Compat: {
      comments: false,
      headingIds: false,
      admonitions: false,
    },
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
};
export default config;
