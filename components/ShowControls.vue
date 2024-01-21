<script lang="ts" setup>
import _ from 'lodash'

const route = useRoute()
const tmdbId = route.params.tmdbId as string
const season = defineModel('season')
const episode = defineModel('episode')

// get season/episode from url query so people can resume from their browser history
const seQStr = route.fullPath.split('?')[1]
const sNum = ref(Number(seQStr?.split(':')[0]) || 1)
const eNum = ref(Number(seQStr?.split(':')[1]) || 1)

// get all seasons
const seasons = useAsyncData(
  'showSeasons',
  () => tvSeasonsTMDB(tmdbId),
  { server: false, watch: [route] },
).data
// get all episodes for current season
const episodes = useAsyncData(
  'showEpisodes',
  () => tvEpisodesTMDB(tmdbId, sNum.value),
  { server: false, watch: [route, sNum] },
).data

function setSeason(e: Event) {
  const newSeason = Number((e.target! as HTMLSelectElement).value)
  updateSE(newSeason, 1)
}
function setEpisode(e: Event) {
  const newEpisode = Number((e.target! as HTMLSelectElement).value)
  updateSE(sNum.value, newEpisode)
}
const nextSeasonEpisode = computed(() => {
  if (!seasons.value || !episodes.value) return false
  const maxEpisode = episodes.value!.length - 1
  const maxSeason = _.maxBy(seasons.value!, 'number')!.number
  let newS = sNum.value
  let newE = eNum.value + 1
  if (newE > maxEpisode) {
    newE = 1
    newS += 1
  }
  if (newS > maxSeason)
    return false
  return { sNum: newS, eNum: newE }
})
function nextEpisode() {
  if (!nextSeasonEpisode.value) return
  const { sNum, eNum } = nextSeasonEpisode.value
  updateSE(sNum, eNum)
}
function updateSE(newS: number, newE: number) {
  sNum.value = newS
  eNum.value = newE
  history.replaceState({}, null!, `${route.path}?${newS}:${newE}`)
}

// keep outputs up to date
watch([seasons, episodes], () => {
  season.value = _.find(seasons.value, s => s.number === sNum.value)!
  episode.value = _.find(episodes.value, s => s.number === eNum.value)!
})
</script>

<template>
  <div id="showControls" class="panel">
    <select v-if="seasons" name="season" :value="sNum" @change="setSeason">
      <option v-for="s in seasons" :key="s.tmdbId" :value="s.number" :name="s.name">
        {{ s.name }}
      </option>
    </select>
    <select v-else disabled>
      <option>Season {{ sNum }}</option>
    </select>

    <select v-if="episodes" name="episode" :value="eNum" @change="setEpisode">
      <option v-for="e in episodes" :key="e.tmdbId" :value="e.number" :name="e.name">
        {{ e.number }} - {{ e.name }}
      </option>
    </select>
    <select v-else disabled>
      <option>{{ eNum }} - LOADING</option>
    </select>

    <button :disabled="!nextSeasonEpisode" @click="nextEpisode">
      Next Episode
    </button>
  </div>
</template>

<style lang="scss">
#showControls {
  & > * { width: 100%; }
  & > select, & > button { height: $big-input-height; }
}
</style>
