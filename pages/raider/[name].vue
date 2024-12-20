<!-- pages/raider/[name].vue -->
<template>
  <div class="container mx-auto p-6">
    <!-- Loading State -->
    <div v-if="pending || lootPending" class="text-center">
      <p class="text-lg">Loading Raider details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || lootError" class="text-center text-red-500">
      <p class="mb-4">{{ error?.message || lootError?.message }}</p>
      <NuxtLink to="/raider" class="btn">Back to Raiders</NuxtLink>
    </div>

    <!-- Success State -->
    <div v-else class="raider-details bg-white p-6 rounded-lg shadow-md">
      <h1 class="text-3xl font-bold mb-4">{{ raider.name }}</h1>
      <p class="mb-2"><strong>Role:</strong> {{ raider.role }}</p>
      <p class="mb-2"><strong>Class:</strong> {{ raider.class }}</p>

      <!-- Loot List Section -->
      <div class="mt-6">
        <h2 class="text-2xl font-semibold mb-2">Loot List</h2>
        <ul class="list-disc list-inside">
          <li
            v-for="loot in raiderLootList"
            :key="loot.id"
            class="mb-1 flex justify-between items-center"
          >
            <div>
              <strong>{{ loot.item.name || 'Unknown Item' }}</strong>
              <p class="text-sm text-gray-600">
                {{ loot.item.type || 'Unknown Type' }} - {{ loot.item.slot || 'Unknown Slot' }}
              </p>
            </div>
            <!-- Loot Actions -->
            <div class="flex items-center">
              <input
                type="number"
                v-model.number="loot.position"
                @change="updateLootPosition(loot.id, loot.position)"
                class="w-16 border border-gray-300 rounded-md p-1 mr-4"
                min="1"
                required
              />
              <button
                @click="removeLootItem(loot.id)"
                class="btn bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          </li>
        </ul>
        <div v-if="raiderLootList.length === 0" class="text-gray-500">
          <p>No loot items assigned to this Raider.</p>
        </div>
      </div>

      <!-- Add Loot Button -->
      <div class="mt-4">
        <button
          @click="showAddLootModal = true"
          class="btn bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Loot
        </button>
      </div>
    </div>

    <!-- Add Loot Modal -->
    <AddLootModal
      v-if="showAddLootModal"
      @close="showAddLootModal = false"
      :raiderId="raider.id"
      @loot-added="refreshLootList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { useAsyncData, useNuxtApp } from '#app';
import { useRoute } from 'vue-router';
import AddLootModal from '~/components/AddLootModal.vue';

// Access the current route to retrieve the Raider's name
const route = useRoute();
const raiderName = route.params.name as string;

// Access the Supabase client from the Nuxt app
const { $supabase } = useNuxtApp();

// Fetch Raider data using useAsyncData for SSR benefits
const { data: raider, pending, error, refresh } = await useAsyncData(`raider-${raiderName}`, () =>
  $supabase
    .from('raiders')
    .select('*')
    .eq('name', raiderName)
    .single()
);

// Initialize loot list
const raiderLootList = ref([]);

// Watch for Raider data to be fetched before fetching loot list
watchEffect(async () => {
  if (raider.value && raider.value.id) {
    const { data: lootData, error: lootError } = await $supabase
      .from('raider_loot_list')
      .select('id, item_id, position, items(name, type, slot)')
      .eq('created_by', raider.value.id)
      .order('position', { ascending: true });

    if (lootError) {
      console.error('Error fetching loot list:', lootError.message);
    } else {
      raiderLootList.value = lootData || [];
      console.log('Fetched Loot List:', raiderLootList.value);
    }
  }
});

// Modal Control
const showAddLootModal = ref(false);

// Function to remove loot item
const removeLootItem = async (lootId: number) => {
  const confirmRemoval = confirm('Are you sure you want to remove this loot item?');
  if (!confirmRemoval) return;

  const { error } = await $supabase
    .from('raider_loot_list')
    .delete()
    .eq('id', lootId);

  if (error) {
    console.error('Error removing loot item:', error.message);
    alert('Failed to remove loot item. Please try again.');
  } else {
    raiderLootList.value = raiderLootList.value.filter((loot) => loot.id !== lootId);
  }
};

// Function to handle loot addition and refresh
const refreshLootList = () => {
  // Trigger the watchEffect to refetch loot list
  // Alternatively, you can re-fetch the loot list here if necessary
};

// Function to update loot position
const updateLootPosition = async (lootId: number, newPosition: number) => {
  if (!Number.isInteger(newPosition) || newPosition < 1) {
    alert('Position must be a positive integer.');
    // Optionally reset the position to its previous value
    const loot = raiderLootList.value.find((loot) => loot.id === lootId);
    if (loot) loot.position = 1;
    return;
  }

  const { error } = await $supabase
    .from('raider_loot_list')
    .update({ position: newPosition })
    .eq('id', lootId);

  if (error) {
    console.error('Error updating loot position:', error.message);
    alert('Failed to update position. Please try again.');
    // Optionally refetch the loot list to revert changes
  } else {
    // Optionally reorder the raiderLootList locally
    raiderLootList.value = raiderLootList.value.sort((a, b) => a.position - b.position);
  }
};
</script>

<style scoped>
.raider-details {
  /* Optional: Add custom styles for the Raider details card */
}

.btn {
  /* Button Styles */
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #e2e8f0; /* Tailwind's gray-300 */
  border: 4px solid #000; /* Black border */
  border-radius: 0.375rem;
  font-weight: bold;
  text-decoration: none;
  color: #333; /* Dark text */
  transition: background-color 0.2s, transform 0.2s;
  cursor: pointer;
}

.btn:hover {
  background-color: #cbd5e1; /* Tailwind's gray-400 */
  transform: translateY(-2px);
}
</style>
