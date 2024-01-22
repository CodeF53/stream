import { MovieDb } from 'moviedb-promise'

export const config: {
  tmdb: undefined | MovieDb
} = {
  tmdb: undefined,
}

export function initConfig() {
  const publicConfig = useRuntimeConfig().public

  config.tmdb = new MovieDb(publicConfig.tmdbKey)
}
