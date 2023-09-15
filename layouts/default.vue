<template>
  <div id="page" class="col">
    <Header />
    <AdblockSuggestion />

    <slot />

    <div class="spacer" />
    <Footer />
  </div>
</template>

<style lang="scss">
#page {
  width: 100vw;
  max-width: 100vw;
  min-height: 100vh;
  overflow-x: hidden;

  > main { margin: 1rem; }
}
</style>
