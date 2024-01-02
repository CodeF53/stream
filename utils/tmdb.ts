import type { SearchResultData } from '~/@types/search'
import * as TMDB from '~/@types/tmdb'

const headers: Record<string, string> = {
  accept: 'application/json',
}

async function get<T>(url: string, params: Record<string, string | number | boolean> = {}): Promise<T> {
  const paramStr = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&')
  const resp = await fetch(`https://api.themoviedb.org/3/${url}?${paramStr}`, { headers })
  return await resp.json()
}

function isGoodSearchResult(result: TMDB.SearchResult): boolean {
  switch (result.media_type) {
    case TMDB.ContentTypes.TV:
      if (!result.name) return false // must have a name
      break
    case TMDB.ContentTypes.MOVIE:
      if (!result.title) return false // must have a title
      break
    default:
      return false // must be a Movie or Series
  }
  // must have a poster
  if (!result.poster_path)
    return false

  return true
}

function cleanSearchResult(result: TMDB.SearchResult): SearchResultData {
  if (result.media_type === TMDB.ContentTypes.PERSON)
    throw new Error('only feed good results into cleanSearchResult')

  const isMovie = result.media_type === TMDB.ContentTypes.MOVIE

  const out = {
    tmdbId: result.id,
    type: result.media_type,
    poster: result.poster_path,
    title: isMovie ? result.title : result.name,
    stars: result.vote_average / 2,
  }

  return out
}

export async function searchTMDB(query: string): Promise<SearchResultData[]> {
  // set auth header on first search
  if (headers.Authorization === undefined) {
    if (config.tmdbKey !== undefined)
      headers.Authorization = `Bearer ${config.tmdbKey}`
    else
      throw new Error('No TMDB API key provided, set environment variable NUXT_PUBLIC_TMDB_KEY')
  }
  // give nothing for empty searches
  if (query === '') return []

  // get one page of results from TMDB
  const resp = await get<TMDB.SearchResults>('search/multi', { query, include_adult: false, language: 'en-US', page: 1 })

  const results = resp.results
    .filter(isGoodSearchResult) // remove bad results
    .map(cleanSearchResult) // clean

  return results
}
