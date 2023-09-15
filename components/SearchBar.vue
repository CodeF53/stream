<script setup lang="ts">
const input: Ref<HTMLInputElement | undefined> = ref()
const searchText = ref('')
function submit() {
  return navigateTo(`/search?query=${searchText.value}`)
}
</script>

<template>
  <form id="searchBar" class="inputWrapper" @submit.prevent="submit" @click="input!.focus()">
    <input ref="input" v-model="searchText" type="text" placeholder="Search content..." required>

    <button type="submit" aria-label="go">
      <SvgoSearch filled />
    </button>
  </form>
</template>

<style lang="scss">
#searchBar {
  &:hover { cursor: text; }
  button:hover { cursor: pointer; }
}
</style>
