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
  // This is very wrong because
  // 1. incorrectly includes: backdrop_path, original_language, overview, poster_path, genre_ids, vote_average, vote_count
  // 2. doesn't include: name, original_name, gender, known_for_department, profile_path, known_for
  // Doesn't matter because it's only used for removing people from search results
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
