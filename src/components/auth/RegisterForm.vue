<template>
  <form @submit.prevent="handleRegister" class="register-form">
    <input 
      v-model="email" 
      type="email" 
      placeholder="Email" 
      required 
    />
    <input 
      v-model="password" 
      type="password" 
      placeholder="Senha (mín. 6 caracteres)" 
      minlength="6"
      required 
    />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">Cadastro realizado! Verifique seu email.</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { authService } from '@/services/authService'

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleRegister = async () => {
  loading.value = true
  error.value = ''
  success.value = false
  
  try {
    await authService.register(email.value, password.value)
    success.value = true
    email.value = ''
    password.value = ''
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-form { 
  padding: 2rem;
}

.register-form input { 
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.register-form input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.register-form button { 
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

.register-form button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.register-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.success { 
  color: #27ae60;
  font-size: 14px;
  margin-top: 0.5rem;
  padding: 8px;
  background: #f0fff4;
  border-radius: 4px;
  border-left: 4px solid #27ae60;
}
</style>