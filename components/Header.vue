<template>
  <header class="row centerChildren spaceAround">
    <NuxtLink to="/">
      <h2>Stream</h2>
    </NuxtLink>
    <SearchBar />
  </header>
</template>

<style lang="scss">
header {
  a {
    text-decoration: none;
    color: inherit;
  }
  background-color: var(--b000);
  height: 3rem;
}
</style>
