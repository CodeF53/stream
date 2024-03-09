class HomeController < ApplicationController
  def index
    @trending_media = Rails.cache.fetch 'trending_media', expire_in: 1.day do
      trending_media = Tmdb::Search.new('/trending/all/day').fetch.map do |media|
        if media.media_type == 'movie'
          helpers.parse_movie(media)
        else
          helpers.parse_show(media)
        end
      end

      trending_media.select(&:valid).sort_by(&:popularity).reverse
    end
  end
end
