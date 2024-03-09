class StreamController < ApplicationController
  def index
    # ensure season and episode are set for shows
    if params[:type] == 'show' && (params[:s].blank? || params[:e].blank?)
      # TODO: resume on episode where user left off
      return redirect_to media_path(type: params[:type], id: params[:id], s: 1, e: 1)
    end

    set_media(params[:type], params[:id], params[:s].to_i, params[:e].to_i)

    @fancy_title = @media.title
    @fancy_title += " #{params[:s]}-#{params[:e]}" if params[:type] == 'show'
  end

  private

  def set_media(type, id, season, episode)
    @media = Rails.cache.fetch "media-#{id}-#{type}", expires_in: 2.hours do
      return helpers.parse_movie(Tmdb::Movie.detail(id)) if type == 'movie'

      helpers.parse_show(Tmdb::TV.detail(id))
    end

    @scrape_media = {
      type:,
      title: @media.title,
      releaseYear: @media.release_date[0..3].to_i,
      imdbId: @media[:imdb_id],
      tmdbId: id,
    }.compact!

    return unless type == 'show'

    @season = Rails.cache.fetch "show-#{id}-season-#{season}", expires_in: 2.hours do
      Tmdb::Season.detail(id, season)
    end

    @scrape_media.season = {
      number: season,
      tmdbId: @season.id,
    }
    @episode = @season.episodes.find { |e| e.episode_number == episode }
    @scrape_media.episode = {
      number: episode,
      tmdbId: @episode.id,
    }
  end
end
