// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['nuxt-lodash'],

  css: ['~/assets/styles/general.scss'],
  vite: { css: { preprocessorOptions: { scss: {
    additionalData: '@import "~/assets/styles/global.scss";',
  } } } },

  // Define which env vars to make accessible
  // https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables
  runtimeConfig: { public: {
    tmdbKey: '', // NUXT_PUBLIC_TMDB_KEY
  } },
})
