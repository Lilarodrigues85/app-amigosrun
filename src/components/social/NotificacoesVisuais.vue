<template>
  <div class="notificacoes" v-if="notificacoes.length > 0">
    <div 
      v-for="notif in notificacoes" 
      :key="notif.id"
      :class="['notificacao', `notif-${notif.tipo}`]"
      @click="marcarComoLida(notif.id)"
    >
      <div class="notif-icon">
        <span v-if="notif.tipo === 'confirmacao'">✅</span>
        <span v-else-if="notif.tipo === 'nova-corrida'">🏃</span>
        <span v-else>📢</span>
      </div>
      
      <div class="notif-content">
        <p class="notif-text">{{ notif.mensagem }}</p>
        <span class="notif-time">{{ formatTime(notif.timestamp) }}</span>
      </div>
      
      <button class="notif-close" @click.stop="removerNotificacao(notif.id)">
        ×
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { notificacaoService } from '@/services/notificacaoService'

const { user } = useAuth()
const notificacoes = ref([])
let unsubscribe = null

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return 'agora'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
  return date.toLocaleDateString('pt-BR')
}

async function marcarComoLida(notifId) {
  try {
    await notificacaoService.marcarComoLida(notifId)
  } catch (error) {
    console.error('Erro ao marcar notificação:', error)
  }
}

async function removerNotificacao(notifId) {
  try {
    await notificacaoService.removerNotificacao(notifId)
  } catch (error) {
    console.error('Erro ao remover notificação:', error)
  }
}

onMounted(() => {
  if (user.value) {
    unsubscribe = notificacaoService.onNotificacoesChange(user.value.uid, (novasNotifs) => {
      notificacoes.value = novasNotifs.filter(n => !n.lida)
    })
  }
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})
</script>

<style scoped>
.notificacoes {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  max-width: 300px;
}

.notificacao {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  border-left: 4px solid #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.notificacao:hover {
  transform: translateX(-4px);
}

.notif-confirmacao {
  border-left-color: #10b981;
}

.notif-nova-corrida {
  border-left-color: #f59e0b;
}

.notif-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.notif-content {
  flex: 1;
}

.notif-text {
  margin: 0 0 0.25rem 0;
  font-size: 0.875rem;
  color: #374151;
  line-height: 1.4;
}

.notif-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.notif-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #9ca3af;
  cursor: pointer;
  padding: 0;
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.notif-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
}
</style>