// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: { typeCheck: true, strict: true },

  css: ['~/assets/styles/layout.scss', '~/assets/styles/misc.scss', '~/assets/styles/components.scss', '~/assets/styles/font.scss'],

  modules: ['@nuxtjs/google-fonts', 'nuxt-svgo'],
  googleFonts: {
    families: { Inter: [200, 400, 600, 800] },
  },

  app: {
    head: {
      title: 'Stream',
      link: [
        { rel: 'icon', href: '#' },
      ],
      meta: [
        { name: 'description', content: 'Stream Free Online' },
        // { name: 'keywords', content: '' },
        { name: 'author', content: 'F53' },
        { name: 'theme-color', content: '#d3869b' },
        // twitter stuff
        { property: 'og:title', content: 'Stream' },
        { property: 'og:description', content: 'Stream Free Online' },
        // { property: 'og:image', content: '' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:site', content: '@CodeF53' },
        { name: 'twitter:creator', content: '@CodeF53' },
      ],
    },
  },
})
