<script setup lang="ts">
onBeforeMount(initConfig)
</script>

<template>
  <NuxtLayout>
    <NuxtPage v-if="config.tmdb" />
  </NuxtLayout>
</template>
