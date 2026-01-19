<template>
  <div class="presenca-button">
    <div class="presenca-options">
      <div class="presenca-col">
        <button 
          @click="setPresenca('sim')"
          :class="['btn-presenca', 'btn-sim', { active: status === 'sim' }]"
          :disabled="loading"
        >
          <span v-if="loading && status === 'sim'">...</span>
          <span v-else>Vou</span>
        </button>
        <span class="contador-item">
          ✓{{ contadores.sim }}
        </span>
      </div>
      
      <div class="presenca-col">
        <button 
          @click="setPresenca('nao')"
          :class="['btn-presenca', 'btn-nao', { active: status === 'nao' }]"
          :disabled="loading"
        >
          <span v-if="loading && status === 'nao'">...</span>
          <span v-else>Não vou</span>
        </button>
        <span class="contador-item">
          ✗{{ contadores.nao }}
        </span>
      </div>
      
      <div class="presenca-col">
        <button 
          @click="setPresenca('talvez')"
          :class="['btn-presenca', 'btn-talvez', { active: status === 'talvez' }]"
          :disabled="loading"
        >
          <span v-if="loading && status === 'talvez'">...</span>
          <span v-else>Talvez</span>
        </button>
        <span class="contador-item">
          ?{{ contadores.talvez }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { presencaService } from '@/services/presencaService'

const props = defineProps({
  corridaId: {
    type: String,
    required: true
  }
})

const { user } = useAuth()
const loading = ref(false)
const status = ref(null) // null, 'sim', 'nao', 'talvez'
const contadores = ref({
  sim: 0,
  nao: 0,
  talvez: 0
})
let unsubscribe = null

async function setPresenca(novoStatus) {
  if (!user.value) return
  
  loading.value = true
  try {
    if (status.value === novoStatus) {
      // Se clicar no mesmo botão, remove a presença
      await presencaService.cancelarPresenca(props.corridaId, user.value.uid)
      status.value = null
    } else {
      // Define novo status
      await presencaService.setPresenca(props.corridaId, user.value.uid, novoStatus)
      status.value = novoStatus
    }
  } catch (error) {
    console.error('Erro ao alterar presença:', error)
  } finally {
    loading.value = false
  }
}

async function verificarPresencaInicial() {
  if (!user.value) return
  
  try {
    status.value = await presencaService.getPresencaStatus(props.corridaId, user.value.uid)
  } catch (error) {
    console.error('Erro ao verificar presença:', error)
  }
}

onMounted(() => {
  verificarPresencaInicial()
  
  unsubscribe = presencaService.onPresencasChange(props.corridaId, (snapshot) => {
    const counts = { sim: 0, nao: 0, talvez: 0 }
    snapshot.forEach(doc => {
      const data = doc.data()
      if (data.status && counts.hasOwnProperty(data.status)) {
        counts[data.status]++
      }
    })
    contadores.value = counts
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.presenca-button {
  width: 100%;
}

.presenca-options {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  align-items: stretch;
}

.presenca-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.375rem;
  flex: 1;
  max-width: 100px;
}

.btn-presenca {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 2px solid transparent;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
}

.btn-presenca:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-presenca:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-sim.active {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-nao.active {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border-color: #ef4444;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-talvez.active {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
  border-color: #f59e0b;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
}

.contador-item {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: rgba(255,255,255,0.9);
  font-weight: 600;
  min-width: 30px;
  padding: 0.125rem 0.375rem;
  background: rgba(0,0,0,0.2);
  border-radius: 4px;
}

@media (max-width: 768px) {
  .presenca-options {
    gap: 0.375rem;
  }
  
  .presenca-col {
    max-width: 85px;
    gap: 0.25rem;
  }
  
  .btn-presenca {
    font-size: 0.75rem;
    padding: 0.4rem 0.5rem;
  }
  
  .contador-item {
    font-size: 0.7rem;
    min-width: 25px;
    padding: 0.1rem 0.25rem;
  }
}
</style>