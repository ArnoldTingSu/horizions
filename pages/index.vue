<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import bcrypt from 'bcryptjs';

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const { $supabase } = useNuxtApp();

const login = async () => {
  // Fetch the user's hashed password
  const { data, error } = await $supabase
    .from('user_profiles')
    .select('password')
    .eq('username', username.value)
    .single();

  if (error || !data) {
    errorMessage.value = 'Invalid username or user not found';
    return;
  }

  const isValid = bcrypt.compareSync(password.value, data.password);
  if (isValid) {
    console.log('Login successful!');

    // Now that the password is validated, sign the user in with Supabase Auth
    // If you're not using email/password in Supabase auth directly, you might need a custom logic.
    // Assuming you've stored email for the user (or you have a direct sign-in approach):
    const { data: signInData, error: signInError } = await $supabase.auth.signInWithPassword({
      email: 'test@example.com', // Replace with your logic to map username to an email
      password: password.value,
    });

    if (signInError) {
      errorMessage.value = signInError.message;
      return;
    }

    // If sign-in is successful, redirect to /suite
    navigateTo('/suite');
  } else {
    errorMessage.value = 'Invalid password';
  }
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
