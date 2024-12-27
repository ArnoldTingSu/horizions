<!-- components/RaiderList.vue -->
<template>
  <div class="raider-list grid grid-cols-1 md:grid-cols-3 gap-4">
    <RaiderCard v-for="raider in raiders" :key="raider.id" :raider="raider" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import RaiderCard from '~/components/RaiderCard.vue';

interface Raider {
  id: string;
  display_name: string;
  role: string;
  class: string;
}

const raiders = ref<Raider[]>([]);

const { $supabase } = useNuxtApp();

const fetchRaiders = async () => {
  const { data, error } = await $supabase
    .from('user_profiles') // Updated table reference
    .select('id, display_name, role, class')
    .order('display_name', { ascending: true });

  if (error) {
    console.error('Error fetching raiders:', error.message);
    // Optionally, handle the error (e.g., show a message to the user)
  } else {
    raiders.value = data;
  }
};

onMounted(() => {
  fetchRaiders();
});
</script>

<style scoped>
.raider-list {
  /* Optional: Add styles for the Raider list */
}
</style>
