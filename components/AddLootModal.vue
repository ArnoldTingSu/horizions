<!-- components/AddLootModal.vue -->
<template>
  <!-- Modal Overlay -->
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <!-- Modal Container -->
    <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <!-- Modal Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-gray-800">Add Loot Item</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
          <!-- Close Icon (X) -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
               viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Modal Form -->
      <form @submit.prevent="addLoot">
        <!-- Item Selection -->
        <div class="mb-4">
          <label for="item" class="block text-gray-700 font-medium mb-2">Item:</label>
          <select
            v-model.number="selectedItem"
            id="item"
            required
            class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Please select an item</option>
            <option v-for="item in items" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>

        <!-- Position Input -->
        <div class="mb-4">
          <label for="position" class="block text-gray-700 font-medium mb-2">Position:</label>
          <input
            type="number"
            v-model.number="position"
            id="position"
            min="1"
            required
            class="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter position number"
          />
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end space-x-4">
          <button
            type="button"
            @click="$emit('close')"
            class="btn bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="btn bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

// Define props
const props = defineProps({
  raiderId: {
    type: String,
    required: true
  }
});

// Define emitted events
const emit = defineEmits(['close', 'loot-added']);

// Define reactive variables
const selectedItem = ref<number | null>(null);
const position = ref<number>(1);
const items = ref<{ id: number; name: string; }[]>([]);

// Fetch items from the database on component mount
onMounted(async () => {
  const { $supabase } = useNuxtApp();
  const { data, error } = await $supabase
    .from('items')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching items:', error.message);
    alert('Failed to fetch items. Please try again.');
  } else {
    items.value = data || [];
  }
});

// Function to add loot
const addLoot = async () => {
  if (!selectedItem.value) {
    alert('Please select an item.');
    return;
  }

  try {
    const { $supabase } = useNuxtApp();

    const { error } = await $supabase
      .from('raider_loot_list')
      .insert([
        {
          list_owner: props.raiderId,        // Correct column name
          listed_item: selectedItem.value,   // Correct column name
          position: position.value
        }
      ]);

    if (error) throw error;

    // Emit events to parent component
    emit('loot-added');
    emit('close');
  } catch (error) {
    console.error('Error adding loot:', error.message);
    alert('Failed to add loot. Please try again.');
  }
};
</script>

<style scoped>
/* Reusable Button Styles */
.btn {
  transition: background-color 0.3s, transform 0.2s;
}

.btn:hover {
  transform: translateY(-1px);
}

/* Optional: Additional custom styles can be added here */
</style>
