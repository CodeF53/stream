<script lang="ts" setup>
import type { RunOutput, ScrapeMedia } from '@movie-web/providers'
import type { Episode, SimpleSeason } from 'moviedb-promise'
import { providers } from '~/utils/providers'

const props = defineProps<{ season?: SimpleSeason, episode?: Episode }>()
const route = useRoute().params as Record<string, string>
const { type, tmdbId, title, releaseYear } = route

async function getStream(media: ScrapeMedia, props: { season?: SimpleSeason, episode?: Episode }): Promise<RunOutput | null> {
  if (media.type === 'show') {
    if (!props.season || !props.episode) return null

    media.season = { number: props.season.season_number!, tmdbId: props.season.id!.toString() }
    media.episode = { number: props.episode.episode_number!, tmdbId: props.episode.id!.toString() }
  }

  return await providers.runAll({ media })
}

const { data, pending, error } = await useAsyncData(
  'stream',
  () => getStream({ type, tmdbId, title, releaseYear: Number(releaseYear) } as ScrapeMedia, props),
  { server: false, watch: [props] },
)
</script>

<template>
  <div id="stream">
    <strong v-if="pending">finding streams</strong>
    <strong v-else-if="error">error finding streams</strong>
    <strong v-else-if="data === null">no streams found</strong>
    <Player v-else :source="data" />
  </div>
</template>

<style lang="scss">
#stream {
  &, & > #player {
    width: var(--player-width);
    height: calc(var(--player-width) * 9 / 16);
  }
  background-color: black;
  border-radius: $border-radius;
  overflow: hidden;
}
</style>
