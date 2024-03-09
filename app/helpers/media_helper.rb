module MediaHelper
  def parse_movie(movie)
    movie = movie.as_json.symbolize_keys!
    movie.type = 'movie'
    parse_media(movie)
    movie
  end

  def parse_show(show)
    show = show.as_json.symbolize_keys!
    show.type = 'show'
    show.release_date = show.first_air_date
    show.title = show.name
    parse_media(show)
    show
  end

  private

  IMPORTANT_KEYS = %i[id title release_date popularity vote_count poster_path].freeze
  def parse_media(media)
    # parse release into a year
    media.year = media.release_date[0..3].to_i

    # determine if media is worth showing to user
    media.valid =
      media.slice(*IMPORTANT_KEYS).values.none?(&:blank?) && # if it's missing some info then we can't show it
      media.vote_count.positive? && # no votes == no one cares
      Date.parse(media.release_date) < Date.current + 1.week # you can't watch movies that aren't out yet
  end
end
