<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import RaiderCard from '~/components/RaiderCard.vue';

// const raiders = [{ name: "Test Raider" }]; // Example data

const raiders = ref([]);
const { $supabase } = useNuxtApp();

const fetchRaiders = async () => {
  const { data, error } = await $supabase.from('user_profiles').select('*');
  if (error) {
    console.error('Error fetching raiders:', error);
  } else {
    raiders.value = data;
    console.log('Fetched raiders:', data);
  }
};

onMounted(fetchRaiders);
</script>

<template>
  <div>
    <h1>Raiders</h1>
    <div class="raider-grid">
      <RaiderCard
        v-for="raider in raiders"
        :key="raider.name"
        :raider="raider"
      />
    </div>
  </div>
</template>

<style>
</style>

