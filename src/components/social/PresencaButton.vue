<template>
  <div class="presenca-button">
    <button 
      @click="togglePresenca"
      :class="buttonClass"
      :disabled="loading"
    >
      <span v-if="loading">...</span>
      <span v-else>{{ buttonText }}</span>
    </button>
    <span class="contador">{{ totalPresencas }} confirmados</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const confirmado = ref(false)
const totalPresencas = ref(0)
let unsubscribe = null

const buttonText = computed(() => {
  return confirmado.value ? 'Não vou' : 'Vou participar'
})

const buttonClass = computed(() => {
  return [
    'btn-presenca',
    confirmado.value ? 'btn-cancelar' : 'btn-confirmar'
  ]
})

async function togglePresenca() {
  if (!user.value) return
  
  loading.value = true
  try {
    if (confirmado.value) {
      await presencaService.cancelarPresenca(props.corridaId, user.value.uid)
      confirmado.value = false
    } else {
      await presencaService.confirmarPresenca(props.corridaId, user.value.uid)
      confirmado.value = true
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
    confirmado.value = await presencaService.verificarPresenca(props.corridaId, user.value.uid)
  } catch (error) {
    console.error('Erro ao verificar presença:', error)
  }
}

onMounted(() => {
  verificarPresencaInicial()
  
  unsubscribe = presencaService.onPresencasChange(props.corridaId, (snapshot) => {
    totalPresencas.value = snapshot.size
  })
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.presenca-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-presenca {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirmar {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.btn-confirmar:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.btn-cancelar {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.btn-cancelar:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
}

.contador {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>