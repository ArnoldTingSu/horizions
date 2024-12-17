// nuxt.config.ts

import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  vite: {
    plugins: [require('vite-plugin-wasm')()],
  },

  modules: ['@nuxt/ui'],
  plugins: ['~/plugins/supabase.js'],

  runtimeConfig: {
    public: {
      SUPABASE_URL: process.env.SUPABASE_URL,
      SUPABASE_KEY: process.env.SUPABASE_KEY,
    },
  },

  compatibilityDate: '2024-12-12'
});
  