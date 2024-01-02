import type { ContentTypes } from './tmdb'

export interface SearchResultData {
  tmdbId: number
  type: ContentTypes.MOVIE | ContentTypes.TV
  poster: string
  title: string
  stars: number
}
