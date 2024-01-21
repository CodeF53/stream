import type { SearchResultData } from '~/@types/search'
import * as TMDB from '~/@types/tmdb'
import type { Episode, Season } from '~/@types/tv'

const headers: Record<string, string> = {
  accept: 'application/json',
}

function initHeaders() {
  // set auth header on first search
  if (headers.Authorization === undefined) {
    if (config.tmdbKey !== undefined)
      headers.Authorization = `Bearer ${config.tmdbKey}`
    else
      throw new Error('No TMDB API key provided, set environment variable NUXT_PUBLIC_TMDB_KEY')
  }
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
    year: Number((isMovie ? result.release_date : result.first_air_date).slice(0, 4)),
  }

  return out
}

export async function searchTMDB(query: string): Promise<SearchResultData[]> {
  initHeaders()
  // give nothing for empty searches
  if (query === '') return []
  // get one page of results
  const resp = await get<TMDB.SearchResults>('search/multi', { query, include_adult: false, language: 'en-US', page: 1 })

  const results = resp.results
    .filter(isGoodSearchResult) // remove bad results
    .map(cleanSearchResult) // clean

  return results
}

function cleanSeason(season: TMDB.SeasonShort): Season {
  return {
    tmdbId: season.id.toString(),
    name: season.name,
    number: season.season_number,
  }
}

export async function tvSeasonsTMDB(series_id: string): Promise<Season[]> {
  initHeaders()
  // get info about the show
  const resp = await get<TMDB.TVInfo>(`tv/${series_id}`, { language: 'en-US' })

  const results = resp.seasons
    .map(cleanSeason)

  return results
}

function cleanEpisode(season: TMDB.EpisodeShort): Episode {
  return {
    tmdbId: season.id.toString(),
    name: season.name,
    number: season.episode_number,
  }
}

export async function tvEpisodesTMDB(series_id: string, season_number: number): Promise<Episode[]> {
  initHeaders()
  // get info about the season
  const resp = await get<TMDB.SeasonInfo>(`tv/${series_id}/season/${season_number}`, { language: 'en-US' })

  const results = resp.episodes
    .map(cleanEpisode)

  return results
}
