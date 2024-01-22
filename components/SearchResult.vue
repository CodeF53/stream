<script lang="ts" setup>
import type { MovieResult, PersonResult, TvResult } from 'moviedb-promise'

const { result } = defineProps<{ result: (MovieResult | TvResult | PersonResult) }>()

const info = computed(() => {
  if (result.media_type === 'person') return

  const isMovie = result.media_type === 'movie'

  const title = (isMovie ? result.title : result.name)?.trim()
  if (title === undefined || title === '') return

  const type = isMovie ? 'movie' : 'show'

  const date = isMovie ? result.release_date : result.first_air_date
  if (!date) return
  const year = date?.split('-')[0]

  const rating = result.vote_average
  if (!rating) return
  const stars = (rating / 2)

  const img = result.poster_path
  if (!img) return
  const imgUrl = `https://image.tmdb.org/t/p/w342//${img}`

  return {
    title,
    type,
    year,
    to: `\/${type}-${result.id}-${title}-${year}`,
    stars,
    imgUrl,
  }
})
</script>

<template>
  <template v-if="info !== undefined">
    <NuxtLink class="searchResult" :to="info!.to">
      <img :src="info!.imgUrl" :alt="info!.title">
      <h2>{{ info!.title }}</h2>
      <span>{{ info!.type }} ● {{ info!.year }}</span>
      <span>{{ info!.stars }} / 5</span>
    </NuxtLink>
  </template>
</template>

<style lang="scss">
.searchResult {
  display: flex;
  flex-direction: column;

  width: 10rem;
  height: 20rem;

  span, h2 { text-align: center; }
  h2 { font-size: 1.25rem; }

  img {
    width: 10rem;
    min-height: 15rem;
    max-height: 15rem;
    object-fit: cover;
  }

  &:hover {
    scale: 1.05;
  }
}
</style>
