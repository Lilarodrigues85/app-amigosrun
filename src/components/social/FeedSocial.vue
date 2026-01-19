<template>
  <div class="feed-social">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Carregando atividades...</p>
    </div>
    
    <div v-else-if="posts.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>Nenhuma atividade recente</p>
      <span class="empty-hint">Seja o primeiro a postar!</span>
    </div>
    
    <div v-else class="posts-container">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="activity-item"
      >
        <div class="activity-icon">
          {{ getActivityIcon(post.tipo) }}
        </div>
        
        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-user">{{ post.user?.name || 'Corredor' }}</span>
            <span class="activity-time">{{ formatTime(post.timestamp) }}</span>
          </div>
          
          <div class="activity-description">
            <span v-if="post.tipo === 'confirmacao'" class="activity-text">
              confirmou presença em uma corrida
            </span>
            <span v-else-if="post.tipo === 'foto'" class="activity-text">
              compartilhou uma foto
            </span>
            <span v-else-if="post.tipo === 'localizacao'" class="activity-text">
              compartilhou localização
            </span>
            <span v-else class="activity-text">
              {{ truncateText(post.conteudo, 50) }}
            </span>
          </div>
          
          <div v-if="post.likes > 0" class="activity-stats">
            <span class="stat-item">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ post.likes }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { feedService } from '@/services/feedService'
import { userService } from '@/services/userService'

const { user, isInitialized } = useAuth()
const posts = ref([])
const loading = ref(true)
let unsubscribe = null

function getActivityIcon(tipo) {
  const icons = {
    'confirmacao': '✅',
    'foto': '📸',
    'localizacao': '📍',
    'text': '💭',
    'comentario': '💬'
  }
  return icons[tipo] || '📝'
}

function truncateText(text, maxLength) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    const now = new Date()
    const diff = now - date
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Agora'
    if (minutes < 60) return `${minutes}min`
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d`
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
  } catch (error) {
    console.error('Erro ao formatar tempo:', error)
    return ''
  }
}

async function startFeedListener() {
  if (unsubscribe) unsubscribe()
  
  loading.value = true
  
  try {
    console.log('🔵 [FeedSocial] Iniciando listener de posts')
    
    unsubscribe = feedService.onPostsChange(async (newPosts) => {
      console.log('📦 [FeedSocial] Posts recebidos:', newPosts.length)
      
      // Enriquecer posts com dados do usuário (apenas os 10 mais recentes)
      const recentPosts = newPosts.slice(0, 10)
      const enrichedPosts = await Promise.all(
        recentPosts.map(async (post) => {
          try {
            const userProfile = await userService.getProfile(post.userId)
            return {
              ...post,
              user: {
                name: userProfile?.name || 'Corredor',
                photoURL: userProfile?.photoUrl || '/default-avatar.png'
              }
            }
          } catch (error) {
            console.error('❌ [FeedSocial] Erro ao buscar perfil:', error)
            return {
              ...post,
              user: {
                name: 'Corredor',
                photoURL: '/default-avatar.png'
              }
            }
          }
        })
      )
      
      posts.value = enrichedPosts
      loading.value = false
      console.log('✅ [FeedSocial] Posts enriquecidos:', posts.value.length)
    }, 10) // Limitar a 10 posts
  } catch (error) {
    console.error('❌ [FeedSocial] Erro ao iniciar listener:', error)
    loading.value = false
  }
}

function stopFeedListener() {
  if (unsubscribe) {
    console.log('🔵 [FeedSocial] Parando listener')
    unsubscribe()
    unsubscribe = null
  }
}

// Watch for auth state changes
watch([user, isInitialized], ([newUser, initialized]) => {
  if (initialized) {
    if (newUser) {
      startFeedListener()
    } else {
      stopFeedListener()
      posts.value = []
      loading.value = false
    }
  }
}, { immediate: true })

onMounted(() => {
  console.log('🔵 [FeedSocial] Componente montado')
  if (isInitialized.value && user.value) {
    startFeedListener()
  }
})

onUnmounted(() => {
  console.log('🔵 [FeedSocial] Componente desmontado')
  stopFeedListener()
})
</script>

<style scoped>
.feed-social {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 1rem;
}

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  gap: 0.5rem;
}

.empty-icon {
  font-size: 2.5rem;
  opacity: 0.5;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
}

.empty-hint {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.posts-container::-webkit-scrollbar {
  width: 4px;
}

.posts-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
}

.posts-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
}

.posts-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.activity-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.activity-item:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateX(2px);
}

.activity-icon {
  font-size: 1.5rem;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  min-width: 0;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.activity-user {
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  font-weight: 500;
  flex-shrink: 0;
}

.activity-description {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.activity-text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.8125rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.activity-stats {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.125rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
}

.stat-icon {
  font-size: 0.875rem;
}

.stat-value {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 600;
}
</style>