<template>
  <div class="pending-approval-page">
    <div class="pending-card">
      <div class="icon-container">
        <div class="hourglass">⏳</div>
      </div>
      
      <h1>Aguardando Aprovação</h1>
      
      <div class="message-box">
        <p class="main-message">Seu cadastro foi recebido!</p>
        <p class="sub-message">
          Um administrador irá revisar sua solicitação em breve.
          Você receberá um email quando for aprovado.
        </p>
      </div>
      
      <div class="info-box">
        <div class="info-item">
          <span class="info-label">Email:</span>
          <span class="info-value">{{ userEmail }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">Solicitado em:</span>
          <span class="info-value">{{ formatDate(requestedAt) }}</span>
        </div>
      </div>
      
      <button @click="handleLogout" class="logout-button">
        Sair
      </button>
      
      <button @click="checkStatus" class="refresh-button" :disabled="checking">
        <span v-if="!checking">🔄 Verificar Status</span>
        <span v-else>Verificando...</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/config'
import { authService } from '@/services/authService'
import { signOut } from 'firebase/auth'

const router = useRouter()
const userEmail = ref('')
const requestedAt = ref(null)
const checking = ref(false)

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    userEmail.value = user.email
    
    // Buscar data de solicitação
    const status = await authService.checkUserStatus(user.uid)
    if (status.requestedAt) {
      requestedAt.value = status.requestedAt.toDate()
    }
  }
})

const formatDate = (date) => {
  if (!date) return 'Agora mesmo'
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}

const checkStatus = async () => {
  checking.value = true
  try {
    const user = auth.currentUser
    if (user) {
      const status = await authService.checkUserStatus(user.uid)
      
      if (status.status === 'approved') {
        router.push('/')
      } else if (status.status === 'rejected') {
        router.push('/registration-rejected')
      }
    }
  } catch (error) {
    console.error('Erro ao verificar status:', error)
  } finally {
    checking.value = false
  }
}
</script>

<style scoped>
.pending-approval-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.pending-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.icon-container {
  margin-bottom: 2rem;
}

.hourglass {
  font-size: 4rem;
  animation: rotate 2s ease-in-out infinite;
}

@keyframes rotate {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
}

h1 {
  color: #333;
  margin: 0 0 2rem 0;
  font-size: 2rem;
  font-weight: 700;
}

.message-box {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.main-message {
  color: #667eea;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.sub-message {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.info-box {
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
}

.info-item:not(:last-child) {
  border-bottom: 1px solid #e9ecef;
}

.info-label {
  color: #666;
  font-weight: 500;
}

.info-value {
  color: #333;
  font-weight: 600;
}

.logout-button {
  width: 100%;
  padding: 1rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.logout-button:hover {
  background: #c82333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.refresh-button {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.refresh-button:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.refresh-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .pending-card {
    padding: 2rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .hourglass {
    font-size: 3rem;
  }
}
</style>
