<template>
  <transition name="fade">
    <div v-if="show" class="session-warning-overlay">
      <div class="session-warning-modal">
        <div class="warning-icon">⏰</div>
        <h3>Sessão Expirando</h3>
        <p>Sua sessão expirará em <strong>5 minutos</strong> por inatividade.</p>
        <p class="warning-subtext">Deseja continuar conectado?</p>
        
        <div class="warning-actions">
          <button @click="handleLogout" class="btn-logout">
            Sair Agora
          </button>
          <button @click="handleExtend" class="btn-extend">
            Continuar Conectado
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['extend', 'logout'])

const handleExtend = () => {
  emit('extend')
}

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
.session-warning-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.session-warning-modal {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 10px 30px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.session-warning-modal h3 {
  margin: 0 0 1rem 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #2d3748;
}

.session-warning-modal p {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
}

.session-warning-modal p strong {
  color: #e53e3e;
  font-weight: 700;
}

.warning-subtext {
  font-size: 0.9375rem;
  color: #718096;
  margin-bottom: 2rem !important;
}

.warning-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-logout,
.btn-extend {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-logout {
  background: rgba(0, 0, 0, 0.05);
  color: #4a5568;
}

.btn-logout:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.btn-extend {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-extend:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .session-warning-modal {
    padding: 2rem;
  }
  
  .warning-actions {
    flex-direction: column;
  }
  
  .btn-logout,
  .btn-extend {
    width: 100%;
  }
}
</style>
