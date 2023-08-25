const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    // https://www.themoviedb.org/settings/api
    // shut up, I will refresh it later when I can be bothered to set up .env and give that to github actions
    Authorization: 'Bearer 713142f8e4d4b61b1f99323f7d815c6d'
  }
};

export default function fetchMovieDB(request) {
  return fetch(`https://api.themoviedb.org/3/${request}`, options)
}
