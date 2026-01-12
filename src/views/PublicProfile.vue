<template>
  <div class="public-profile">
    <div v-if="loading" class="loading">Carregando perfil...</div>
    
    <div v-else-if="error" class="error">{{ error }}</div>
    
    <div v-else-if="profile" class="profile-card">
      <div class="profile-header">
        <img :src="profile.photoURL" :alt="profile.name" class="avatar" />
        <h1>{{ profile.name }}</h1>
        <p v-if="profile.bio" class="bio">{{ profile.bio }}</p>
      </div>
      
      <div class="profile-stats">
        <div class="stat">
          <span class="label">Meta:</span>
          <span class="value">{{ profile.goal || 'Não informado' }}</span>
        </div>
        <div v-if="profile.showPersonalInfo" class="personal-info">
          <div class="stat">
            <span class="label">Peso:</span>
            <span class="value">{{ profile.weight }}kg</span>
          </div>
          <div class="stat">
            <span class="label">Altura:</span>
            <span class="value">{{ profile.height }}cm</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { userService } from '@/services/userService'

const route = useRoute()
const profile = ref(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const userId = route.params.id
    profile.value = await userService.getPublicProfile(userId)
  } catch (err) {
    error.value = 'Perfil não encontrado'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.public-profile {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.profile-header {
  margin-bottom: 2rem;
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 4px solid rgba(255, 255, 255, 0.3);
}

h1 {
  color: white;
  margin-bottom: 0.5rem;
  font-size: 2rem;
}

.bio {
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.label {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.value {
  color: white;
  font-weight: 600;
}

.loading, .error {
  color: white;
  text-align: center;
  font-size: 1.2rem;
}

.error {
  color: #ff6b6b;
}
</style>