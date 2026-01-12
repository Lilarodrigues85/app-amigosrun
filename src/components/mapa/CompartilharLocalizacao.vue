<template>
  <div class="compartilhar-localizacao">
    <div class="status-container">
      <div v-if="compartilhando" class="status-ativo">
        <span class="indicator"></span>
        <span>Compartilhando localização</span>
      </div>
      
      <div v-else class="status-inativo">
        <span>Localização não compartilhada</span>
      </div>
    </div>
    
    <div class="controles">
      <button 
        @click="toggleCompartilhamento"
        :class="buttonClass"
        :disabled="loading"
      >
        <span v-if="loading">...</span>
        <span v-else>{{ buttonText }}</span>
      </button>
      
      <div v-if="ultimaAtualizacao" class="ultima-atualizacao">
        Última atualização: {{ formatTime(ultimaAtualizacao) }}
      </div>
    </div>
    
    <div v-if="erro" class="erro">
      {{ erro }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { localizacaoService } from '@/services/localizacaoService'

const props = defineProps({
  corridaId: {
    type: String,
    default: null
  }
})

const { user } = useAuth()
const compartilhando = ref(false)
const loading = ref(false)
const erro = ref(null)
const ultimaAtualizacao = ref(null)
let intervalId = null

const buttonText = computed(() => {
  return compartilhando.value ? 'Parar Compartilhamento' : 'Compartilhar Localização'
})

const buttonClass = computed(() => {
  return [
    'btn-compartilhar',
    compartilhando.value ? 'btn-parar' : 'btn-iniciar'
  ]
})

async function toggleCompartilhamento() {
  if (!user.value) return
  
  loading.value = true
  erro.value = null
  
  try {
    if (compartilhando.value) {
      pararCompartilhamento()
    } else {
      await iniciarCompartilhamento()
    }
  } catch (error) {
    erro.value = error.message
  } finally {
    loading.value = false
  }
}

async function iniciarCompartilhamento() {
  try {
    // Primeira atualização
    await atualizarLocalizacao()
    
    // Configurar atualizações periódicas (a cada 30 segundos)
    intervalId = setInterval(atualizarLocalizacao, 30000)
    
    compartilhando.value = true
  } catch (error) {
    throw new Error('Erro ao iniciar compartilhamento: ' + error.message)
  }
}

function pararCompartilhamento() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  
  compartilhando.value = false
  ultimaAtualizacao.value = null
}

async function atualizarLocalizacao() {
  try {
    await localizacaoService.compartilharLocalizacao(user.value.uid, props.corridaId)
    ultimaAtualizacao.value = new Date()
    erro.value = null
  } catch (error) {
    console.error('Erro ao atualizar localização:', error)
    erro.value = 'Erro ao atualizar localização'
  }
}

function formatTime(date) {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // Verificar se já estava compartilhando (persistir estado)
  const estadoSalvo = localStorage.getItem('compartilhando-localizacao')
  if (estadoSalvo === 'true') {
    iniciarCompartilhamento()
  }
})

onUnmounted(() => {
  pararCompartilhamento()
  localStorage.setItem('compartilhando-localizacao', compartilhando.value.toString())
})
</script>

<style scoped>
.compartilhar-localizacao {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-container {
  margin-bottom: 1rem;
}

.status-ativo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 500;
}

.indicator {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.status-inativo {
  color: rgba(255, 255, 255, 0.7);
}

.controles {
  text-align: center;
}

.btn-compartilhar {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 0.75rem;
}

.btn-iniciar {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-iniciar:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.btn-parar {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-parar:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.ultima-atualizacao {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.erro {
  color: #ef4444;
  font-size: 0.875rem;
  text-align: center;
  margin-top: 0.5rem;
}
</style>