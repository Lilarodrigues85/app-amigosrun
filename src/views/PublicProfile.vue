<template>
  <div class="public-profile">
    <div class="profile-container">
      <div v-if="loading" class="loading">
        Carregando perfil...
      </div>
      
      <div v-else-if="profile" class="profile-card">
        <div class="profile-header">
          <img 
            :src="profile.photoUrl || avatarUrl" 
            :alt="profile.name"
            class="profile-avatar"
          />
          <h2>{{ profile.name }}</h2>
          <p v-if="profile.goal" class="profile-goal">
            Meta: {{ getGoalText(profile.goal) }}
          </p>
        </div>

        <div class="profile-content">
          <div v-if="profile.bio" class="profile-bio">
            <h3>Sobre</h3>
            <p>{{ profile.bio }}</p>
          </div>

          <div v-if="profile.weight || profile.height" class="profile-stats">
            <h3>Informações Pessoais</h3>
            <div class="stats-grid">
              <div v-if="profile.weight" class="stat">
                <span class="stat-label">Peso</span>
                <span class="stat-value">{{ profile.weight }}kg</span>
              </div>
              <div v-if="profile.height" class="stat">
                <span class="stat-label">Altura</span>
                <span class="stat-value">{{ profile.height }}cm</span>
              </div>
            </div>
          </div>

          <!-- Estatísticas de Corrida -->
          <div v-if="profile.stats" class="running-stats">
            <h3>📊 Estatísticas de Corrida</h3>
            <div class="stats-grid-running">
              <div class="stat-running">
                <span class="stat-value-large">{{ profile.stats.totalRuns || 0 }}</span>
                <span class="stat-label">Corridas</span>
              </div>
              <div class="stat-running">
                <span class="stat-value-large">{{ profile.stats.totalDistance || 0 }}km</span>
                <span class="stat-label">Total</span>
              </div>
              <div class="stat-running">
                <span class="stat-value-large">{{ profile.stats.averagePace || '--' }}</span>
                <span class="stat-label">Pace Médio</span>
              </div>
              <div class="stat-running">
                <span class="stat-value-large">{{ profile.stats.friends || 0 }}</span>
                <span class="stat-label">Amigos</span>
              </div>
            </div>
          </div>

          <div class="profile-footer">
            <p class="member-since">
              Membro desde {{ formatDate(profile.createdAt) }}
            </p>
          </div>
        </div>
      </div>

      <div v-else class="error">
        Perfil não encontrado
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { userService } from '@/services/userService'
import { avatarService } from '@/services/avatarService'

const route = useRoute()
const profile = ref(null)
const loading = ref(true)

const avatarUrl = computed(() => {
  if (!profile.value) return ''
  return avatarService.getAvatarUrl(profile.value)
})

const loadProfile = async () => {
  try {
    const userId = route.params.id
    profile.value = await userService.getPublicProfile(userId)
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
  } finally {
    loading.value = false
  }
}

const getGoalText = (goal) => {
  const goals = {
    'iniciante': 'Começar a correr',
    '5k': 'Correr 5K',
    '10k': 'Correr 10K',
    '21k': 'Meia Maratona (21K)',
    '42k': 'Maratona (42K)',
    'ultramaratona': 'Ultramaratona'
  }
  return goals[goal] || goal
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric'
  })
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.public-profile {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.profile-container {
  width: 100%;
  max-width: 500px;
}

.profile-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
}

.profile-header {
  text-align: center;
  padding: 2rem;
  background: rgba(255,255,255,0.05);
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 4px solid rgba(255,255,255,0.3);
  margin-bottom: 1rem;
  object-fit: cover;
}

.profile-header h2 {
  color: white;
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.profile-goal {
  color: rgba(255,255,255,0.8);
  margin: 0;
  font-size: 0.9rem;
}

.profile-content {
  padding: 2rem;
}

.profile-bio {
  margin-bottom: 2rem;
}

.profile-bio h3,
.profile-stats h3 {
  color: white;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.profile-bio p {
  color: rgba(255,255,255,0.9);
  line-height: 1.6;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat {
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
}

.stat-label {
  display: block;
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.stat-value {
  display: block;
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

.running-stats {
  margin-bottom: 2rem;
}

.running-stats h3 {
  color: white;
  margin: 0 0 1.5rem 0;
  font-size: 1.1rem;
  text-align: center;
}

.stats-grid-running {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.2);
}

.stat-running {
  text-align: center;
  background: rgba(255,255,255,0.1);
  padding: 1rem;
  border-radius: 8px;
  backdrop-filter: blur(5px);
}

.stat-value-large {
  display: block;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.stat-running .stat-label {
  color: rgba(255,255,255,0.8);
  font-size: 0.8rem;
  font-weight: 500;
}

.profile-footer {
  margin-top: 2rem;
  text-align: center;
}

.member-since {
  color: rgba(255,255,255,0.6);
  font-size: 0.8rem;
  margin: 0;
}

.loading,
.error {
  text-align: center;
  color: white;
  padding: 2rem;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
}

@media (max-width: 768px) {
  .public-profile {
    padding: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid-running {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>