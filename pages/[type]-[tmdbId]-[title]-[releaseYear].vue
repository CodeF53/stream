import { Season, Episode } from '../@types/tv';
<script lang="ts" setup>
import type { Episode, Season } from '~/@types/tv'

const route = useRoute()
const { type } = route.params as Record<string, string>

if (type !== 'show' && type !== 'movie') throw new Error('its either a movie or a show dude')
const isShow = type === 'show'

const season: Ref<Season | undefined> = ref()
const episode: Ref<Episode | undefined> = ref()
</script>

<template>
  <main id="streamPage" :class="type">
    <Stream :season="season" :episode="episode" />

    <div class="sideBar">
      <ShowControls v-if="isShow" v-model:season="season" v-model:episode="episode" />

      <!-- Meta Info -->
    </div>
  </main>
</template>

<style lang="scss">
#streamPage {
  display: flex;
  flex-direction: row;
  gap: $panel-gap;
  margin: $panel-gap;

  $sidebar-width: 15rem;
  --player-width: calc(#{$width} - #{($sidebar-width + $panel-gap)});

  .sideBar {
    width: $sidebar-width;
    display: flex;
    flex-direction: column;
    gap: $panel-gap;
  }
}
</style>
