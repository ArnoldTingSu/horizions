// plugins/supabase.js
import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  
  // Initialize Supabase client
  const supabase = createClient(config.public.SUPABASE_URL, config.public.SUPABASE_KEY);
  
  // Provide Supabase client to the entire app
  nuxtApp.provide('supabase', supabase);
});
