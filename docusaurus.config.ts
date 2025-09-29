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
  tagline: 'Guides for Lokichain, the Flokicoin economy, wallets, and mining ops',
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
      } satisfies Preset.Options,
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    {
      breadcrumbs: true,
      metadata: [
        { name: 'description', content: 'Lokiwiki is the living knowledge base for Lokichain, covering network operations, the Flokicoin economy, wallets, and mining.' },
        { name: 'keywords', content: 'Flokicoin,Lokichain,Loki wiki,Floki wallet,Floki mining,Floki documentation' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Lokiwiki' },
        { property: 'og:title', content: 'Lokiwiki – Flokicoin Knowledge Source' },
        { property: 'og:description', content: 'Guides for Lokichain operations, Flokicoin economics, wallets, mining, and community resources.' },
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
        respectPrefersColorScheme: true,
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
            type: 'dropdown',
            label: 'Knowledge',
            position: 'left',
            className: 'knowledge-dropdown__toggle',
            items: [
              {
                type: 'doc',
                docId: 'lokichain/index',
                label: 'Lokichain',
              },
              {
                type: 'doc',
                docId: 'economy/index',
                label: 'Economy',
              },
              {
                type: 'doc',
                docId: 'wallets/twallet/index',
                label: 'Wallets',
              },
              {
                type: 'doc',
                docId: 'mining/index',
                label: 'Mining',
              },
            ],
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
            docId: 'wallets/twallet/index',
            position: 'left',
            label: 'Wallets',
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
            docId: 'resources/index',
            position: 'left',
            label: 'Resources',
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
        ],
      },
      footer: {
        links: [
          {
            title: 'Wiki',
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
                label: 'Wallets',
                to: '/wallets/twallet',
              },
              {
                label: 'Mining',
                to: '/mining',
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
                label: 'Flokicoin.org',
                to: 'https://flokicoin.org',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'GitHub',
                to: 'https://github.com/flokiorg',
              },
            ],
          },
        ],
        copyright: `<span>Maintained with ❤️ by Lokichain community.</span>`,
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
    ...(googleAnalyticsId
      ? [
          [
            '@docusaurus/plugin-google-gtag',
            {
              trackingID: googleAnalyticsId,
              anonymizeIP: true,
            },
          ],
        ]
      : []),
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
