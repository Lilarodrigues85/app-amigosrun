<template>
  <div class="mapa-container">
    <div id="mapa" class="mapa"></div>
    
    <div class="mapa-controls">
      <button @click="centralizarUsuario" class="btn-localizacao">
        📍 Minha Localização
      </button>
      
      <button @click="toggleMarcadores" class="btn-toggle">
        {{ mostrarMarcadores ? '🏃 Ocultar Corridas' : '🏃 Mostrar Corridas' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { corridaService } from '@/services/corridaService'
import { localizacaoService } from '@/services/localizacaoService'

const mapa = ref(null)
const marcadorUsuario = ref(null)
const marcadoresCorridas = ref([])
const mostrarMarcadores = ref(true)
const posicaoUsuario = ref(null)

// Fix para ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

async function inicializarMapa() {
  // Posição padrão (São Paulo)
  const posicaoPadrao = [-23.5505, -46.6333]
  
  mapa.value = L.map('mapa').setView(posicaoPadrao, 13)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(mapa.value)
  
  // Tentar obter localização do usuário
  await obterLocalizacaoUsuario()
  
  // Carregar marcadores de corridas
  await carregarMarcadoresCorridas()
}

async function obterLocalizacaoUsuario() {
  try {
    const posicao = await localizacaoService.obterLocalizacaoAtual()
    posicaoUsuario.value = posicao
    
    // Centralizar mapa na posição do usuário
    mapa.value.setView([posicao.latitude, posicao.longitude], 15)
    
    // Adicionar marcador do usuário
    marcadorUsuario.value = L.marker([posicao.latitude, posicao.longitude])
      .addTo(mapa.value)
      .bindPopup('📍 Você está aqui')
      .openPopup()
  } catch (error) {
    console.log('Localização não disponível, usando posição padrão')
  }
}

async function carregarMarcadoresCorridas() {
  try {
    const corridas = await corridaService.getCorridas()
    
    corridas.forEach(corrida => {
      if (corrida.latitude && corrida.longitude) {
        const marcador = L.marker([corrida.latitude, corrida.longitude])
          .bindPopup(`
            <div class="popup-corrida">
              <h4>${corrida.titulo}</h4>
              <p>📅 ${new Date(corrida.data).toLocaleDateString('pt-BR')}</p>
              <p>📍 ${corrida.local}</p>
              ${corrida.valor ? `<p>💰 R$ ${corrida.valor}</p>` : ''}
            </div>
          `)
        
        if (mostrarMarcadores.value) {
          marcador.addTo(mapa.value)
        }
        
        marcadoresCorridas.value.push(marcador)
      }
    })
  } catch (error) {
    console.error('Erro ao carregar corridas:', error)
  }
}

function centralizarUsuario() {
  if (posicaoUsuario.value && mapa.value) {
    mapa.value.setView([posicaoUsuario.value.latitude, posicaoUsuario.value.longitude], 15)
    if (marcadorUsuario.value) {
      marcadorUsuario.value.openPopup()
    }
  }
}

function toggleMarcadores() {
  mostrarMarcadores.value = !mostrarMarcadores.value
  
  marcadoresCorridas.value.forEach(marcador => {
    if (mostrarMarcadores.value) {
      marcador.addTo(mapa.value)
    } else {
      mapa.value.removeLayer(marcador)
    }
  })
}

onMounted(() => {
  inicializarMapa()
})

onUnmounted(() => {
  if (mapa.value) {
    mapa.value.remove()
  }
})
</script>

<style scoped>
.mapa-container {
  position: relative;
  height: 100vh;
  width: 100%;
}

.mapa {
  height: 100%;
  width: 100%;
  border-radius: 1rem;
}

.mapa-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-localizacao,
.btn-toggle {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-localizacao:hover,
.btn-toggle:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
}

:deep(.popup-corrida) {
  min-width: 200px;
}

:deep(.popup-corrida h4) {
  margin: 0 0 0.5rem 0;
  color: #333;
}

:deep(.popup-corrida p) {
  margin: 0.25rem 0;
  font-size: 0.875rem;
  color: #666;
}
</style>