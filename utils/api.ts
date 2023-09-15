const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    // https://www.themoviedb.org/settings/api
    // shut up, I will refresh it later when I can be bothered to set up .env and give that to github actions
    Authorization: `Bearer ${atob('ZXlKaGJHY2lPaUpJVXpJMU5pSjkuZXlKaGRXUWlPaUl6WVRobU1HWm1NVGRqTVdaallUaGtPRGRrTURjMlpHRXlOekJqWkRBeE55SXNJbk4xWWlJNklqWTBaVGRqTnpKaE5UazBZemswTURCak5UVXlaamd3WlNJc0luTmpiM0JsY3lJNld5SmhjR2xmY21WaFpDSmRMQ0oyWlhKemFXOXVJam94ZlEuZkVjemExQmxjLU9fakVNYk9YekR0SEk3dEpUWGU2MlNWNVk2Vy1TQXhnWQ==')}`,
  },
}

export function fetchMovieDB(request: string) {
  return fetch(`https://api.themoviedb.org/3/${request}`, options)
}
