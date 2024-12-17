<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

const { $supabase } = useNuxtApp();
const user = ref(null);
const username = ref('');
const errorMessage = ref('');

onMounted(async () => {
  // Get current session and user
  const { data: sessionData, error: sessionError } = await $supabase.auth.getSession();
  
  if (sessionError || !sessionData || !sessionData.session?.user) {
    return navigateTo('/login'); // not logged in, redirect
  }

  user.value = sessionData.session.user;

  // Fetch username from user_profiles
  const { data, error } = await $supabase
    .from('user_profiles')
    .select('username')
    .eq('id', user.value.id) // assuming user_profiles.id references auth.users.id
    .single();

  if (error) {
    errorMessage.value = error.message;
  } else {
    username.value = data.username;
  }
});

// Placeholder functions for raider item management
const addRaider = () => {
  // Implement logic to add a raider (or character)
  alert('Add Raider logic not implemented yet');
};

const manageItems = () => {
  // Implement logic to manage items (lists)
  alert('Manage Items logic not implemented yet');
};
</script>

<template>
  <div class="suite-page">
    <header>
      <h1 v-if="username">Welcome, {{ username }}!</h1>
      <h1 v-else>Welcome!</h1>
    </header>
    
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="actions">
      <button class="btn btn-primary" @click="addRaider">Add Raider/Character</button>
      <button class="btn btn-secondary" @click="manageItems">Manage Items/Lists</button>
    </div>

    <!-- Future: Display raiders and their items here -->
    <div class="raider-list">
      <h2>Your Raiders</h2>
      <p>No raiders yet. Click "Add Raider/Character" to create one!</p>
    </div>
  </div>
</template>

<style scoped>
.suite-page {
  padding: 2rem;
}

header h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error {
  color: red;
  margin-bottom: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.raider-list {
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
.btn-primary {
  background-color: #007bff;
  color: #fff;
}
.btn-secondary {
  background-color: #6c757d;
  color: #fff;
}
.btn:hover {
  opacity: 0.9;
}
</style>
