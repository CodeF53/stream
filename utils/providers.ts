import { makeProviders, makeSimpleProxyFetcher, makeStandardFetcher, targets } from '@movie-web/providers'

// if you are forking, please host your own proxy server
// https://docs.movie-web.app/proxy/deploy
const proxyUrl = 'https://proxy.f53.dev/'
export const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),
  target: targets.BROWSER,
})
