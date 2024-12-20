<!-- components/RaiderCard.vue -->
<template>
  <NuxtLink :to="raiderLink" class="raider-card">
    <h3 class="raider-name">{{ raider.name }}</h3>
    <!-- Add more Raider summary details here if needed -->
  </NuxtLink>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  raider: {
    type: Object,
    required: true,
    default: () => ({
      name: 'NewRaider',
      id: 'default-id', // Ensure an ID is present if needed elsewhere
    }),
  },
});

// Compute the Raider link dynamically
const raiderLink = computed(() => {
  // Since Raider names are strict and have no spaces, encoding is optional but recommended for safety
  return `/raider/${encodeURIComponent(props.raider.name)}`;
});
</script>

<style scoped>
.raider-card {
  display: inline-block;
  text-decoration: none;
  color: inherit;
  border: 4px solid #000;
  border-radius: 0.5rem;
  background-color: #e2e8f0;
  box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 1);
  padding: 0.5rem 1rem;
  max-width: 12rem; /* Adjust to accommodate longer names */
  text-align: center;
  transition: transform 0.2s, border-width 0.2s, box-shadow 0.2s;
  cursor: pointer;
}

.raider-card:hover {
  transform: translateX(4px);
  border-width: 5px;
  box-shadow: 6px 6px 0 0 rgba(0, 0, 0, 1);
}

.raider-name {
  font-weight: bold;
  font-size: 0.875rem; /* Adjust as needed */
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
