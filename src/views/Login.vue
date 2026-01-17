<template>
  <div class="login-page">
    <div class="login-container">
      <!-- Hero Section -->
      <div class="hero-content">
        <img src="/amigos_run_logo.png" alt="Amigos Run" class="hero-logo">
        <h1 class="hero-title">Amigos Run</h1>
        <p class="hero-subtitle">Conecte-se com corredores, descubra eventos e compartilhe experiências</p>
      </div>

      <!-- Auth Section -->
      <div class="auth-container">
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
  background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-container {
  display: flex;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  width: 100%;
}

.hero-content {
  flex: 1;
  text-align: center;
  color: white;
}

.hero-logo {
  width: 150px;
  height: 150px;
  margin-bottom: 2rem;
  filter: drop-shadow(0 10px 30px rgba(0,0,0,0.5));
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5);
  background: linear-gradient(135deg, #fff 0%, #e0e0e0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.25rem;
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.auth-container {
  flex: 1;
  width: 100%;
  max-width: 450px;
}

.auth-card {
  background: rgba(255,255,255,0.15);
  padding: 2.5rem;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.3);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  transition: all 0.3s ease;
}

.auth-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 70px rgba(0,0,0,0.4);
}

.auth-tabs {
  display: flex;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(5px);
  margin: -2.5rem -2.5rem 2rem -2.5rem;
  padding: 0;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 1.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: rgba(255,255,255,0.7);
  position: relative;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: white;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-button.active {
  background: rgba(255,255,255,0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.tab-button.active::after {
  transform: scaleX(1);
}

.tab-button:hover:not(.active) {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.9);
}

@media (max-width: 1024px) {
  .login-container {
    flex-direction: column;
    gap: 2rem;
  }

  .hero-logo {
    width: 100px;
    height: 100px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .auth-card {
    padding: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 0.9rem;
  }

  .auth-card {
    padding: 1.5rem;
  }

  .tab-button {
    padding: 1rem;
    font-size: 0.9rem;
  }
}
</style>