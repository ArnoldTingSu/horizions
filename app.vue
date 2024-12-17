<script setup>
</script>

<!-- <template>
  <div>
    <NuxtPage />
    <h1>app.vue</h1>
  </div>
  <ul>
    <li v-for="country in countries" :key="country.id">{{ country.name }}</li>
  </ul>
</template> -->

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <p>v. 1.0 Arturia</p>
  </div>
</template>

<style>
:root {
  background-color: #a3f0b3;
}
</style>