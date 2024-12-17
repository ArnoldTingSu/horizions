

<template>
  <div
    class="raider-card inline-block text-black border-4 border-black p-2 rounded-md max-w-[8rem] text-center bg-gray-100 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-transform hover:translate-x-1 hover:border-[5px] hover:shadow-lg"
  >
    <a href="/raider/{{raider.name}}"><h3 class="m-0 text-sm font-bold truncate">{{ raider.name }}</h3></a>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  raider: {
    type: Object,
    required: true,
    default: () => ({
      name: 'New Raider'
    }),
  },
})
</script>

<style scoped>

</style>
