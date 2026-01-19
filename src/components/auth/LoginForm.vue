<template>
  <form @submit.prevent="handleLogin" class="auth-form">
    <h2>Bem-vindo de volta!</h2>
    <p class="form-subtitle">Entre para continuar sua jornada</p>
    
    <div class="form-group">
      <label class="form-label">Email</label>
      <input
        v-model="form.email"
        type="email"
        placeholder="seu@email.com"
        required
        class="form-input"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Senha</label>
      <input
        v-model="form.password"
        type="password"
        placeholder="••••••••"
        required
        class="form-input"
      />
    </div>

    <button type="submit" :disabled="loading" class="auth-button">
      <span v-if="!loading">Entrar</span>
      <span v-else class="loading-spinner">Entrando...</span>
    </button>

    <div class="divider">
      <span>ou</span>
    </div>

    <button type="button" @click="handleGoogleLogin" :disabled="loading" class="google-button">
      <svg class="google-icon" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      Continuar com Google
    </button>

    <div v-if="error" class="error-message">
      ⚠️ {{ error }}
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { login, loginWithGoogle } = useAuth()
const router = useRouter()

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await login(form.value.email, form.value.password)
    // O router guard vai redirecionar automaticamente
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleGoogleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await loginWithGoogle()
    // O router guard vai redirecionar automaticamente
    router.push('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.auth-form h2 {
  text-align: center;
  color: white;
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.form-subtitle {
  text-align: center;
  color: rgba(255,255,255,0.8);
  margin: -0.5rem 0 0 0;
  font-size: 0.9rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-label {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.2;
}

.form-input {
  padding: 14px 16px;
  border: 2px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 16px;
  transition: all 0.3s ease;
  height: 48px;
  box-sizing: border-box;
  line-height: 1.5;
}

.form-input:focus {
  outline: none;
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.15);
  transform: translateY(-2px);
}

.form-input::placeholder {
  color: rgba(255,255,255,0.5);
}

.auth-button {
  padding: 14px;
  background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%);
  color: white;
  border: 2px solid rgba(255,255,255,0.4);
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 0.5rem;
}

.auth-button:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.3) 100%);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.auth-button:active:not(:disabled) {
  transform: translateY(0);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: rgba(255,255,255,0.6);
  margin: 0.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.divider span {
  padding: 0 1rem;
  font-size: 0.9rem;
}

.google-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  background: white;
  color: #333;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.google-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.25);
}

.google-button:active:not(:disabled) {
  transform: translateY(0);
}

.google-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
}

.loading-spinner {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.error-message {
  background: rgba(255, 107, 107, 0.2);
  color: #ffcccb;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-size: 14px;
  border: 1px solid rgba(255, 107, 107, 0.3);
}
</style>