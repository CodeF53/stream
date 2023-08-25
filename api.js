const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    // https://www.themoviedb.org/settings/api
    // shut up, I will refresh it later when I can be bothered to set up .env and give that to github actions
    Authorization: `Bearer ${atob('M2E4ZjBmZjE3YzFmY2E4ZDg3ZDA3NmRhMjcwY2QwMTc')}`
  }
};

export default function fetchMovieDB(request) {
  return fetch(`https://api.themoviedb.org/3/${request}`, options)
}
