<!-- components/RaiderCard.vue -->
<template>
    <div class="raider-card bg-white shadow-md rounded-lg p-4">
    <h2 class="raider-name text-xl font-semibold text-gray-800">{{ raider.display_name }}</h2>
    <p class="raider-role text-gray-600">Role: {{ raider.role }}</p>
    <p class="raider-class text-gray-600">Class: {{ raider.class }}</p>
    <NuxtLink :to="`/raider/${raider.display_name}`" class="btn mt-4 inline-block">View Details</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

interface Raider {
  id: string;           // UUID referencing user_profiles(id)
  display_name: string; // User-friendly name, now lowercase and unique
  role: string;
  class: string;
}

const props = defineProps({
  raider: {
    type: Object as () => Raider,
    required: true
  }
});
</script>

<style scoped>
.raider-card {
  /* Optional: Add custom styles for the Raider card */
}

.btn {
  /* Button Styles */
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #3b82f6; /* Tailwind's blue-500 */
  color: #fff;
  border-radius: 0.375rem;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn:hover {
  background-color: #2563eb; /* Tailwind's blue-600 */
  transform: translateY(-2px);
}
</style>




