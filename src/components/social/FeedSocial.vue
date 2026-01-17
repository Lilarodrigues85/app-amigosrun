<template>
  <div class="feed-social">
    <div class="feed-header">
      <h3>Feed da Comunidade</h3>
    </div>
    
    <div class="posts-container">
      <div 
        v-for="post in posts" 
        :key="post.id"
        class="post-card"
      >
        <div class="post-header">
          <div class="user-info">
            <div class="avatar">👤</div>
            <span class="username">{{ getUserName(post.userId) }}</span>
          </div>
          <span class="timestamp">{{ formatTime(post.timestamp) }}</span>
        </div>
        
        <div class="post-content">
          <div v-if="post.tipo === 'confirmacao'" class="confirmacao-post">
            <span class="icon">✅</span>
            <span>confirmou presença em uma corrida</span>
          </div>
          
          <div v-else-if="post.tipo === 'foto'" class="foto-post">
            <span class="icon">📸</span>
            <span>{{ post.conteudo }}</span>
          </div>
          
          <div v-else class="texto-post">
            {{ post.conteudo }}
          </div>
        </div>
      </div>
      
      <div v-if="posts.length === 0" class="empty-state">
        <p>Nenhuma atividade recente</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { feedService } from '@/services/feedService'

const { user, isInitialized } = useAuth()
const posts = ref([])
let unsubscribe = null

function getUserName(userId) {
  return 'Corredor' // Simplificado
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function startFeedListener() {
  if (unsubscribe) unsubscribe()
  
  if (user.value) {
    console.log('Starting feed listener for authenticated user')
    unsubscribe = feedService.onPostsChange((newPosts) => {
      posts.value = newPosts
    })
  } else {
    console.log('No authenticated user, clearing posts')
    posts.value = []
  }
}

function stopFeedListener() {
  if (unsubscribe) {
    console.log('Stopping feed listener')
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
    }
  }
}, { immediate: true })

onMounted(() => {
  // Only start listener if already initialized and authenticated
  if (isInitialized.value && user.value) {
    startFeedListener()
  }
})

onUnmounted(() => {
  stopFeedListener()
})
</script>

<style scoped>
.feed-social {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.feed-header h3 {
  margin: 0 0 1rem 0;
  color: white;
  font-size: 1.25rem;
}

.posts-container {
  max-height: 400px;
  overflow-y: auto;
}

.post-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.avatar {
  width: 2rem;
  height: 2rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.username {
  color: white;
  font-weight: 500;
}

.timestamp {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
}

.post-content {
  color: rgba(255, 255, 255, 0.9);
}

.confirmacao-post,
.foto-post {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.icon {
  font-size: 1.25rem;
}

.empty-state {
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem;
}
</style>