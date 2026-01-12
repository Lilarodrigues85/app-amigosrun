<template>
  <header class="app-header">
    <div class="header-container">
      <!-- Logo -->
      <div class="logo">
        <img src="/amigos_run_logo.png" alt="Amigos Run" class="logo-img">
      </div>

      <!-- Navigation Desktop -->
      <nav class="nav-desktop">
        <router-link to="/" class="nav-link">Início</router-link>
        <router-link to="/corridas" class="nav-link">Corridas</router-link>
        <router-link to="/perfil" class="nav-link">Perfil</router-link>
      </nav>

      <!-- User Menu -->
      <div class="user-menu" v-if="user">
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
    <nav v-if="showMobileMenu" class="nav-mobile">
      <router-link to="/" class="nav-link-mobile" @click="closeMobileMenu">Início</router-link>
      <router-link to="/corridas" class="nav-link-mobile" @click="closeMobileMenu">Corridas</router-link>
      <router-link to="/perfil" class="nav-link-mobile" @click="closeMobileMenu">Perfil</router-link>
      <button @click="logout" class="logout-btn-mobile">Sair</button>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { user, logout: authLogout } = useAuth()
const router = useRouter()
const showMobileMenu = ref(false)

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
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-img {
  height: 40px;
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
  padding: 0.5rem 1rem;
  border-radius: 8px;
}

.nav-link:hover,
.nav-link.router-link-active {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
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
</style>