<script setup lang="ts">
const route = useRoute()

const season: Ref<number> = ref(Number(route.query.s) || 1)
const episode: Ref<number> = ref(Number(route.query.ep) || 1)
const src = computed(() => {
  let url = `https://vidsrc.to/embed/${route.query.type}/${route.query.id}/`
  if (route.query.type === 'tv')
    url += `${season.value}/${episode.value}`
  return url
})

// on changing s/ep update url
watch([season, episode], ([s, ep]) => {
  const params = new URLSearchParams()
  const { type, id } = route.query
  params.append('type', type as string)
  params.append('id', id as string)
  params.append('s', s.toString())
  params.append('ep', ep.toString())
  history.pushState({}, '', `${route.path}?${params.toString()}`)
})

interface Content {
  backdrop_path: string
  poster_path: string

  seasons: [ { episode_count: number } ]

  name: string
  overview: string
  genres: [ { name: string } ]
  vote_average: number
  vote_count: number
  first_air_date: string
  last_air_date: string
  in_production: boolean
}
const content: Ref<Content | undefined> = ref()

async function updateContentDetails() {
  const { type, id } = route.query

  const resp = await fetchMovieDB(`/${type}/${id}`)
  const data = await resp.json()

  content.value = data
}

onBeforeMount(updateContentDetails)
</script>

<template>
  <main v-if="content" id="video" class="col gap4 centerChildren">
    <div id="vidContainer" class="centerChildren" :style="{ '--bkg': `url(https://image.tmdb.org/t/p/original/${content.backdrop_path})` }">
      <iframe id="videoFrame" :src="src" allowfullscreen />
      <!-- TODO: auto(Next/Play) -->
      <!-- TODO: source selector -->
    </div>
    <div id="shit" class="row gap2">
      <div id="info" class="row gap2">
        <img :src="`https://image.tmdb.org/t/p/w200/${content.poster_path}`">
        <div class="col gap1">
          <h1>{{ content.name }}</h1>
          <p>{{ content.overview }}</p>
          <div id="rating" class="col centerChildren">
            <Rating :rating="content.vote_average" />
            <span>
              <strong>{{ content.vote_average }}</strong>
              of <strong>10</strong>
              ({{ content.vote_count }} reviews)
            </span>
          </div>
          <!-- TODO: add remaining info -->
        </div>
      </div>
      <div v-if="route.query.type === 'tv'" id="episodePicker" class="alignStart col gap1">
        <div class="row centerChildren spaceBetween gap1">
          <label>Season</label>
          <input v-model="season" type="number" min="1" :max="content.seasons.length" @change="episode = 1">
        </div>
        <div class="row centerChildren spaceBetween gap1">
          <label>Episode</label>
          <input v-model="episode" type="number" min="1" :max="content.seasons[season - 1].episode_count">
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss">
#video {
  margin-top: 0 !important;

  > #vidContainer {
    width: 100vw;
    aspect-ratio: 16/9;
    background-image:
      linear-gradient(to bottom, transparent 70%, var(--b100)),
      var(--bkg);
    background-size: cover;
    max-height: calc(100vh - 9rem);

    > #videoFrame {
      height: 100%;
      max-width: calc(100% - 2rem);
      max-height: calc(100% - 2rem);
      border: none;
      aspect-ratio: 16/9;
    }
  }

  #info {
    max-width: 60rem;
    > img { border-radius: 1rem; }

    #rating {
      width: fit-content;
      border-radius: 1rem;
      padding: .5rem;
      background-color: var(--b200);
      > .starRating { font-size: 2rem; }
      font-size: .75rem;
    }
  }
  #episodePicker {
    input { width: 5rem; }
  }
}
</style>
