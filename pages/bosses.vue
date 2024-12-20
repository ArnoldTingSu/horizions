
<!-- 
 -->

 <script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import BossCard from '~/components/BossCard.vue';

const bosses = ref([]);
const { $supabase } = useNuxtApp();

const fetchBosses = async () => {
  const { data, error } = await $supabase.from('bosses').select('*');
  if (error) {
    console.error('Error fetching bosses:', error);
  } else {
    bosses.value = data;
    console.log('Fetched bosses:', data);
  }
};

onMounted(fetchBosses);
</script>

<template>
  <div>
    <h1>Bosses</h1>
    <div class="">
      <BossCard
        class="m-1"
        v-for="boss in bosses"
        :key="boss.name"
        :boss="boss"
      />
    </div>
  </div>
</template>

<style>
</style>

