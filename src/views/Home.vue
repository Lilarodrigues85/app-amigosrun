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
          <div class="create-post-header">
            <img :src="user?.photoURL || '/default-avatar.png'" class="user-avatar" />
            <div class="user-greeting">
              <span class="greeting-text">Olá, {{ user?.displayName?.split(' ')[0] || 'Corredor' }}!</span>
              <span class="greeting-subtext">Compartilhe sua jornada</span>
            </div>
          </div>
          
          <div class="post-input-wrapper">
            <textarea
              v-model="newPost" 
              placeholder="Como foi sua corrida hoje? Compartilhe sua experiência, conquistas ou dicas..."
              class="post-textarea"
              @keydown.enter.ctrl="createPost"
              @keydown.enter.meta="createPost"
              :disabled="posting"
              rows="3"
            ></textarea>
            
            <!-- Preview da Imagem -->
            <div v-if="imagePreview" class="image-preview-container">
              <img :src="imagePreview" alt="Preview" class="image-preview" />
              <button @click="removePhoto" class="remove-preview-btn" title="Remover foto">
                <span>✕</span>
              </button>
            </div>
            
            <!-- Preview da Localização -->
            <div v-if="selectedLocation" class="location-preview-container">
              <div class="location-preview">
                <span class="location-icon">📍</span>
                <span class="location-text">{{ selectedLocation.name }}</span>
                <button @click="removeLocation" class="remove-location-btn" title="Remover localização">
                  <span>✕</span>
                </button>
              </div>
            </div>
            
            <div class="textarea-footer">
              <span class="char-count" :class="{ 'char-limit': newPost.length > 500 }">
                {{ newPost.length }}/500
              </span>
            </div>
          </div>
          
          <div class="post-actions-row">
            <div class="post-options">
              <button 
                @click="handlePhotoClick" 
                class="option-btn" 
                :disabled="posting || uploadingImage"
                title="Adicionar foto"
              >
                <span>{{ uploadingImage ? '⏳' : '📷' }}</span>
                <span class="option-text">{{ uploadingImage ? 'Enviando...' : 'Foto' }}</span>
              </button>
              
              <button 
                @click="handleLocationClick" 
                class="option-btn" 
                :disabled="posting || gettingLocation"
                title="Adicionar localização"
              >
                <span>{{ gettingLocation ? '⏳' : '📍' }}</span>
                <span class="option-text">{{ gettingLocation ? 'Obtendo...' : 'Local' }}</span>
              </button>
              
              <div class="emoji-picker-wrapper">
                <button 
                  @click="toggleEmojiPicker" 
                  class="option-btn" 
                  :disabled="posting"
                  title="Adicionar emoji"
                  :class="{ 'active': showEmojiPicker }"
                >
                  <span>😊</span>
                  <span class="option-text">Emoji</span>
                </button>
                
                <transition name="emoji-fade">
                  <div v-if="showEmojiPicker" class="emoji-picker">
                    <button 
                      v-for="emoji in popularEmojis" 
                      :key="emoji"
                      @click="addEmoji(emoji)"
                      class="emoji-btn"
                      :title="emoji"
                    >
                      {{ emoji }}
                    </button>
                  </div>
                </transition>
              </div>
            </div>
            
            <button 
              @click="createPost" 
              :disabled="(!newPost.trim() && !selectedImage) || posting || newPost.length > 500 || uploadingImage" 
              class="publish-btn"
            >
              <span class="btn-icon">{{ posting ? '⏳' : '🚀' }}</span>
              <span class="btn-text">{{ posting ? 'Publicando...' : 'Publicar' }}</span>
            </button>
          </div>
          
          <transition name="fade">
            <div v-if="postMessage" class="post-feedback" :class="{ 'success': !postMessage.includes('Erro') }">
              <span class="feedback-icon">{{ postMessage.includes('Erro') ? '❌' : '✅' }}</span>
              <span>{{ postMessage }}</span>
            </div>
          </transition>
        </div>

        <!-- Feed Posts -->
        <div class="feed">
          <div v-if="posts.length === 0" class="empty-feed">
            <div class="empty-icon">📝</div>
            <h3>Nenhum post ainda</h3>
            <p>Seja o primeiro a compartilhar sua experiência de corrida!</p>
          </div>
          
          <div v-for="post in posts" :key="post.id" class="post-card">
            <div class="post-card-header">
              <div class="post-author">
                <img :src="post.user?.photoURL || '/default-avatar.png'" class="author-avatar" />
                <div class="author-info">
                  <h4 class="author-name">{{ post.user?.name || 'Usuário' }}</h4>
                  <div class="post-meta">
                    <span class="post-time">{{ formatTime(post.createdAt) }}</span>
                    <span v-if="post.editado" class="edited-badge" title="Post editado">✏️ editado</span>
                    <span class="meta-separator">•</span>
                    <span class="post-type">{{ getPostTypeLabel(post.tipo) }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Menu de Opções -->
              <div class="post-menu" v-if="post.userId === user?.uid">
                <button 
                  class="post-menu-btn" 
                  @click="togglePostMenu(post.id)"
                  title="Mais opções"
                >
                  <span>⋯</span>
                </button>
                
                <transition name="menu-fade">
                  <div v-if="activePostMenu === post.id" class="post-menu-dropdown">
                    <button 
                      class="menu-option edit-option"
                      @click="editPost(post)"
                    >
                      <span class="menu-icon">✏️</span>
                      <span class="menu-text">Editar</span>
                    </button>
                    <button 
                      class="menu-option delete-option"
                      @click="confirmDeletePost(post)"
                    >
                      <span class="menu-icon">🗑️</span>
                      <span class="menu-text">Excluir</span>
                    </button>
                  </div>
                </transition>
              </div>
            </div>
            
            <!-- Modo de Edição -->
            <div v-if="editingPostId === post.id" class="post-edit-mode">
              <textarea
                v-model="editingContent"
                class="edit-textarea"
                rows="4"
                maxlength="500"
                @keydown.esc="cancelEdit"
              ></textarea>
              <div class="edit-actions">
                <span class="edit-char-count" :class="{ 'char-limit': editingContent.length > 500 }">
                  {{ editingContent.length }}/500
                </span>
                <div class="edit-buttons">
                  <button @click="cancelEdit" class="cancel-edit-btn">
                    Cancelar
                  </button>
                  <button 
                    @click="saveEdit(post)" 
                    class="save-edit-btn"
                    :disabled="!editingContent.trim() || editingContent.length > 500"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Conteúdo Normal -->
            <div v-else class="post-body">
              <p v-if="post.conteudo" class="post-text">{{ post.conteudo || 'Sem conteúdo' }}</p>
              
              <!-- Imagem do Post -->
              <img 
                v-if="post.imageUrl" 
                :src="cloudinaryService.getPostImageUrl(post.imageUrl, 800, 600)" 
                alt="Imagem do post"
                class="post-media" 
              />
              
              <!-- Localização do Post -->
              <div v-if="post.location" class="post-location">
                <span class="location-icon">📍</span>
                <span class="location-name">{{ post.location.name }}</span>
              </div>
            </div>
            
            <div class="post-footer">
              <div class="post-stats">
                <span v-if="post.likes > 0" class="stat-item">
                  <span class="stat-icon">❤️</span>
                  <span class="stat-count">{{ post.likes }}</span>
                </span>
                <span v-if="post.comments?.length > 0" class="stat-item">
                  <span class="stat-count">{{ post.comments.length }} comentários</span>
                </span>
              </div>
              
              <div class="post-actions">
                <button @click="likePost(post.id)" class="action-button" :class="{ 'active': post.userLiked }">
                  <span class="action-icon">❤️</span>
                  <span class="action-label">Curtir</span>
                </button>
                <button class="action-button">
                  <span class="action-icon">💬</span>
                  <span class="action-label">Comentar</span>
                </button>
                <button class="action-button">
                  <span class="action-icon">🔄</span>
                  <span class="action-label">Compartilhar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="sidebar">
        <!-- Upcoming Races -->
        <div class="widget">
          <h3>🏃‍♀️ Próximas Corridas</h3>
          
          <div v-if="loadingRaces" class="loading-state">
            <div class="spinner"></div>
            <p>Carregando corridas...</p>
          </div>
          
          <div v-else-if="upcomingRaces.length === 0" class="empty-state">
            <div class="empty-icon">📅</div>
            <p>Nenhuma corrida agendada</p>
            <router-link to="/corridas" class="create-race-link">
              Criar corrida →
            </router-link>
          </div>
          
          <div v-else>
            <div v-for="race in upcomingRaces" :key="race.id" class="race-item">
              <div class="race-date">
                <div class="date-day">{{ formatDay(race.data) }}</div>
                <div class="date-month">{{ formatMonth(race.data) }}</div>
              </div>
              <div class="race-info">
                <h4>{{ race.titulo }}</h4>
                <p class="race-location">📍 {{ race.local }}</p>
                
                <div class="race-details">
                  <div v-if="race.distancias && race.distancias.length > 0" class="race-distances">
                    <span 
                      v-for="distancia in race.distancias.slice(0, 3)" 
                      :key="distancia"
                      class="distance-tag"
                    >
                      {{ distancia }}
                    </span>
                    <span v-if="race.distancias.length > 3" class="more-distances">
                      +{{ race.distancias.length - 3 }}
                    </span>
                  </div>
                  
                  <div class="race-meta">
                    <span v-if="race.valor || race.valor60" class="meta-item valores-meta">
                      <span class="meta-icon">💰</span>
                      <span class="meta-text">
                        <span v-if="race.valor">R$ {{ formatPrice(race.valor) }}</span>
                        <span v-if="race.valor60" class="valor-60-tag">60+: R$ {{ formatPrice(race.valor60) }}</span>
                      </span>
                    </span>
                    <span v-if="race.vagas" class="meta-item">
                      <span class="meta-icon">👥</span>
                      <span class="meta-text">{{ race.vagas }} vagas</span>
                    </span>
                  </div>
                </div>
                
                <router-link :to="`/corridas`" class="race-details-link">
                  Ver detalhes →
                </router-link>
              </div>
            </div>
            <router-link to="/corridas" class="view-all-btn">
              Ver todas as corridas →
            </router-link>
          </div>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { userService } from '@/services/userService'
import { feedService } from '@/services/feedService'
import { cloudinaryService } from '@/services/cloudinaryService'
import { corridaService } from '@/services/corridaService'
import FeedSocial from '@/components/social/FeedSocial.vue'
import WeatherCards from '@/components/weather/WeatherCards.vue'

const { user } = useAuth()
const newPost = ref('')
const posting = ref(false)
const postMessage = ref('')

// Estados para anexos do post
const selectedImage = ref(null)
const imagePreview = ref(null)
const uploadingImage = ref(false)
const selectedLocation = ref(null)
const gettingLocation = ref(false)
const showEmojiPicker = ref(false)

// Estados para menu e edição
const activePostMenu = ref(null)
const editingPostId = ref(null)
const editingContent = ref('')
const deletingPostId = ref(null)

const userStats = ref({
  totalRuns: 0,
  totalDistance: 0,
  averagePace: '',
  friends: 0
})

const posts = ref([])
let unsubscribePosts = null

const upcomingRaces = ref([])
const loadingRaces = ref(true)

const loadUpcomingRaces = async () => {
  console.log('🔵 [Home] Carregando próximas corridas')
  loadingRaces.value = true
  
  try {
    const allRaces = await corridaService.getCorridas()
    console.log('📦 [Home] Corridas recebidas:', allRaces.length)
    
    // Filtrar apenas corridas futuras
    const now = new Date()
    const futureRaces = allRaces.filter(race => {
      const raceDate = new Date(race.data)
      return raceDate > now
    })
    
    // Ordenar por data e pegar as 3 próximas
    upcomingRaces.value = futureRaces
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 3)
    
    console.log('✅ [Home] Próximas corridas carregadas:', upcomingRaces.value.length)
  } catch (error) {
    console.error('❌ [Home] Erro ao carregar corridas:', error)
    upcomingRaces.value = []
  } finally {
    loadingRaces.value = false
  }
}

const loadUserStats = async () => {
  console.log('🔵 [Home] Carregando estatísticas do usuário')
  
  if (!user.value) {
    console.log('⚠️ [Home] Nenhum usuário autenticado')
    return
  }
  
  try {
    const profile = await userService.getProfile(user.value.uid)
    if (profile && profile.stats) {
      userStats.value = {
        totalRuns: profile.stats.totalRuns || 0,
        totalDistance: profile.stats.totalDistance || 0,
        averagePace: profile.stats.averagePace || '',
        friends: profile.stats.friends || 0
      }
      console.log('✅ [Home] Estatísticas carregadas:', userStats.value)
    }
  } catch (error) {
    console.error('❌ [Home] Erro ao carregar estatísticas:', error)
  }
}

const loadPosts = () => {
  console.log('🔵 [Home] Iniciando listener de posts')
  
  if (unsubscribePosts) {
    unsubscribePosts()
  }
  
  unsubscribePosts = feedService.onPostsChange(async (newPosts) => {
    console.log('📦 [Home] Posts recebidos:', newPosts.length)
    console.log('📋 [Home] Posts brutos:', JSON.stringify(newPosts, null, 2))
    
    // Enriquecer posts com dados do usuário
    const enrichedPosts = await Promise.all(
      newPosts.map(async (post) => {
        try {
          const userProfile = await userService.getProfile(post.userId)
          const enriched = {
            ...post,
            user: {
              name: userProfile?.name || 'Usuário',
              photoURL: userProfile?.photoUrl || '/default-avatar.png'
            },
            createdAt: new Date(post.timestamp)
          }
          console.log('📝 [Home] Post enriquecido:', JSON.stringify(enriched, null, 2))
          return enriched
        } catch (error) {
          console.error('❌ [Home] Erro ao buscar perfil do usuário:', error)
          return {
            ...post,
            user: {
              name: 'Usuário',
              photoURL: '/default-avatar.png'
            },
            createdAt: new Date(post.timestamp)
          }
        }
      })
    )
    
    posts.value = enrichedPosts
    console.log('✅ [Home] Posts enriquecidos:', posts.value.length)
    console.log('📋 [Home] Posts finais:', JSON.stringify(posts.value, null, 2))
  }, 50)
}

const createPost = async () => {
  console.log('🔵 [Home] Criando post')
  
  if (!newPost.value.trim() && !selectedImage.value) {
    console.log('⚠️ [Home] Post vazio')
    postMessage.value = 'Escreva algo ou adicione uma foto'
    setTimeout(() => postMessage.value = '', 3000)
    return
  }
  
  if (!user.value) {
    console.log('❌ [Home] Usuário não autenticado')
    postMessage.value = 'Você precisa estar logado para postar'
    setTimeout(() => postMessage.value = '', 3000)
    return
  }
  
  posting.value = true
  
  try {
    let imageUrl = null
    
    // Upload da imagem se houver
    if (selectedImage.value) {
      console.log('📷 [Home] Fazendo upload da imagem...')
      uploadingImage.value = true
      imageUrl = await cloudinaryService.uploadPostImage(selectedImage.value)
      console.log('✅ [Home] Imagem enviada:', imageUrl)
      uploadingImage.value = false
    }
    
    console.log('📦 [Home] Dados do post:', {
      userId: user.value.uid,
      content: newPost.value,
      imageUrl,
      location: selectedLocation.value
    })
    
    // Determinar tipo do post
    let tipo = 'text'
    if (imageUrl) tipo = 'foto'
    if (selectedLocation.value) tipo = 'localizacao'
    
    await feedService.criarPost(
      user.value.uid,
      tipo,
      newPost.value,
      {
        imageUrl,
        location: selectedLocation.value
      }
    )
    
    console.log('✅ [Home] Post criado com sucesso!')
    
    // Limpar formulário
    newPost.value = ''
    selectedImage.value = null
    imagePreview.value = null
    selectedLocation.value = null
    
    postMessage.value = 'Post publicado! ✅'
    setTimeout(() => postMessage.value = '', 3000)
  } catch (error) {
    console.error('❌ [Home] Erro ao criar post:', error)
    postMessage.value = 'Erro ao publicar post: ' + error.message
    setTimeout(() => postMessage.value = '', 5000)
  } finally {
    posting.value = false
    uploadingImage.value = false
  }
}

// Função para selecionar foto
const handlePhotoClick = () => {
  console.log('🔵 [Home] Abrindo seletor de foto')
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/jpeg,image/png,image/webp,image/jpg'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      console.log('📷 [Home] Foto selecionada:', file.name)
      selectedImage.value = file
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target.result
        console.log('✅ [Home] Preview criado')
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

// Função para remover foto
const removePhoto = () => {
  console.log('🔵 [Home] Removendo foto')
  selectedImage.value = null
  imagePreview.value = null
}

// Função para obter localização
const handleLocationClick = () => {
  console.log('🔵 [Home] Obtendo localização')
  
  if (!navigator.geolocation) {
    postMessage.value = 'Geolocalização não suportada pelo navegador'
    setTimeout(() => postMessage.value = '', 3000)
    return
  }
  
  gettingLocation.value = true
  
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      console.log('✅ [Home] Localização obtida:', position.coords)
      
      const { latitude, longitude } = position.coords
      
      try {
        // Tentar obter nome do local usando API de geocoding reverso
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        )
        const data = await response.json()
        
        selectedLocation.value = {
          latitude,
          longitude,
          name: data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        }
        
        console.log('✅ [Home] Local identificado:', selectedLocation.value)
        postMessage.value = 'Localização adicionada! 📍'
        setTimeout(() => postMessage.value = '', 3000)
      } catch (error) {
        console.error('❌ [Home] Erro ao obter nome do local:', error)
        selectedLocation.value = {
          latitude,
          longitude,
          name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
        }
      }
      
      gettingLocation.value = false
    },
    (error) => {
      console.error('❌ [Home] Erro ao obter localização:', error)
      postMessage.value = 'Erro ao obter localização. Permita o acesso.'
      setTimeout(() => postMessage.value = '', 3000)
      gettingLocation.value = false
    }
  )
}

// Função para remover localização
const removeLocation = () => {
  console.log('🔵 [Home] Removendo localização')
  selectedLocation.value = null
}

// Emojis populares para corrida
const popularEmojis = ['🏃', '🏃‍♀️', '🏃‍♂️', '💪', '🔥', '⚡', '🎯', '🏆', '👟', '⏱️', '🌟', '💯', '🚀', '❤️', '😊', '😎', '🤩', '👍', '✨', '🎉']

// Função para adicionar emoji
const addEmoji = (emoji) => {
  console.log('🔵 [Home] Adicionando emoji:', emoji)
  newPost.value += emoji
  showEmojiPicker.value = false
}

// Função para toggle emoji picker
const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value
}

const likePost = (postId) => {
  console.log('🔵 [Home] Curtindo post:', postId)
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.likes = (post.likes || 0) + 1
    console.log('✅ [Home] Post curtido, total:', post.likes)
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

const formatPrice = (price) => {
  if (!price) return '0,00'
  return parseFloat(price).toFixed(2).replace('.', ',')
}

const formatDay = (dateString) => {
  if (!dateString) return '?'
  
  try {
    // Se for um Timestamp do Firestore
    if (dateString.toDate && typeof dateString.toDate === 'function') {
      return dateString.toDate().getDate()
    }
    
    // Se for uma string ou número
    const date = new Date(dateString)
    
    // Verifica se é uma data válida
    if (isNaN(date.getTime())) {
      return '?'
    }
    
    return date.getDate()
  } catch (error) {
    console.error('Erro ao formatar dia:', error, dateString)
    return '?'
  }
}

const formatMonth = (dateString) => {
  if (!dateString) return '?'
  
  try {
    // Se for um Timestamp do Firestore
    if (dateString.toDate && typeof dateString.toDate === 'function') {
      return dateString.toDate().toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()
    }
    
    // Se for uma string ou número
    const date = new Date(dateString)
    
    // Verifica se é uma data válida
    if (isNaN(date.getTime())) {
      return '?'
    }
    
    return date.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()
  } catch (error) {
    console.error('Erro ao formatar mês:', error, dateString)
    return '?'
  }
}

const getPostTypeLabel = (tipo) => {
  const labels = {
    'text': '💭 Pensamento',
    'confirmacao': '✅ Confirmação',
    'foto': '📸 Foto',
    'localizacao': '📍 Localização',
    'comentario': '💬 Comentário'
  }
  return labels[tipo] || '📝 Post'
}

const togglePostMenu = (postId) => {
  console.log('🔵 [Home] Toggle menu do post:', postId)
  activePostMenu.value = activePostMenu.value === postId ? null : postId
}

const editPost = (post) => {
  console.log('🔵 [Home] Editando post:', post.id)
  editingPostId.value = post.id
  editingContent.value = post.conteudo
  activePostMenu.value = null
}

const cancelEdit = () => {
  console.log('🔵 [Home] Cancelando edição')
  editingPostId.value = null
  editingContent.value = ''
}

const saveEdit = async (post) => {
  console.log('🔵 [Home] Salvando edição do post:', post.id)
  
  if (!editingContent.value.trim()) {
    console.log('⚠️ [Home] Conteúdo vazio')
    return
  }
  
  if (editingContent.value.length > 500) {
    console.log('⚠️ [Home] Conteúdo muito longo')
    return
  }
  
  try {
    // Chamar o serviço para editar no Firestore
    console.log('🔄 [Home] Chamando feedService.editarPost...')
    await feedService.editarPost(post.userId, post.id, editingContent.value)
    
    console.log('✅ [Home] Post editado com sucesso!')
    postMessage.value = 'Post editado com sucesso! ✅'
    setTimeout(() => postMessage.value = '', 3000)
    
    cancelEdit()
  } catch (error) {
    console.error('❌ [Home] Erro ao editar post:', error)
    postMessage.value = 'Erro ao editar post: ' + error.message
    setTimeout(() => postMessage.value = '', 3000)
  }
}

const confirmDeletePost = (post) => {
  console.log('🔵 [Home] Confirmando exclusão do post:', post.id)
  
  if (confirm('Tem certeza que deseja excluir este post? Esta ação não pode ser desfeita.')) {
    deletePost(post)
  }
  
  activePostMenu.value = null
}

const deletePost = async (post) => {
  console.log('🔵 [Home] Excluindo post:', post.id)
  
  try {
    deletingPostId.value = post.id
    
    // Chamar o serviço para excluir do Firestore
    console.log('🔄 [Home] Chamando feedService.excluirPost...')
    await feedService.excluirPost(post.userId, post.id)
    
    console.log('✅ [Home] Post excluído com sucesso!')
    postMessage.value = 'Post excluído com sucesso! ✅'
    setTimeout(() => postMessage.value = '', 3000)
  } catch (error) {
    console.error('❌ [Home] Erro ao excluir post:', error)
    postMessage.value = 'Erro ao excluir post: ' + error.message
    setTimeout(() => postMessage.value = '', 3000)
  } finally {
    deletingPostId.value = null
  }
}

// Fechar menu ao clicar fora
const handleClickOutside = (event) => {
  if (!event.target.closest('.post-menu')) {
    activePostMenu.value = null
  }
}

onMounted(() => {
  console.log('🔵 [Home] Componente montado')
  loadUserStats()
  loadPosts()
  loadUpcomingRaces()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  console.log('🔵 [Home] Componente desmontado, limpando listeners')
  if (unsubscribePosts) {
    unsubscribePosts()
  }
  document.removeEventListener('click', handleClickOutside)
})
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

/* Estilos Profissionais para Create Post Card */

.create-post-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 
    0 10px 40px rgba(0,0,0,0.08),
    0 2px 8px rgba(0,0,0,0.04);
  border: 1px solid rgba(255,255,255,0.8);
  transition: all 0.3s ease;
}

.create-post-card:hover {
  box-shadow: 
    0 15px 50px rgba(0,0,0,0.12),
    0 5px 15px rgba(0,0,0,0.06);
  transform: translateY(-2px);
}

.create-post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
}

.user-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: rgba(102, 126, 234, 0.4);
}

.user-greeting {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.greeting-text {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d3748;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.greeting-subtext {
  font-size: 0.875rem;
  color: #718096;
  font-weight: 500;
}

.post-input-wrapper {
  margin-bottom: 1rem;
}

.post-textarea {
  width: 100%;
  min-height: 100px;
  padding: 1rem 1.25rem;
  border: 2px solid rgba(102, 126, 234, 0.15);
  border-radius: 16px;
  font-size: 15px;
  font-family: inherit;
  color: #2d3748;
  background: rgba(248, 249, 250, 0.5);
  resize: vertical;
  transition: all 0.3s ease;
  line-height: 1.6;
}

.post-textarea:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.5);
  background: white;
  box-shadow: 
    0 0 0 4px rgba(102, 126, 234, 0.08),
    0 4px 12px rgba(102, 126, 234, 0.1);
}

.post-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.post-textarea::placeholder {
  color: #a0aec0;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
  padding: 0 0.5rem;
}

.char-count {
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 600;
  transition: color 0.3s ease;
}

.char-count.char-limit {
  color: #e53e3e;
}

.post-actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.post-options {
  display: flex;
  gap: 0.5rem;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 600;
  color: #667eea;
}

.option-btn:not(:disabled):hover {
  background: rgba(102, 126, 234, 0.15);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.15);
}

.option-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.option-text {
  font-size: 0.875rem;
}

.publish-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 
    0 4px 15px rgba(102, 126, 234, 0.3),
    0 2px 8px rgba(102, 126, 234, 0.2);
  position: relative;
  overflow: hidden;
}

.publish-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.publish-btn:hover::before {
  left: 100%;
}

.publish-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(102, 126, 234, 0.4),
    0 4px 12px rgba(102, 126, 234, 0.3);
}

.publish-btn:active:not(:disabled) {
  transform: translateY(0);
}

.publish-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-icon {
  font-size: 1.25rem;
  display: flex;
  align-items: center;
}

.btn-text {
  font-size: 15px;
  letter-spacing: 0.3px;
}

.post-feedback {
  margin-top: 1rem;
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%);
  border: 1px solid rgba(72, 187, 120, 0.3);
  border-radius: 12px;
  color: #2f855a;
  font-size: 0.9rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(72, 187, 120, 0.1);
}

.feedback-icon {
  font-size: 1.25rem;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Estilos Profissionais para Feed */

.feed {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.empty-feed {
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 4rem 2rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.8);
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-feed h3 {
  margin: 0 0 0.5rem 0;
  color: #2d3748;
  font-size: 1.5rem;
  font-weight: 700;
}

.empty-feed p {
  color: #718096;
  font-size: 1rem;
  margin: 0;
}

.post-card {
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.95) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 1.75rem;
  box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.8);
  transition: all 0.3s ease;
}

.post-card:hover {
  box-shadow: 0 15px 50px rgba(0,0,0,0.12);
  transform: translateY(-3px);
}

.post-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.post-author {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.author-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.author-name {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #2d3748;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #a0aec0;
}

.meta-separator {
  color: #cbd5e0;
}

.post-type {
  font-weight: 600;
}

.edited-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #718096;
  font-weight: 600;
  font-style: italic;
}

.post-menu {
  position: relative;
}

.post-menu-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  color: #a0aec0;
  font-size: 1.5rem;
  line-height: 1;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.post-menu-btn:hover {
  background: rgba(0,0,0,0.05);
  color: #718096;
}

.post-menu-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 
    0 10px 40px rgba(0,0,0,0.15),
    0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.08);
  min-width: 180px;
  overflow: hidden;
  z-index: 100;
}

.menu-option {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9375rem;
  font-weight: 600;
  text-align: left;
  color: #2d3748;
}

.menu-option:hover {
  background: rgba(102, 126, 234, 0.08);
}

.menu-option.delete-option:hover {
  background: rgba(239, 68, 68, 0.08);
  color: #e53e3e;
}

.menu-icon {
  font-size: 1.125rem;
  display: flex;
  align-items: center;
}

.menu-text {
  flex: 1;
}

.menu-fade-enter-active, .menu-fade-leave-active {
  transition: all 0.2s ease;
}

.menu-fade-enter-from, .menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.95);
}

/* Modo de Edição */

.post-edit-mode {
  margin-bottom: 1.25rem;
}

.edit-textarea {
  width: 100%;
  min-height: 100px;
  padding: 1rem 1.25rem;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-radius: 12px;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #2d3748;
  background: rgba(248, 249, 250, 0.5);
  resize: vertical;
  transition: all 0.3s ease;
  line-height: 1.7;
}

.edit-textarea:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.6);
  background: white;
  box-shadow: 
    0 0 0 4px rgba(102, 126, 234, 0.1),
    0 4px 12px rgba(102, 126, 234, 0.15);
}

.edit-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0,0,0,0.06);
}

.edit-char-count {
  font-size: 0.75rem;
  color: #a0aec0;
  font-weight: 600;
}

.edit-char-count.char-limit {
  color: #e53e3e;
}

.edit-buttons {
  display: flex;
  gap: 0.5rem;
}

.cancel-edit-btn,
.save-edit-btn {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.cancel-edit-btn {
  background: rgba(0,0,0,0.05);
  color: #718096;
}

.cancel-edit-btn:hover {
  background: rgba(0,0,0,0.1);
}

.save-edit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.save-edit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.save-edit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.post-body {
  margin-bottom: 1.25rem;
}

.post-text {
  margin: 0 0 1rem 0;
  line-height: 1.7;
  color: #2d3748;
  font-size: 0.9375rem;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.post-media {
  width: 100%;
  max-height: 500px;
  object-fit: cover;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.post-footer {
  border-top: 1px solid rgba(0,0,0,0.06);
  padding-top: 1rem;
}

.post-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.875rem;
  color: #718096;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.stat-icon {
  font-size: 1rem;
}

.stat-count {
  font-weight: 600;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(0,0,0,0.02);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 600;
  font-size: 0.875rem;
  color: #718096;
}

.action-button:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  transform: translateY(-1px);
}

.action-button.active {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.action-icon {
  font-size: 1.125rem;
}

.action-label {
  font-size: 0.875rem;
}

/* Sidebar Styles */

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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
  transition: all 0.3s ease;
}

.race-item:hover {
  transform: translateX(4px);
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
  flex-shrink: 0;
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
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.race-info h4 {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: #2d3748;
  line-height: 1.3;
}

.race-location {
  margin: 0;
  color: #718096;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.race-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.race-distances {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.distance-tag {
  background: rgba(59, 130, 246, 0.12);
  color: #3b82f6;
  padding: 0.25rem 0.625rem;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 600;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.more-distances {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
}

.race-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 12px;
  color: #4a5568;
}

.meta-item.valores-meta {
  flex-direction: column;
  align-items: flex-start;
  gap: 0.125rem;
}

.meta-item.valores-meta .meta-text {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.valor-60-tag {
  color: #f59e0b;
  font-weight: 600;
  font-size: 11px;
}

.meta-icon {
  font-size: 13px;
}

.meta-text {
  font-weight: 600;
}

.race-details-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  text-decoration: none;
  margin-top: 0.25rem;
  transition: all 0.2s ease;
}

.race-details-link:hover {
  color: #764ba2;
  gap: 0.5rem;
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
  text-decoration: none;
  display: block;
  text-align: center;
}

.view-all-btn:hover {
  background: rgba(102, 126, 234, 0.2);
}

.widget .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  gap: 0.75rem;
}

.widget .spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.widget .loading-state p {
  color: #666;
  font-size: 0.875rem;
  margin: 0;
}

.widget .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
  gap: 0.5rem;
}

.widget .empty-icon {
  font-size: 2.5rem;
  opacity: 0.4;
  margin-bottom: 0.5rem;
}

.widget .empty-state p {
  color: #666;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
}

.widget .create-race-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
}

.widget .create-race-link:hover {
  color: #5568d3;
  text-decoration: underline;
}

/* Responsive */

/* Preview de Imagem */

.image-preview-container {
  position: relative;
  margin-top: 1rem;
  border-radius: 12px;
  overflow: hidden;
  max-width: 100%;
}

.image-preview {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  display: block;
  border-radius: 12px;
}

.remove-preview-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  transition: all 0.2s ease;
  z-index: 10;
}

.remove-preview-btn:hover {
  background: rgba(239, 68, 68, 0.9);
  transform: scale(1.1);
}

/* Preview de Localização */

.location-preview-container {
  margin-top: 1rem;
}

.location-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(102, 126, 234, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 12px;
  position: relative;
}

.location-icon {
  font-size: 1.25rem;
}

.location-text {
  flex: 1;
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-location-btn {
  background: rgba(239, 68, 68, 0.1);
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #e53e3e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-location-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: scale(1.1);
}

/* Emoji Picker */

.emoji-picker-wrapper {
  position: relative;
}

.option-btn.active {
  background: rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.emoji-picker {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  left: 0;
  background: white;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 
    0 10px 40px rgba(0,0,0,0.15),
    0 2px 8px rgba(0,0,0,0.1);
  border: 1px solid rgba(0,0,0,0.08);
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  z-index: 100;
  min-width: 240px;
}

.emoji-btn {
  background: rgba(0,0,0,0.02);
  border: 1px solid rgba(0,0,0,0.05);
  border-radius: 8px;
  padding: 0.5rem;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.emoji-btn:hover {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.15);
}

.emoji-fade-enter-active, .emoji-fade-leave-active {
  transition: all 0.2s ease;
}

.emoji-fade-enter-from, .emoji-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}

/* Localização no Post */

.post-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(102, 126, 234, 0.15);
  border-radius: 10px;
}

.post-location .location-icon {
  font-size: 1.125rem;
  color: #667eea;
}

.post-location .location-name {
  font-size: 0.875rem;
  color: #2d3748;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsive */

@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
  }
}

@media (max-width: 768px) {
  .create-post-card {
    padding: 1.5rem;
  }
  
  .post-actions-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .post-options {
    justify-content: space-between;
  }
  
  .option-text {
    display: none;
  }
  
  .publish-btn {
    width: 100%;
    justify-content: center;
  }
  
  .action-label {
    display: none;
  }
  
  .action-button {
    padding: 0.75rem;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
