class SearchController < ApplicationController
  def index
    title = params[:title]
    type = params[:type]

    @search_results = Rails.cache.fetch("search#{type}-#{title}", expires_in: 4.hours) do
      search = Tmdb::Search.new
      search.query(title)

      movies = []
      if %w[all movie].include?(type)
        search.resource('movie')
        movies = search.fetch.map { |movie| helpers.parse_movie(movie) }
      end

      shows = []
      if %w[all show].include?(type)
        search.resource('tv')
        shows = search.fetch.map { |show| helpers.parse_show(show) }
      end

      (movies + shows).select(&:valid).sort_by(&:popularity).reverse
    end
  end
end
