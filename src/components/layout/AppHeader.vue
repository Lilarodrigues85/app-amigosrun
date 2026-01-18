<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <img src="/amigos_run_logo.png" alt="Amigos Run" class="logo-img">
      </div>

      <!-- Navigation Desktop -->
      <nav class="nav-desktop" v-if="showNavigation">
        <router-link to="/" class="nav-link">Início</router-link>
        <router-link to="/corridas" class="nav-link">Corridas</router-link>
        <router-link to="/mapa" class="nav-link">Mapa</router-link>
        <router-link to="/perfil" class="nav-link">Perfil</router-link>
      </nav>

      <!-- Navigation limitada para perfil incompleto -->
      <nav class="nav-desktop" v-else-if="user">
        <router-link to="/perfil" class="nav-link nav-link-profile">Complete seu Perfil</router-link>
      </nav>

      <!-- User Menu -->
      <div class="user-menu" v-if="user && showNavigation">
        <!-- Estatísticas -->
        <div class="user-stats">
          <div class="stat-item">
            <span class="stat-icon">🏃</span>
            <div class="stat-content">
              <span class="stat-value">{{ userStats.totalRuns }}</span>
              <span class="stat-label">Corridas</span>
            </div>
          </div>
          
          <div class="stat-item">
            <span class="stat-icon">📏</span>
            <div class="stat-content">
              <span class="stat-value">{{ userStats.totalDistance }}km</span>
              <span class="stat-label">Total</span>
            </div>
          </div>
          
          <div class="stat-item" v-if="userStats.averagePace">
            <span class="stat-icon">⏱️</span>
            <div class="stat-content">
              <span class="stat-value">{{ userStats.averagePace }}</span>
              <span class="stat-label">Pace</span>
            </div>
          </div>
        </div>
        
        <!-- Avatar e Botão -->
        <div class="user-actions">
          <img :src="user.photoURL || '/default-avatar.png'" :alt="user.displayName" class="avatar">
          <button @click="logout" class="logout-btn">Sair</button>
        </div>
      </div>
      
      <!-- User Menu Simples (perfil incompleto) -->
      <div class="user-menu" v-else-if="user">
        <img :src="user.photoURL || '/default-avatar.png'" :alt="user.displayName" class="avatar">
        <button @click="logout" class="logout-btn">Sair</button>
      </div>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu" class="mobile-menu-btn">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <nav v-if="showMobileMenu && showNavigation" class="nav-mobile">
      <router-link to="/" class="nav-link-mobile" @click="closeMobileMenu">Início</router-link>
      <router-link to="/corridas" class="nav-link-mobile" @click="closeMobileMenu">Corridas</router-link>
      <router-link to="/mapa" class="nav-link-mobile" @click="closeMobileMenu">Mapa</router-link>
      <router-link to="/perfil" class="nav-link-mobile" @click="closeMobileMenu">Perfil</router-link>
      <button @click="logout" class="logout-btn-mobile">Sair</button>
    </nav>

    <!-- Mobile Navigation limitada -->
    <nav v-else-if="showMobileMenu && user" class="nav-mobile">
      <router-link to="/perfil" class="nav-link-mobile nav-link-profile" @click="closeMobileMenu">Complete seu Perfil</router-link>
      <button @click="logout" class="logout-btn-mobile">Sair</button>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'
import { userService } from '@/services/userService'

const { user, logout: authLogout } = useAuth()
const router = useRouter()
const route = useRoute()
const showMobileMenu = ref(false)
const profileComplete = ref(false)

// Estatísticas do usuário
const userStats = ref({
  totalRuns: 0,
  totalDistance: 0,
  averagePace: '',
  friends: 0
})

const showNavigation = computed(() => profileComplete.value)

const checkProfile = async () => {
  console.log('🔵 [AppHeader] Verificando perfil...')
  
  if (!user.value) {
    console.log('⚠️ [AppHeader] Nenhum usuário autenticado')
    profileComplete.value = false
    return
  }
  
  try {
    console.log('🔄 [AppHeader] Buscando perfil para:', user.value.uid)
    const profile = await userService.getProfile(user.value.uid)
    
    console.log('📦 [AppHeader] Perfil retornado:', profile)
    
    const isComplete = profile && profile.name && profile.name.trim() !== ''
    profileComplete.value = isComplete
    
    // Carregar estatísticas
    if (profile && profile.stats) {
      userStats.value = {
        totalRuns: profile.stats.totalRuns || 0,
        totalDistance: profile.stats.totalDistance || 0,
        averagePace: profile.stats.averagePace || '',
        friends: profile.stats.friends || 0
      }
      console.log('📊 [AppHeader] Estatísticas carregadas:', userStats.value)
    }
    
    console.log(isComplete ? '✅ [AppHeader] Perfil completo' : '⚠️ [AppHeader] Perfil incompleto')
  } catch (error) {
    console.error('❌ [AppHeader] Erro ao verificar perfil:', error)
    profileComplete.value = false
  }
}

// Handler para o evento de perfil atualizado
const handleProfileUpdated = () => {
  console.log('📢 [AppHeader] Evento profile-updated recebido, recarregando perfil...')
  checkProfile()
}

onMounted(() => {
  console.log('🔵 [AppHeader] Componente montado')
  checkProfile()
  
  // Escutar evento de perfil atualizado
  window.addEventListener('profile-updated', handleProfileUpdated)
})

onUnmounted(() => {
  console.log('🔵 [AppHeader] Componente desmontado, removendo listeners')
  window.removeEventListener('profile-updated', handleProfileUpdated)
})

// Observa mudanças no usuário
watch(user, (newUser) => {
  console.log('🔵 [AppHeader] Usuário mudou:', newUser?.uid)
  if (newUser) {
    checkProfile()
  } else {
    profileComplete.value = false
  }
})

// Observa mudanças na rota para recarregar o perfil
watch(() => route.path, (newPath) => {
  console.log('🔵 [AppHeader] Rota mudou para:', newPath)
  if (user.value) {
    checkProfile()
  }
})

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const logout = async () => {
  await authLogout()
  router.push('/login')
  closeMobileMenu()
}
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.logo-img {
  height: 45px;
  width: auto;
}

.logo h1 {
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.nav-desktop {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.nav-link-profile {
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.3) 100%);
  border: 2px solid rgba(255, 193, 7, 0.5);
  animation: pulse-profile 2s ease-in-out infinite;
}

@keyframes pulse-profile {
  0%, 100% { 
    box-shadow: 0 0 0 0 rgba(255, 193, 7, 0.4);
  }
  50% { 
    box-shadow: 0 0 0 10px rgba(255, 193, 7, 0);
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.user-stats {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-icon {
  font-size: 1.25rem;
  opacity: 0.9;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.stat-value {
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.625rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.avatar:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-menu-btn span {
  width: 25px;
  height: 3px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nav-mobile {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.nav-link-mobile {
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link-mobile:hover,
.nav-link-mobile.router-link-active {
  background: rgba(255, 255, 255, 0.2);
}

.logout-btn-mobile {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.logout-btn-mobile:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .nav-desktop,
  .user-menu {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .header-container {
    padding: 1rem;
  }
}

@media (max-width: 1024px) {
  .user-stats {
    display: none;
  }
  
  .user-menu {
    gap: 1rem;
  }
}
</style>