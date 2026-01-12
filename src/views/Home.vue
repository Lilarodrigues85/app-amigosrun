<template>
  <div class="home">
    <!-- Feed Container -->
    <div class="feed-container">
      <!-- Create Post -->
      <div class="create-post">
        <div class="post-header">
          <img :src="user?.photoURL || '/default-avatar.png'" class="avatar" />
          <input 
            v-model="newPost" 
            placeholder="Compartilhe sua experiência de corrida..."
            class="post-input"
            @keyup.enter="createPost"
          />
        </div>
        <div class="post-actions">
          <button @click="createPost" :disabled="!newPost.trim()" class="post-btn">
            📝 Publicar
          </button>
        </div>
      </div>

      <!-- Feed Posts -->
      <div class="feed">
        <div v-for="post in posts" :key="post.id" class="post-card">
          <div class="post-header">
            <img :src="post.user.photoURL || '/default-avatar.png'" class="avatar" />
            <div class="post-info">
              <h4>{{ post.user.name }}</h4>
              <span class="post-time">{{ formatTime(post.createdAt) }}</span>
            </div>
          </div>
          
          <div class="post-content">
            <p>{{ post.content }}</p>
            <img v-if="post.image" :src="post.image" class="post-image" />
          </div>
          
          <div class="post-actions">
            <button @click="likePost(post.id)" class="action-btn">
              ❤️ {{ post.likes || 0 }}
            </button>
            <button class="action-btn">
              💬 {{ post.comments?.length || 0 }}
            </button>
          </div>
        </div>
      </div>

      <!-- Upcoming Races Sidebar -->
      <div class="sidebar">
        <div class="widget">
          <h3>🏃‍♀️ Próximas Corridas</h3>
          <div v-for="race in upcomingRaces" :key="race.id" class="race-item">
            <div class="race-date">{{ formatDate(race.date) }}</div>
            <div class="race-info">
              <h4>{{ race.name }}</h4>
              <p>{{ race.location }}</p>
              <span class="race-distance">{{ race.distance }}</span>
            </div>
          </div>
        </div>

        <div class="widget">
          <h3>📸 Fotos Recentes</h3>
          <div class="photo-grid">
            <img v-for="photo in recentPhotos" :key="photo.id" :src="photo.url" class="photo-thumb" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'

const { user } = useAuth()
const newPost = ref('')
const posts = ref([
  {
    id: 1,
    user: { name: 'Maria Silva', photoURL: '/default-avatar.png' },
    content: 'Acabei de completar minha primeira corrida de 10K! Que sensação incrível! 🏃‍♀️💪',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    likes: 15,
    comments: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 2,
    user: { name: 'João Santos', photoURL: '/default-avatar.png' },
    content: 'Treino matinal no parque. O sol nascendo é a melhor motivação! ☀️',
    likes: 8,
    comments: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000)
  }
])

const upcomingRaces = ref([
  {
    id: 1,
    name: 'Corrida do Parque',
    location: 'Parque Ibirapuera',
    distance: '5K',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    name: 'Maratona da Cidade',
    location: 'Centro da Cidade',
    distance: '21K',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  }
])

const recentPhotos = ref([
  { id: 1, url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=150' },
  { id: 2, url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150' },
  { id: 3, url: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=150' },
  { id: 4, url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=150' }
])

const createPost = () => {
  if (!newPost.value.trim()) return
  
  posts.value.unshift({
    id: Date.now(),
    user: { name: user.value?.displayName || 'Usuário', photoURL: user.value?.photoURL },
    content: newPost.value,
    likes: 0,
    comments: [],
    createdAt: new Date()
  })
  
  newPost.value = ''
}

const likePost = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.likes = (post.likes || 0) + 1
  }
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return 'Agora'
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

const formatDate = (date) => {
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('@/assets/images/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  padding: 2rem 1rem;
}

.feed-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.create-post {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.post-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.post-actions {
  text-align: right;
}

.post-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.post-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.feed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-info {
  flex: 1;
}

.post-info h4 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.post-time {
  color: #666;
  font-size: 12px;
}

.post-content {
  margin: 1rem 0;
}

.post-content p {
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.post-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.widget {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.widget h3 {
  margin: 0 0 1rem 0;
  font-size: 18px;
  color: #333;
}

.race-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.race-item:last-child {
  border-bottom: none;
}

.race-date {
  background: #667eea;
  color: white;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 12px;
  text-align: center;
  min-width: 50px;
}

.race-info h4 {
  margin: 0;
  font-size: 14px;
}

.race-info p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 12px;
}

.race-distance {
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 11px;
  color: #667eea;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.photo-thumb {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .feed-container {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }
}
</style>