<script lang="ts" setup>
import type { RunOutput, ScrapeMedia } from '@movie-web/providers'
import type { Episode, Season } from '~/@types/tv'

const props = defineProps<{ season?: Season, episode?: Episode }>()
const route = useRoute().params as Record<string, string>
const { type, tmdbId, title, releaseYear } = route

async function getStream(media: ScrapeMedia): Promise<RunOutput | null> {
  if (media.type === 'show')
    if (!media.season || !media.episode) return null

  return await providers.runAll({ media })
}

const { data, pending, error } = await useAsyncData(
  'stream',
  () => getStream({ ...props, type, tmdbId, title, releaseYear: Number(releaseYear) } as ScrapeMedia),
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
