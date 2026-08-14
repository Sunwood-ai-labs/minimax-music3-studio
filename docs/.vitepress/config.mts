import { defineConfig } from 'vitepress'

const base = '/minimax-music3-studio/'
const repository = 'https://github.com/Sunwood-ai-labs/minimax-music3-studio'
const markPath = '/minimax-music3-studio-mark.svg'
const markUrl = `${base}minimax-music3-studio-mark.svg`
const screenshot = `${base}images/minimax-music3-studio-ui.png`

export default defineConfig({
  lang: 'en',
  title: 'MiniMax Music 3.0 Studio',
  description: 'Local-first music generation workspace for MiniMax Music 3.0 on ComfyUI.',

  base,
  lastUpdated: true,
  ignoreDeadLinks: [
    /localhost/,
    /\.\.\/\.\.\/README/,
    // Missing translations in inherited ACE-Step reference pages.
    /\.\/BENCHMARK/,
    // Links from the build-time awesome-ace-step reference page.
    /\.\/CONTRIBUTING/,
  ],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: markUrl }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: 'MiniMax Music 3.0 Studio' }],
    ['meta', { name: 'og:description', content: 'Local-first MiniMax Music 3.0 generation workspace for ComfyUI.' }],
    ['meta', { property: 'og:image', content: screenshot }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],

  locales: {
    en: {
      label: 'English',
      lang: 'en',
      link: '/en/',
      themeConfig: {
        nav: navEN(),
        sidebar: sidebarEN(),
      },
    },
    ja: {
      label: '日本語',
      lang: 'ja',
      link: '/ja/',
      themeConfig: {
        nav: navJA(),
        sidebar: sidebarJA(),
        outline: { label: 'ページナビ' },
        lastUpdated: { text: '最終更新' },
        docFooter: { prev: '前へ', next: '次へ' },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: {
        nav: navZH(),
        sidebar: sidebarZH(),
        outline: { label: '页面导航' },
        lastUpdated: { text: '最后更新于' },
        docFooter: { prev: '上一页', next: '下一页' },
      },
    },
    ko: {
      label: '한국어',
      lang: 'ko',
      link: '/ko/',
      themeConfig: {
        nav: navKO(),
        sidebar: sidebarKO(),
        outline: { label: '페이지 탐색' },
        lastUpdated: { text: '마지막 업데이트' },
        docFooter: { prev: '이전', next: '다음' },
      },
    },
  },

  themeConfig: {
    logo: markPath,
    nav: navEN(),
    sidebar: sidebarEN(),

    socialLinks: [
      { icon: 'github', link: repository },
    ],

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: `${repository}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },

    footer: {
      message: 'MiniMax Music 3.0 Studio is an unofficial community project.',
      copyright: 'Released under the MIT License where applicable.',
    },
  },
})

function navEN() {
  return [
    {
      text: 'MiniMax Studio',
      items: [
        { text: 'Overview', link: '/en/' },
        { text: 'Studio guide', link: '/en/MINIMAX_MUSIC3_STUDIO' },
      ],
    },
    {
      text: 'ACE-Step reference',
      items: [
        { text: 'Installation', link: '/en/INSTALL' },
        { text: 'Local API', link: '/en/API' },
        { text: 'MCP setup', link: '/en/MCP' },
        { text: 'GPU compatibility', link: '/en/GPU_COMPATIBILITY' },
      ],
    },
  ]
}

function sidebarEN() {
  return {
    '/en/': [
      {
        text: 'MiniMax Music 3.0 Studio',
        items: [
          { text: 'Overview', link: '/en/' },
          { text: 'Studio guide', link: '/en/MINIMAX_MUSIC3_STUDIO' },
        ],
      },
      {
        text: 'ACE-Step reference',
        items: [
          { text: 'Installation', link: '/en/INSTALL' },
          { text: 'Tutorial', link: '/en/Tutorial' },
          { text: 'Local API', link: '/en/API' },
          { text: 'Inference', link: '/en/INFERENCE' },
          { text: 'GPU compatibility', link: '/en/GPU_COMPATIBILITY' },
          { text: 'MCP setup', link: '/en/MCP' },
        ],
      },
    ],
  }
}

function navJA() {
  return [
    {
      text: 'MiniMax Studio',
      items: [
        { text: '概要', link: '/ja/' },
        { text: 'Studio ガイド', link: '/ja/MINIMAX_MUSIC3_STUDIO' },
      ],
    },
    {
      text: 'ACE-Step リファレンス',
      items: [
        { text: 'インストール', link: '/ja/INSTALL' },
        { text: 'ローカル API', link: '/ja/API' },
        { text: 'MCP セットアップ', link: '/ja/MCP' },
        { text: 'GPU 互換性', link: '/ja/GPU_COMPATIBILITY' },
      ],
    },
  ]
}

function sidebarJA() {
  return {
    '/ja/': [
      {
        text: 'MiniMax Music 3.0 Studio',
        items: [
          { text: '概要', link: '/ja/' },
          { text: 'Studio ガイド', link: '/ja/MINIMAX_MUSIC3_STUDIO' },
        ],
      },
      {
        text: 'ACE-Step リファレンス',
        items: [
          { text: 'インストール', link: '/ja/INSTALL' },
          { text: 'チュートリアル', link: '/ja/Tutorial' },
          { text: 'ローカル API', link: '/ja/API' },
          { text: '推論', link: '/ja/INFERENCE' },
          { text: 'GPU 互換性', link: '/ja/GPU_COMPATIBILITY' },
          { text: 'MCP セットアップ', link: '/ja/MCP' },
        ],
      },
    ],
  }
}

function navZH() {
  return [
    { text: 'MiniMax Studio', link: '/en/' },
    { text: 'ACE-Step 参考', link: '/zh/INSTALL' },
  ]
}

function sidebarZH() {
  return {
    '/zh/': [
      {
        text: 'ACE-Step 参考',
        items: [
          { text: '安装', link: '/zh/INSTALL' },
          { text: '教程', link: '/zh/Tutorial' },
          { text: '本地 API', link: '/zh/API' },
          { text: '推理', link: '/zh/INFERENCE' },
          { text: 'GPU 兼容性', link: '/zh/GPU_COMPATIBILITY' },
        ],
      },
    ],
  }
}

function navKO() {
  return [
    { text: 'MiniMax Studio', link: '/en/' },
    { text: 'ACE-Step 참고', link: '/ko/INSTALL' },
  ]
}

function sidebarKO() {
  return {
    '/ko/': [
      {
        text: 'ACE-Step 참고',
        items: [
          { text: '설치', link: '/ko/INSTALL' },
          { text: '튜토리얼', link: '/ko/Tutorial' },
          { text: '로컬 API', link: '/ko/API' },
          { text: '추론', link: '/ko/INFERENCE' },
          { text: 'GPU 호환성', link: '/ko/GPU_COMPATIBILITY' },
        ],
      },
    ],
  }
}
