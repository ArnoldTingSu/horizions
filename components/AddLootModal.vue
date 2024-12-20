<!-- components/AddLootModal.vue -->
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-2xl font-bold mb-4">Add Loot</h2>
      
      <!-- Item Selection -->
      <div class="mb-4">
        <label for="item" class="block text-sm font-medium text-gray-700">Select Item</label>
        <select
          v-model="selectedItem"
          id="item"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          required
        >
          <option disabled value="">Please select an item</option>
          <option v-for="item in availableItems" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>

      <!-- Position Input -->
      <div class="mb-4">
        <label for="position" class="block text-sm font-medium text-gray-700">Position</label>
        <input
          type="number"
          id="position"
          v-model.number="position"
          min="1"
          class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          placeholder="Enter priority position"
          required
        />
      </div>

      <!-- Buttons -->
      <div class="flex justify-end">
        <button @click="$emit('close')" class="btn bg-gray-500 hover:bg-gray-600 text-white mr-2">Cancel</button>
        <button @click="addLoot" class="btn bg-green-500 hover:bg-green-600 text-white">Add</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

// Props
const props = defineProps({
  raiderId: {
    type: Number,
    required: true
  }
});

// Emit Events
const emit = defineEmits(['close', 'loot-added']);

// Access Supabase
const { $supabase } = useNuxtApp();

// State
interface Item {
  id: number;
  name: string;
}

const availableItems = ref<Item[]>([]);
const selectedItem = ref<number | null>(null);
const position = ref<number>(1);

// Fetch Available Items
const fetchAvailableItems = async () => {
  const { data, error } = await $supabase
    .from('items')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching items:', error.message);
    alert('Failed to fetch items. Please try again.');
  } else {
    availableItems.value = data;
    console.log('Available Items:', availableItems.value);
  }
};

// On Component Mount
onMounted(() => {
  fetchAvailableItems();
});

// Add Loot Function
const addLoot = async () => {
  if (!selectedItem.value) {
    alert('Please select an item.');
    return;
  }

  if (!Number.isInteger(position.value) || position.value < 1) {
    alert('Position must be a positive integer.');
    return;
  }

  // Insert into raider_loot_list using item_id
  const { error } = await $supabase
    .from('raider_loot_list')
    .insert([
      {
        created_by: props.raiderId,
        item_id: selectedItem.value,
        position: position.value
      }
    ]);

  if (error) {
    if (error.code === '23505') { // Unique violation
      alert('This item is already in the Raider\'s loot list.');
    } else {
      console.error('Error adding loot:', error.message);
      alert('Failed to add loot. Please try again.');
    }
  } else {
    console.log('Loot added successfully.');
    emit('loot-added'); // Notify parent to refresh loot list
    emit('close');      // Close the modal
  }
};
</script>

<style scoped>
.btn {
  /* Button Styles */
  display: inline-block;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
}
</style>
