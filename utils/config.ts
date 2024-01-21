import type { PublicRuntimeConfig } from 'nuxt/schema'

export const config: PublicRuntimeConfig = {
  tmdbKey: '',
}

export function initConfig() {
  const publicConfig = useRuntimeConfig().public
  for (const key in publicConfig)
    config[key] = publicConfig[key]
}
