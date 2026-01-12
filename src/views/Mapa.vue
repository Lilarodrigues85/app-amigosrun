<template>
  <div class="mapa-view">
    <div class="mapa-header">
      <h2>Mapa de Corridas</h2>
      <div class="header-actions">
        <CompartilharLocalizacao />
      </div>
    </div>
    
    <div class="mapa-content">
      <MapaInterativo />
    </div>
  </div>
</template>

<script setup>
import MapaInterativo from '@/components/mapa/MapaInterativo.vue'
import CompartilharLocalizacao from '@/components/mapa/CompartilharLocalizacao.vue'
</script>

<style scoped>
.mapa-view {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  padding: 2rem;
}

.mapa-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.mapa-header h2 {
  color: white;
  margin: 0;
}

.header-actions {
  max-width: 300px;
}

.mapa-content {
  max-width: 1200px;
  margin: 0 auto;
  height: calc(100vh - 200px);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .mapa-view {
    padding: 1rem;
  }
  
  .mapa-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .header-actions {
    max-width: 100%;
  }
  
  .mapa-content {
    height: calc(100vh - 250px);
  }
}
</style>