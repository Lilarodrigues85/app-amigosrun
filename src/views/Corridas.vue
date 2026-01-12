<template>
  <div class="corridas-view">
    <CorridasList />
  </div>
</template>

<script setup>
import CorridasList from '@/components/corridas/CorridasList.vue'
</script>

<style scoped>
.corridas-view {
  min-height: 100vh;
}
</style>