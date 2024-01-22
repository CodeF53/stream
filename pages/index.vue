<script setup lang="ts">
const query = ref('')
const queryDebounce = refDebounced(query, 250)

const { data, pending, error } = await useAsyncData(
  'search',
  () => config.tmdb!.searchMulti({ query: queryDebounce.value }),
  { watch: [queryDebounce] },
)
</script>

<template>
  <input v-model="query" type="search" autofocus>
  <p v-if="pending">
    loading...
  </p>
  <p v-if="error">
    {{ error }}
  </p>
  <template v-if="data">
    <div id="searchResults">
      <SearchResult v-for="result in data.results" :key="result.id" :result="result" />
    </div>
  </template>
</template>

<style lang="scss">
#searchResults {
  display: flex;
  flex-wrap: wrap;
  gap: $panel-gap;
}
</style>
