<template>
  <router-view v-slot="{ Component, route }">
    <template v-if="route.meta.layout === 'blank'">
      <component :is="Component" />
    </template>
    <template v-else>
      <AppLayout>
        <component :is="Component" />
      </AppLayout>
    </template>
  </router-view>
  <NotificacoesVisuais />
</template>

<script setup>
import AppLayout from './components/layout/AppLayout.vue'
import NotificacoesVisuais from './components/social/NotificacoesVisuais.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
</style>