<template>
  <form @submit.prevent="handleRegister" class="auth-form">
    <h2>Cadastrar</h2>
    
    <div class="form-group">
      <input
        v-model="form.name"
        type="text"
        placeholder="Nome completo"
        required
        class="form-input"
      />
    </div>

    <div class="form-group">
      <input
        v-model="form.email"
        type="email"
        placeholder="Email"
        required
        class="form-input"
      />
    </div>

    <div class="form-group">
      <input
        v-model="form.password"
        type="password"
        placeholder="Senha (mín. 6 caracteres)"
        required
        minlength="6"
        class="form-input"
      />
    </div>

    <div class="form-group">
      <input
        v-model="form.confirmPassword"
        type="password"
        placeholder="Confirmar senha"
        required
        class="form-input"
      />
    </div>

    <button type="submit" :disabled="loading || !isValidForm" class="auth-button">
      {{ loading ? 'Cadastrando...' : 'Cadastrar' }}
    </button>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { register } = useAuth()
const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref('')

const isValidForm = computed(() => {
  return form.value.password === form.value.confirmPassword &&
         form.value.password.length >= 6 &&
         form.value.name.trim() &&
         form.value.email.trim()
})

const handleRegister = async () => {
  if (!isValidForm.value) {
    error.value = 'Verifique os dados informados'
    return
  }

  loading.value = true
  error.value = ''

  try {
    await register(form.value.email, form.value.password, form.value.name)
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
  gap: 1rem;
}

.auth-form h2 {
  text-align: center;
  color: white;
  margin-bottom: 1rem;
}

.form-input {
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 16px;
}

.form-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.auth-button {
  padding: 12px;
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.auth-button:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
}

.auth-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #ff6b6b;
  text-align: center;
  font-size: 14px;
}
</style>