<script lang="ts" setup>
import _ from 'lodash'

import { tvEpisodesTMDB, tvSeasonsTMDB } from '~/utils/tmdb'

const route = useRoute()
const tmdbId = route.params.id as string
// get season/episode from url query /tv-615-Futurama-1999?1:12 => { season: 1, episode: 12 }
const seQStr = route.fullPath.split('?')[1]
const seasonNum = ref(Number(seQStr?.split(':')[0]) || 1)
const episodeNum = ref(Number(seQStr?.split(':')[1]) || 1)

// get all seasons and all episodes within selected season
const { data, pending, error } = await useAsyncData(
  'tvSelectedContent',
  async () => {
    const [seasons, episodes] = await Promise.all([
      tvSeasonsTMDB(tmdbId),
      tvEpisodesTMDB(tmdbId, seasonNum.value),
    ])
    return {
      seasons,
      episodes,
    }
  },
  { server: false, watch: [route, seasonNum, episodeNum] },
)

function setSeason(e: Event) {
  const newSeason = (e.target! as HTMLSelectElement).value
  seasonNum.value = Number(newSeason)
  episodeNum.value = 1
  history.replaceState({}, null!, `${route.path}?${newSeason}:${1}`)
}
function setEpisode(e: Event) {
  const newEpisode = (e.target! as HTMLSelectElement).value
  episodeNum.value = Number(newEpisode)
  history.replaceState({}, null!, `${route.path}?${seasonNum.value}:${newEpisode}`)
}

// get selected season/episode for stream search
const season = computed(() => _.find(data.value?.seasons, ({ number }) => number === seasonNum.value))
const episode = computed(() => _.find(data.value?.episodes, ({ number }) => number === episodeNum.value))
</script>

<template>
  <p v-if="pending">
    <strong>loading</strong>
  </p>
  <p v-else-if="error">
    <strong>error</strong>
    {{ JSON.stringify(error) }}
  </p>
  <template v-else-if="data">
    <FindStream type="show" :season="season" :episode="episode" />

    <select :value="seasonNum" @change="setSeason">
      <option v-for="s in data.seasons" :key="s.tmdbId" :value="s.number">
        {{ s.name }}
      </option>
    </select>
    <select :value="episodeNum" @change="setEpisode">
      <option v-for="e in data.episodes" :key="e.tmdbId" :value="e.number">
        {{ e.number }} - {{ e.name }}
      </option>
    </select>
  </template>
</template>
