<script lang="ts" setup>
import type { SearchResultData } from '../@types/search'

const { searchResult } = defineProps<{ searchResult: SearchResultData }>()
const { stars, type, tmdbId, title, year } = searchResult

const scrapeType = type === 'movie' ? 'movie' : 'show'
const to = `\/${scrapeType}-${tmdbId}-${title}-${year}`
</script>

<template>
  <NuxtLink :to="to">
    <h2>{{ title }}</h2>
    <span>{{ type }}</span>
    <span>{{ stars }} / 5</span>
  </NuxtLink>
</template>
