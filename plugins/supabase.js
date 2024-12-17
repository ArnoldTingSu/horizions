// ~/plugins/supabase.js
import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin((nuxtApp) => {
  const supabaseUrl = nuxtApp.$config.public.SUPABASE_URL;
  const supabaseKey = nuxtApp.$config.public.SUPABASE_KEY;

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Provide Supabase client to the Nuxt app
  nuxtApp.provide('supabase', supabase);
});

