<template>
  <div class="home">
    <!-- Main Content -->
    <div class="main-content">
      <!-- Feed Container -->
      <div class="feed-container">
        <!-- Weather Cards -->
        <WeatherCards />

        <!-- Create Post -->
        <div class="create-post-card">
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
              <span>📝</span> Publicar
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
            
            <div class="post-actions-bar">
              <button @click="likePost(post.id)" class="action-btn">
                <span>❤️</span> {{ post.likes || 0 }}
              </button>
              <button class="action-btn">
                <span>💬</span> {{ post.comments?.length || 0 }}
              </button>
              <button class="action-btn">
                <span>🔄</span> Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Quick Stats -->
        <div class="stats-widget">
          <h3>📊 Suas Estatísticas</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <div class="stat-value">12</div>
              <div class="stat-label">Corridas</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">85km</div>
              <div class="stat-label">Total</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">5:30</div>
              <div class="stat-label">Pace Médio</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">45</div>
              <div class="stat-label">Amigos</div>
            </div>
          </div>
        </div>

        <!-- Upcoming Races -->
        <div class="widget">
          <h3>🏃‍♀️ Próximas Corridas</h3>
          <div v-for="race in upcomingRaces" :key="race.id" class="race-item">
            <div class="race-date">
              <div class="date-day">{{ formatDay(race.date) }}</div>
              <div class="date-month">{{ formatMonth(race.date) }}</div>
            </div>
            <div class="race-info">
              <h4>{{ race.name }}</h4>
              <p>📍 {{ race.location }}</p>
              <span class="race-distance">{{ race.distance }}</span>
            </div>
          </div>
          <button class="view-all-btn">Ver todas as corridas →</button>
        </div>

        <!-- Social Feed Widget -->
        <div class="widget">
          <h3>🔥 Atividades Recentes</h3>
          <FeedSocial />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import FeedSocial from '@/components/social/FeedSocial.vue'
import WeatherCards from '@/components/weather/WeatherCards.vue'

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

const formatDay = (date) => {
  return date.getDate()
}

const formatMonth = (date) => {
  return date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  padding-bottom: 2rem;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
}

.feed-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.create-post-card {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.5);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(102, 126, 234, 0.3);
}

.post-input {
  flex: 1;
  border: 2px solid rgba(102, 126, 234, 0.2);
  outline: none;
  font-size: 15px;
  padding: 12px 16px;
  background: rgba(248, 249, 250, 0.8);
  border-radius: 24px;
  transition: all 0.3s ease;
}

.post-input:focus {
  border-color: rgba(102, 126, 234, 0.5);
  background: white;
}

.post-actions {
  text-align: right;
}

.post-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.post-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
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
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.5);
  transition: all 0.3s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
}

.post-info {
  flex: 1;
}

.post-info h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.post-time {
  color: #999;
  font-size: 13px;
}

.post-content {
  margin: 1rem 0;
}

.post-content p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: #444;
}

.post-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
}

.post-actions-bar {
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.action-btn {
  background: rgba(102, 126, 234, 0.1);
  border: none;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
}

.action-btn:hover {
  background: rgba(102, 126, 234, 0.2);
  transform: translateY(-1px);
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-widget {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
  color: white;
}

.stats-widget h3 {
  margin: 0 0 1.5rem 0;
  font-size: 18px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-item {
  text-align: center;
  background: rgba(255,255,255,0.15);
  padding: 1rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

.widget {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.5);
}

.widget h3 {
  margin: 0 0 1rem 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.race-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.race-item:last-child {
  border-bottom: none;
}

.race-date {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem;
  border-radius: 12px;
  text-align: center;
  min-width: 60px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.date-day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.75rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.race-info {
  flex: 1;
}

.race-info h4 {
  margin: 0 0 0.5rem 0;
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.race-info p {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 13px;
}

.race-distance {
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
}

.view-all-btn {
  width: 100%;
  margin-top: 1rem;
  padding: 10px;
  background: rgba(102, 126, 234, 0.1);
  border: none;
  border-radius: 10px;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
