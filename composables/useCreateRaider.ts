// composables/useCreateRaider.ts
export const useCreateRaider = async (name: string, role: string, level: number, loot: string[]) => {
  const { $supabase } = useNuxtApp();

  // Attempt to insert a new Raider
  const { data, error } = await $supabase
    .from('raiders')
    .insert([{ name, role, level, loot }]);

  if (error) {
    if (error.code === '23505') { // Unique violation
      throw new Error('Raider name already exists.');
    }
    throw new Error(error.message);
  }

  return data;
};
