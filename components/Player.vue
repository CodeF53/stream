<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'

defineProps<{ src: string }>()

const frame = ref()
const player: Ref<HTMLDivElement | undefined> = ref()
const smallControls = ref(false)
const fullscreen = ref(false)

function toggleFullscreen() {
  fullscreen.value = !fullscreen.value
  if (!document.fullscreenElement)
    player.value!.requestFullscreen()
  else if (document.exitFullscreen)
    document.exitFullscreen()
}
function keyHandler(e: KeyboardEvent) {
  // if we have some input focused we don't want to be reading keybinds
  const activeElement = document.activeElement
  if (activeElement && /input|select|button/i.test(activeElement.localName))
    return

  switch (e.key) {
    case 'f':
      toggleFullscreen()
      break
  }
}
onMounted(() => {
  document.addEventListener('keydown', keyHandler)
  useResizeObserver(frame, (entries) => {
    const entry = entries[0]
    const { width } = entry.contentRect
    smallControls.value = width < 1280
  })
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', keyHandler)
})
</script>

<template>
  <div id="player" ref="player" :class="{ fullscreen }">
    <iframe ref="frame" :src="src" />
    <button :class="{ smallControls }" aria-label="toggle fullscreen" @click="toggleFullscreen" />
  </div>
</template>

<style lang="scss">
#player {
  min-width: 20rem;
  height: 100%;
  max-width: calc(100% - 2rem);
  max-height: calc(100% - 2rem);
  aspect-ratio: 16/9;

  &.fullscreen {
    z-index: 200;
    position: absolute;
    top: 0; left: 0;
    bottom: 0; right: 0;
    max-width: unset; max-height: unset;
    width: 100vw; height: 100vh;
  }

  position: relative;
  > iframe {
    position: absolute;
    left: 0; top: 0;
    width: 100%;
    height: 100%;
    border: none;
  }
  > button {
    all: unset;
    position: absolute;

    bottom: 1.25rem; right: 3rem;
    width: 3.75rem; height: 3.75rem;
    &.smallControls {
      bottom: 0; right: .5rem;
      width: 3.1rem; height: 3.1rem;
    }
  }
  > span {
    position: absolute;
    bottom: -1.2rem;
  }
}
</style>
