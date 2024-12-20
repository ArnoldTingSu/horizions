// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  vite: {
    plugins: [require('vite-plugin-wasm')()],
  },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss' // Tailwind CSS module
  ],
  plugins: ['~/plugins/supabase.js'], // Ensure this path is correct

  css: ['~/assets/css/tailwind.css'], // Link to the global Tailwind CSS file

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },

  compatibilityDate: '2024-12-12',
});
