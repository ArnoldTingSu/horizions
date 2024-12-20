<!-- components/RaiderList.vue -->
<template>
  <div class="container mx-auto p-6">
    <h2 class="text-2xl font-semibold mb-4">Raiders</h2>
    <NuxtLink to="/raider/create" class="btn bg-green-500 hover:bg-green-600 text-white mb-4 inline-block">Add New Raider</NuxtLink>
    <ul>
      <li v-for="raider in raiders" :key="raider.id" class="mb-2">
        <NuxtLink :to="`/raider/${raider.name}`" class="raider-link">
          <strong>{{ raider.name }}</strong> - {{ raider.role }} - {{ raider.class }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

interface Raider {
  id: number;
  name: string;
  role: string;
  class: string;
}

const { $supabase } = useNuxtApp();
const raiders = ref<Raider[]>([]);

const fetchRaiders = async () => {
  const { data, error } = await $supabase
    .from('raiders')
    .select('id, name, role, class')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching raiders:', error.message);
    alert('Failed to fetch raiders. Please try again.');
  } else {
    raiders.value = data;
    console.log('Fetched Raiders:', raiders.value);
  }
};

onMounted(() => {
  fetchRaiders();
});
</script>

<style scoped>
.raider-link {
  text-decoration: none;
  color: #333;
  transition: color 0.2s;
}

.raider-link:hover {
  color: #2563eb; /* Tailwind's blue-600 */
}

.btn {
  /* Button Styles */
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #10b981; /* Tailwind's green-500 */
  border: none;
  border-radius: 0.375rem;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn:hover {
  background-color: #059669; /* Tailwind's green-600 */
  transform: translateY(-2px);
}
</style>
