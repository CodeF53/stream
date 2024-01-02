export enum ContentTypes {
  MOVIE = 'movie',
  TV = 'tv',
  PERSON = 'person',
}

export interface SearchResultBase {
  adult: boolean
  id: number
  popularity: number
  backdrop_path: string
  original_language: string
  overview: string
  poster_path: string
  genre_ids: number[]
  vote_average: number
  vote_count: number
}

export interface SearchResultPerson extends SearchResultBase {
  media_type: ContentTypes.PERSON
  // ...
}

export interface SearchResultShow extends SearchResultBase {
  name: string
  original_name: string
  media_type: ContentTypes.TV
  first_air_date: string
  origin_country: string[]
}

export interface SearchResultMovie extends SearchResultBase {
  title: string
  original_title: string
  media_type: ContentTypes.MOVIE
  release_date: string
  video: boolean
}

export type SearchResult = (SearchResultShow | SearchResultMovie | SearchResultPerson)

export interface SearchResults {
  page: number
  results: SearchResult[]
  total_pages: number
  total_results: number
}

export interface SeasonShort {
  id: number
  name: string
  season_number: number
  // ...
}

export interface TVInfo {
  seasons: SeasonShort[]
  // ...
}

export interface EpisodeShort {
  id: number
  name: string
  episode_number: number
  // ...
}

export interface SeasonInfo {
  episodes: EpisodeShort[]
  // missing a lot, I don't care, I won't ever use it
}
