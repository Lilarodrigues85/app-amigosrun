<template>
  <div class="login-page">
    <div class="login-container">
      <div class="auth-card">
        <div class="auth-tabs">
          <button 
            @click="activeTab = 'login'" 
            :class="{ active: activeTab === 'login' }"
            class="tab-button"
          >
            Entrar
          </button>
          <button 
            @click="activeTab = 'register'" 
            :class="{ active: activeTab === 'register' }"
            class="tab-button"
          >
            Cadastrar
          </button>
        </div>
        
        <LoginForm v-if="activeTab === 'login'" />
        <RegisterForm v-if="activeTab === 'register'" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const activeTab = ref('login')
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('@/assets/images/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.auth-card {
  background: rgba(255,255,255,0.1);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.auth-tabs {
  display: flex;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
  margin: -2rem -2rem 2rem -2rem;
  padding: 0;
}

.tab-button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
  color: rgba(255,255,255,0.8);
}

.tab-button.active {
  background: rgba(255,255,255,0.15);
  color: white;
  backdrop-filter: blur(10px);
}

@media (max-width: 768px) {
  .login-page {
    padding: 1rem;
  }
}
</style>