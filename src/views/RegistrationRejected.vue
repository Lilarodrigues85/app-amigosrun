<template>
  <div class="rejected-page">
    <div class="rejected-card">
      <div class="icon-container">
        <div class="icon">❌</div>
      </div>
      
      <h1>Cadastro Não Aprovado</h1>
      
      <div class="message-box">
        <p class="main-message">
          Infelizmente seu cadastro não foi aprovado.
        </p>
        
        <div v-if="rejectionReason" class="reason-box">
          <strong>Motivo:</strong>
          <p>{{ rejectionReason }}</p>
        </div>
      </div>
      
      <div class="contact-box">
        <p>Para mais informações, entre em contato:</p>
        <a href="mailto:contato@amigosrun.com" class="contact-email">
          📧 contato@amigosrun.com
        </a>
      </div>
      
      <button @click="handleBack" class="back-button">
        Voltar
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
const rejectionReason = ref('')

onMounted(async () => {
  const user = auth.currentUser
  if (user) {
    const status = await authService.checkUserStatus(user.uid)
    if (status.rejectionReason) {
      rejectionReason.value = status.rejectionReason
    }
  }
})

const handleBack = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
  }
}
</script>

<style scoped>
.rejected-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  padding: 2rem;
}

.rejected-card {
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

.icon {
  font-size: 4rem;
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
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
  color: #dc3545;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.reason-box {
  background: #fff;
  border-left: 4px solid #dc3545;
  padding: 1rem;
  margin-top: 1rem;
  text-align: left;
}

.reason-box strong {
  color: #dc3545;
  display: block;
  margin-bottom: 0.5rem;
}

.reason-box p {
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.contact-box {
  background: #fff;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.contact-box p {
  color: #666;
  margin: 0 0 1rem 0;
}

.contact-email {
  display: inline-block;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.contact-email:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
}

.back-button {
  width: 100%;
  padding: 1rem;
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #5a6268;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

@media (max-width: 600px) {
  .rejected-card {
    padding: 2rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .icon {
    font-size: 3rem;
  }
}
</style>
