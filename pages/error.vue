<!-- pages/error.vue -->
<template>
  <div class="error-page container mx-auto p-4 text-center">
    <h1 class="text-4xl font-bold mb-4">404 - Page Not Found</h1>
    <p class="mb-6">The Raider you're looking for doesn't exist.</p>
    <NuxtLink to="/raiders" class="btn">Back to Raiders</NuxtLink>
  </div>
</template>

<script setup lang="ts">
// Optional: Add any setup logic if needed
</script>

<style scoped>
.error-page {
  /* Styles for the error page */
}

.btn {
  /* Button styles */
  padding: 0.75rem 1.5rem;
  background-color: #e2e8f0;
  border: 4px solid #000;
  border-radius: 0.5rem;
  font-weight: bold;
  text-decoration: none;
  color: #333;
  transition: background-color 0.2s, transform 0.2s;
  cursor: pointer;
}

.btn:hover {
  background-color: #cbd5e1;
  transform: translateY(-2px);
}
</style>
