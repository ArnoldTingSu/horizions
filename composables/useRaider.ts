// composables/useRaider.ts
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useNuxtApp } from '#app';

export const useRaider = () => {
  const route = useRoute();
  const { $supabase } = useNuxtApp();

  const raider = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchRaider = async () => {
    const name = route.params.name as string;

    const { data, error: fetchError } = await $supabase
      .from('raiders')
      .select('*')
      .eq('name', name)
      .single();

    if (fetchError) {
      console.error('Error fetching raider:', fetchError.message);
      error.value = { message: 'Raider not found or an error occurred.' };
    } else {
      raider.value = data;
    }

    loading.value = false;
  };

  return {
    raider,
    loading,
    error,
    fetchRaider,
  };
};
