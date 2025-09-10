import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const defaultLocale = 'en';

// Use the deploy preview URL if in a PR
const baseUrl = (process.env.PULL_REQUEST === 'true')
  ? process.env.DEPLOY_PRIME_URL
  : "https://rotel.dev";

const config: Config = {
  title: 'Rotel',
  tagline: 'High Performance, Resource Efficient OpenTelemetry Collection',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: baseUrl,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  //organizationName: 'streamfold',
  //projectName: 'rotel',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    },
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/streamfold/rotel-docs/tree/main/',
        },
        blog: {
          blogTitle: 'Blog',
          blogDescription: 'Rotel Blog',
          blogSidebarCount: 0, // increase when we have multiple posts
          showReadingTime: false,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          //   'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          showLastUpdateTime: true,
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      './src/plugins/changelog/index.ts',
      {
        blogTitle: 'Rotel changelog',
        // Not useful, but permits to run git commands earlier
        // Otherwise the sitemap plugin will run them in postBuild()
        showLastUpdateAuthor: true, // showLastUpdate,
        showLastUpdateTime: true, // showLastUpdate,
        blogDescription:
            'Keep yourself up-to-date about new features in every release',
        blogSidebarCount: 'ALL',
        blogSidebarTitle: 'Changelog',
        routeBasePath: '/changelog',
        showReadingTime: false,
        postsPerPage: 20,
        archiveBasePath: null,
        authorsMapPath: 'authors.json',
        feedOptions: {
          type: 'all',
          title: 'Rotel Changelog',
          description:
              'Keep yourself up-to-date about new features in every release',
          copyright: `Copyright © ${new Date().getFullYear()} Streamfold, Inc.`,
          language: defaultLocale,
        },
        onInlineAuthors: 'ignore',
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    image: 'img/red-pepper.svg',
    navbar: {
      title: 'Rotel',
      logo: {
        alt: 'Rotel Logo',
        src: 'img/red-pepper.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {to: '/changelog', label: 'Changelog', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: '/about', label: 'About', position: 'right', className: 'navbar-about-link'},
        {
          href: 'https://github.com/streamfold/rotel',
          label: 'GitHub',
          position: 'right',
          className: 'navbar-github-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: '/docs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/reUqNWTSGC',
            },
            {
              label: 'X',
              href: 'https://x.com/streamfold',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Changelog',
              to: '/changelog',
            },
            {
              label: 'About',
              to: '/about',
            },
            {
              label: 'Blog',
              to: '/blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/streamfold/rotel',
            },
          ],
        },
      ],
      copyright: `Built with ❤ by <a href="https://streamfold.com">Streamfold</a>`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    announcementBar: {
      id: 'announce_blog_post',
      content: '📢 Check out our recent <a target="_blank" rel="noopener noreferrer" href="/blog/rotel-fast-and-efficient-opentelemetry-collection-in-rust">announcement</a> about Rotel on our blog. 🎉',
      backgroundColor: "#25c2a0",
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
