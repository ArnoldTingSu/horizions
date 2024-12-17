<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import { navigateTo } from '#app';

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const { $supabase } = useNuxtApp();

const login = async () => {
  // Create pseudo-email from username
  const pseudoEmail = `${username.value}@yourdomain.com`;

  const { data: signInData, error: signInError } = await $supabase.auth.signInWithPassword({
    email: pseudoEmail,
    password: password.value,
  });

  if (signInError) {
    errorMessage.value = 'Invalid credentials';
    return;
  }

  console.log('Login successful!');
  await navigateTo('/suite');
};
</script>

<template>
  <form @submit.prevent="login">
    <input v-model="username" placeholder="Username" required />
    <input type="password" v-model="password" placeholder="Password" required />
    <button type="submit">Login</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
