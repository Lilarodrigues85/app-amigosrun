<template>
  <!-- Loading screen enquanto Firebase inicializa -->
  <div v-if="appLoading" class="app-loading">
    <div class="loading-content">
      <img src="/amigos_run_logo.png" alt="Amigos Run" class="loading-logo">
      <h2>Amigos Run</h2>
      <div class="loading-spinner"></div>
      <p>Carregando...</p>
    </div>
  </div>

  <!-- App principal -->
  <router-view v-else v-slot="{ Component, route }">
    <template v-if="route.meta.layout === 'blank'">
      <component :is="Component" />
    </template>
    <template v-else>
      <AppLayout>
        <component :is="Component" />
      </AppLayout>
    </template>
  </router-view>
  
  <NotificacoesVisuais v-if="!appLoading" />
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import AppLayout from './components/layout/AppLayout.vue'
import NotificacoesVisuais from './components/social/NotificacoesVisuais.vue'

const { loading, isInitialized } = useAuth()

// Mostra loading até Firebase inicializar
const appLoading = computed(() => loading.value || !isInitialized.value)
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

.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-logo {
  width: 120px;
  height: 120px;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.loading-content h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  font-weight: 700;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-content p {
  font-size: 1rem;
  opacity: 0.8;
}
</style>