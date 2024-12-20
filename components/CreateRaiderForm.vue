<!-- components/CreateRaiderForm.vue -->
<template>
  <form @submit.prevent="handleSubmit">
    <!-- Form fields for name, role, level, loot -->
    <button type="submit">Create Raider</button>
  </form>
  <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useCreateRaider } from '~/composables/useCreateRaider';

const name = ref('');
const role = ref('');
const level = ref(1);
const loot = ref<string[]>([]);
const errorMessage = ref('');

const handleSubmit = async () => {
  try {
    await useCreateRaider(name.value, role.value, level.value, loot.value);
    // Redirect or notify success
  } catch (error: any) {
    errorMessage.value = error.message;
  }
};
</script>
