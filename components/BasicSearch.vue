<script lang="ts" setup>
import { searchTMDB } from '~/utils/tmdb'

const route = useRoute()
const query: Ref<string> = ref(`${route.query.query || ''}`)
const debouncedQuery = ref(query.value)

const { data, pending, error } = await useAsyncData(
  'query',
  () => searchTMDB(query.value),
  {
    server: false,
    watch: [debouncedQuery],
  },
)

const updateDebouncedQuery = useDebounce(() => debouncedQuery.value = query.value, 250)
// on query change
watch(query, () => {
  history.replaceState({}, null!, `${route.path}?query=${query.value}`) // update url
  pending.value = true // show loading animation
  updateDebouncedQuery() // schedule new search
})
</script>

<template>
  <form role="search" @submit="$event.preventDefault()">
    <input v-model="query" type="search" name="query">
  </form>

  <p v-if="pending">
    <strong>loading</strong>
  </p>
  <p v-else-if="error">
    <strong>error</strong>
    {{ JSON.stringify(error) }}
  </p>
  <p v-else-if="data">
    {{ JSON.stringify(data) }}
  </p>
</template>
