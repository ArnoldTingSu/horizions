<template>
  <div class="app-container">
    <Navbar />
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<script setup>
import Navbar from '~/components/Navbar.vue'
</script>

<style scoped>

main {
  padding: 2rem;
}

h1 {
  color: #0000;
}
</style>
