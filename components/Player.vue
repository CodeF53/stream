<script lang="ts" setup>
import type { Qualities, RunOutput, StreamFile } from '@movie-web/providers'
import _ from 'lodash'

const { source } = defineProps<{ source: RunOutput }>()
const qualities = source.stream.qualities as Partial<Record<Qualities, StreamFile>>
const selectedQuality = ref(_.maxBy(_.keys(qualities), Number)! as Qualities)

const video: Ref<HTMLVideoElement | undefined> = ref()

watch(selectedQuality, (newVal) => {
  if (!video.value) return
  const oldTime = video.value.currentTime
  video.value.src = qualities[newVal]!.url
  video.value.currentTime = oldTime
})
</script>

<template>
  <div id="player">
    <span v-if="source.stream.type === 'hls'">Stream is in a weird format, get fucked</span>

    <template v-else>
      <video ref="video" autoplay controls>
        <source :src="qualities[selectedQuality]!.url" :type="`video/${qualities[selectedQuality]!.type}`">
      </video>
      <select v-model="selectedQuality">
        <option v-for="(quality, i) in _.keys(qualities)" :key="i" :value="quality">
          {{ quality }}p
        </option>
      </select>
    </template>
  </div>
</template>

<style lang="scss">
#player {
  position: relative;
  > video {
    width: 100%;
    height: 100%;
  }
}
</style>
