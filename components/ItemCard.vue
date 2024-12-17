

<template>
  <div
    class="boss-card inline-block text-black border-4 border-black p-2 rounded-md max-w-[8rem] text-center bg-gray-100 shadow-[4px_4px_0_0_rgba(0,0,0,1)]  white-space-nowrap hover:border-[5px] hover:shadow-lg overflow-x-auto"
  >
    <h3 class="m-0 text-sm font-bold truncate">{{ item.name }}</h3>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  item: {
    type: Object,
    required: true,
    default: () => ({
      name: 'New Item'
    }),
  },
})
</script>

<style scoped>

</style>
