<script setup>
import { ref } from 'vue';
import { useNuxtApp } from '#app';
import bcrypt from 'bcryptjs';

const username = ref('');
const password = ref('');
const errorMessage = ref('');

const { $supabase } = useNuxtApp();

const register = async () => {
  // Create pseudo-email
  const pseudoEmail = `${username.value}@yourdomain.com`;

  // Sign up using Supabase Auth with pseudo-email and password
  const { data: signUpData, error: signUpError } = await $supabase.auth.signUp({
    email: pseudoEmail,
    password: password.value,
  });

  if (signUpError) {
    errorMessage.value = signUpError.message;
    return;
  }

  // Hash the password (optional if you rely solely on Supabase auth for security)
  // Here we can still hash if we want to store a reference password hash in user_profiles.
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password.value, salt);

  // Insert user profile with the `id` from auth signUp
  const { data: profileData, error: profileError } = await $supabase
    .from('user_profiles')
    .insert({
      id: signUpData.user.id, // user_profiles.id references auth.users.id
      username: username.value,
      password: hashedPassword, // Optional if you only trust Supabase auth
    });

  if (profileError) {
    errorMessage.value = profileError.message;
    return;
  }

  console.log('User registered successfully:', profileData);
};
</script>

<template>
  <form @submit.prevent="register">
    <input v-model="username" placeholder="Username" required />
    <input type="password" v-model="password" placeholder="Password" required />
    <button type="submit">Register</button>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<style scoped>
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>
