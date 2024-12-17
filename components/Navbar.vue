<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp, navigateTo } from '#app';

const { $supabase } = useNuxtApp();
const isLoggedIn = ref(false);

onMounted(async () => {
  const { data: { session } } = await $supabase.auth.getSession();
  isLoggedIn.value = !!session;
});

const logout = async () => {
  const { error } = await $supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error.message);
  } else {
    console.log('Signed out successfully');
    isLoggedIn.value = false;
    navigateTo('/login');
  }
};
</script>

<template>
  <nav class="flex justify-around items-center p-4 bg-gray-100 border-4 border-black rounded-md max-w-3xl mx-auto shadow-[6px_6px_0_0_rgba(0,0,0,1)]">
    <NuxtLink to="/raiders" class="btn">Raiders</NuxtLink>
    <NuxtLink to="/bosses" class="btn">Bosses</NuxtLink>
    <NuxtLink to="/items" class="btn">Items</NuxtLink>
    <NuxtLink v-if="!isLoggedIn" to="/login" class="btn">Login</NuxtLink>
    <NuxtLink v-if="!isLoggedIn" to="/register" class="btn">Register</NuxtLink>
    <button v-if="isLoggedIn" @click="logout" class="btn">Logout</button>
  </nav>
</template>

<style scoped>
.btn {
  font-weight: bold;
  text-decoration: none;
  color: #333;
  padding: 0.75rem 1.5rem;
  border: 4px solid #000;
  border-radius: 0.5rem;
  background-color: #e2e8f0;
  transition: background-color 0.2s, transform 0.2s;
  cursor: pointer;
  box-shadow: 6px 6px 0 0 rgba(0,0,0,1);
}
.btn:hover {
  background-color: #cbd5e1;
  transform: translateY(-2px);
}
</style>
