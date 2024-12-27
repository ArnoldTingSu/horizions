<!-- pages/raider/[displayName].vue -->
<template>
  <div class="container mx-auto p-6">
    <!-- Loading State -->
    <div v-if="pending || lootPending" class="text-center">
      <p class="text-lg text-gray-700">Loading Raider details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error || lootError" class="text-center text-red-500">
      <p class="mb-4">{{ error?.message || lootError?.message }}</p>
      <NuxtLink to="/raider" class="btn">Back to Raiders</NuxtLink>
    </div>

    <!-- Success State -->
    <div v-else-if="raider" class="raider-details bg-white p-6 rounded-lg shadow-md">
      <!-- Raider Information -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ raider.display_name }}</h1>
        <p class="text-lg text-gray-700"><strong>Role:</strong> {{ raider.role }}</p>
        <p class="text-lg text-gray-700"><strong>Class:</strong> {{ raider.class }}</p>
      </div>

      <!-- Loot List Section -->
      <div class="mt-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Loot List</h2>
        <ul class="space-y-4">
          <li
            v-for="loot in raiderLootList"
            :key="loot.id"
            class="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-4 rounded-lg shadow-sm"
          >
            <div class="mb-2 md:mb-0">
              <h3 class="text-xl font-medium text-gray-800">{{ loot.itemDetails?.name || 'Unknown Item' }}</h3>
              <p class="text-gray-600">
                {{ loot.itemDetails?.type || 'Unknown Type' }} - {{ loot.itemDetails?.slot || 'Unknown Slot' }}
              </p>
            </div>
            <div class="flex items-center space-x-4">
              <div>
                <label for="position" class="block text-gray-700">Position:</label>
                <input
                  type="number"
                  v-model.number="loot.position"
                  @change="updateLootPosition(loot.id, loot.position)"
                  class="w-16 border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  required
                />
              </div>
              <button
                @click="removeLootItem(loot.id)"
                class="btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                v-if="isOwner"
              >
                Remove
              </button>
            </div>
          </li>
        </ul>
        <div v-if="raiderLootList.length === 0" class="text-gray-500 mt-4">
          <p>No loot items assigned to this Raider.</p>
        </div>
      </div>

      <!-- Add Loot Button -->
      <div class="mt-6">
        <button
          v-if="isOwner"
          @click="showAddLootModal = true"
          class="btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md transition transform hover:scale-105"
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
import { ref, watchEffect, computed, onMounted } from 'vue';
import { useAsyncData, useNuxtApp } from '#app';
import { useRoute } from 'vue-router';
import AddLootModal from '~/components/AddLootModal.vue';

// Access the current route to retrieve the Raider's displayName
const route = useRoute();
let displayName = route.params.displayName as string;

// Ensure displayName is lowercase (redundant if middleware is set)
displayName = displayName.toLowerCase();

// Access the Supabase client from the Nuxt app
const { $supabase } = useNuxtApp();

// Initialize Raider as null with TypeScript interface
interface Raider {
  id: string;
  display_name: string;
  role: string;
  class: string;
}

const raider = ref<Raider | null>(null);

// Fetch Raider (User Profile) data using useAsyncData for SSR benefits
const { data, pending, error, refresh } = useAsyncData(`raider-${displayName}`, () =>
  $supabase
    .from('user_profiles')
    .select('id, display_name, role, class')
    .eq('display_name', displayName)
    .single()
);

// Assign Raider data once fetched
watchEffect(() => {
  raider.value = data.value?.data || null;
});

// Initialize loot list with TypeScript interface
interface LootItem {
  id: number;
  listed_item: number;
  position: number;
  itemDetails: {
    name: string;
    type: string;
    slot: string;
  };
}

const raiderLootList = ref<LootItem[]>([]);

// Manage loading and error states for loot
const lootPending = ref(false);
const lootError = ref(null);

// Retrieve the authenticated user
const currentUser = ref(null);

// Function to fetch current user, called only on client-side
const fetchCurrentUser = async () => {
  const { data: userData, error: userError } = await $supabase.auth.getUser();
  if (userError) {
    console.error('Error fetching user:', userError.message);
  } else {
    currentUser.value = userData.user;
  }
};

// Fetch the current user on component mount (client-side only)
onMounted(() => {
  fetchCurrentUser();
});

// Listen to auth state changes and update currentUser accordingly
$supabase.auth.onAuthStateChange((_event, session) => {
  currentUser.value = session?.user || null;
});

// Computed property to determine if the current user is the owner
const isOwner = computed(() => {
  return currentUser.value?.id === raider.value?.id;
});

// Watch for Raider data to be fetched before fetching loot list
watchEffect(async () => {
  if (raider.value && raider.value.id) {
    lootPending.value = true;
    const { data: lootData, error: lootErr } = await $supabase
      .from('raider_loot_list')
      .select(`
        id,
        listed_item,
        position,
        items (name, type, slot) // Use the correct relationship name
      `)
      .eq('list_owner', raider.value.id)
      .order('position', { ascending: true });

    if (lootErr) {
      lootError.value = lootErr;
      alert('Failed to fetch loot list. Please try again.');
    } else {
      console.log('Fetched lootData:', lootData);
      raiderLootList.value = lootData?.map(loot => ({
        id: loot.id,
        listed_item: loot.listed_item,
        position: loot.position,
        itemDetails: loot.items // Correctly mapped based on relationship name
      })) || [];
    }
    lootPending.value = false;
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
    alert('Failed to remove loot item. Please try again.');
  } else {
    raiderLootList.value = raiderLootList.value.filter((loot) => loot.id !== lootId);
  }
};

// Function to handle loot addition and refresh
const refreshLootList = async () => {
  if (raider.value && raider.value.id) {
    lootPending.value = true;
    const { data: lootData, error: lootErr } = await $supabase
      .from('raider_loot_list')
      .select(`
        id,
        listed_item,
        position,
        items (name, type, slot)
      `)
      .eq('list_owner', raider.value.id)
      .order('position', { ascending: true });

    if (lootErr) {
      alert('Failed to refresh loot list. Please try again.');
    } else {
      raiderLootList.value = lootData?.map(loot => ({
        id: loot.id,
        listed_item: loot.listed_item,
        position: loot.position,
        itemDetails: loot.items // Correctly mapped
      })) || [];
    }
    lootPending.value = false;
  }
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
    alert('Failed to update position. Please try again.');
    // Optionally refetch the loot list to revert changes
  } else {
    // Re-order the raiderLootList locally
    raiderLootList.value = raiderLootList.value.sort((a, b) => a.position - b.position);
  }
};
</script>

<style scoped>
.raider-details {
  /* Additional custom styles can be added here if necessary */
}

.btn {
  /* Reusable button styles */
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: #e2e8f0; /* Tailwind's gray-300 */
  border: 2px solid #000; /* Black border */
  border-radius: 0.375rem;
  font-weight: 600;
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
