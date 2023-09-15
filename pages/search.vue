<script setup lang="ts">
const route = useRoute()

interface Content {
  id: number
  poster_path: string
  vote_average: number
  media_type: 'tv' | 'movie'

  name?: string // present if media_type is tv
  title?: string // present if media_type is movie

  first_air_date?: string // present if media_type is tv
  release_date?: string // present if media_type is movie
}
const results: Ref<Content[]> = ref([])

async function updateSearchResults() {
  const query = route.query.query

  const resp = await fetchMovieDB(`/search/multi?query=${query}&include_adult=true&language=en-US&page=1`)
  const data = await resp.json()

  results.value = data.results
}

onBeforeMount(updateSearchResults)
</script>

<template>
  <main id="search" class="centerChildren">
    <div id="results">
      <NuxtLink
        v-for="(result, i) in results" :key="i" class="result"
        :to="`/video/?type=${result.media_type}&id=${result.id}`"
      >
        <img :src="`https://image.tmdb.org/t/p/w200${result.poster_path}`">
        <div class="info row spaceAround">
          <span>{{ (result.first_air_date || result.release_date || 'error').split('-').at(0) }}</span>
          <span class="type">{{ result.media_type }}</span>
          <span>{{ result.vote_average }}</span>
        </div>
        <span class="title">{{ result.name || result.title || 'error' }}</span>
      </NuxtLink>
    </div>
  </main>
</template>

<style lang="scss">
#search {
  > #results {
    display: grid;
    grid-template-columns: repeat(auto-fit, 12.5rem);

    column-gap: 1rem;
    row-gap: 1rem;
    max-width: calc(100vw - 2rem);

    > .result {
      display: flex;
      flex-direction: column;
      text-decoration: none;
      > img { border-radius: 1rem; }
      > .info {
        color: var(--f2);
        > .type {
          padding: 0 .25rem;
          align-self: center;
          font-size: .75rem;
          text-transform: uppercase;
          border: var(--f2) solid 1.5px;
          border-radius: 1rem;
        }
      }
      > .title {
        color: var(--f0);
        text-align: center;
        height: 2.25rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      transition: scale .25s ease-out;
      &:hover { scale: 1.05; }
    }
  }
}
</style>
