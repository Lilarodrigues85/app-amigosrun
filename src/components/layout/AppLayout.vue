<template>
  <div class="app-layout">
    <AppHeader />
    <main class="main-content">
      <slot />
    </main>
    
    <!-- Modal de Aviso de Sessão -->
    <SessionTimeoutWarning 
      :show="showWarning" 
      @extend="extendSession"
      @logout="logout"
    />
  </div>
</template>

<script setup>
import AppHeader from './AppHeader.vue'
import SessionTimeoutWarning from '@/components/common/SessionTimeoutWarning.vue'
import { useSessionTimeout } from '@/composables/useSessionTimeout'

// Configurar timeout de 60 minutos (1 hora)
const { showWarning, extendSession, logout } = useSessionTimeout(60)
</script>

<style scoped>
.app-layout {
  min-height: 100vh;
  background-image: url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}

.main-content {
  padding: 1rem 2rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 60px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
}
</style>