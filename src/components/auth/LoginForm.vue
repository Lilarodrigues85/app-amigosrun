<template>
  <form @submit.prevent="handleLogin" class="login-form">
    <input 
      v-model="email" 
      type="email" 
      placeholder="Email" 
      required 
    />
    <input 
      v-model="password" 
      type="password" 
      placeholder="Senha" 
      required 
    />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Entrando...' : 'Entrar' }}
    </button>
    
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  console.log('🔵 LOGIN: Iniciando processo de login')
  loading.value = true
  error.value = ''
  
  try {
    console.log('🔵 LOGIN: Chamando authService.login')
    const result = await authService.login(email.value, password.value)
    console.log('✅ LOGIN: Sucesso', result)
    
    console.log('🔵 LOGIN: Redirecionando para /profile')
    window.location.href = '/profile'
    console.log('✅ LOGIN: Redirecionamento executado')
  } catch (err) {
    console.error('❌ LOGIN: Erro', err)
    error.value = err.message
  } finally {
    console.log('🔵 LOGIN: Finalizando loading')
    loading.value = false
  }
}
</script>

<style scoped>
.login-form { 
  padding: 2rem;
}

.login-form input { 
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.login-form input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.login-form button { 
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.login-form button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.login-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-btn {
  background: white !important;
  color: #333 !important;
  border: 2px solid #e1e5e9 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.google-btn:hover:not(:disabled) {
  background: #f8f9fa !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
}

.divider {
  margin: 1.5rem 0;
  height: 1px;
  background: #e1e5e9;
}

.error { 
  color: #e74c3c;
  font-size: 14px;
  margin-top: 0.5rem;
  padding: 8px;
  background: #fdf2f2;
  border-radius: 4px;
  border-left: 4px solid #e74c3c;
}
</style>