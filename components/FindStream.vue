<script lang="ts" setup>
import type { MediaTypes, ScrapeMedia } from '@movie-web/providers'
import { makeProviders, makeSimpleProxyFetcher, makeStandardFetcher, targets } from '@movie-web/providers'
import type { Episode, Season } from '~/@types/tv'

const props = defineProps<{ type: MediaTypes, season?: Season, episode?: Episode }>()
const route = useRoute().params as Record<string, string>
const { id, title, year } = route

// if you are forking, please host your own proxy server
// https://docs.movie-web.app/proxy/deploy
const proxyUrl = 'https://proxy.f53.dev/'
const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),
  target: targets.BROWSER,
})

const { data, pending, error } = await useAsyncData(
  'stream',
  () => providers.runAll({ media: { ...props, tmdbId: id, title, releaseYear: Number(year) } as ScrapeMedia }),
  { server: false, watch: [props] },
)
</script>

<template>
  <p v-if="pending">
    <strong>loading</strong>
  </p>
  <p v-else-if="error">
    <strong>error</strong>
    {{ JSON.stringify(error) }}
  </p>
  <Player v-else-if="data" :source="data" />
</template>
