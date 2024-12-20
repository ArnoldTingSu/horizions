<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';
import ItemCard from '~/components/ItemCard.vue';


const items = ref([]);
const { $supabase } = useNuxtApp();

const fetchItems = async () => {
  const { data, error } = await $supabase.from('items').select('*');
  if (error) {
    console.error('Error fetching item:', error);
  } else {
    items.value = data;
    console.log('Fetched item:', data);
  }
};

onMounted(fetchItems);
</script>

<template>
  <div>
    <h1>Items</h1>
    <div class="">
      <ItemCard
        class=""
        v-for="item in items"
        :key="item.name"
        :item="item"
      />
    </div>
  </div>
</template>

<style>
</style>

