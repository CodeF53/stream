<script setup lang="ts">
defineProps<{ rating: number }>()
</script>

<template>
  <div class="starRating">
    <span class="fill" :style="{ width: `${$props.rating * 10}%` }">★★★★★</span>
    <span class="empty">★★★★★</span>
  </div>
</template>

<style lang="scss">
.starRating {
  width: min-content;
  position: relative;
  margin: 0;
  padding: 0;
  line-height: 1em;

  .fill {
    color: var(--af0);
    padding: 0;
    position: absolute;
    z-index: 1;
    display: block;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  .empty {
    color: var(--f2);
    padding: 0;
    display: block;
    z-index: 0;
  }
}
</style>
