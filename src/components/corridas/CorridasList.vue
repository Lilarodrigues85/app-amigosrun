<template>
  <div class="corridas-list">
    <div class="list-header">
      <h2>Corridas Disponíveis</h2>
      <button @click="showForm = true" class="btn-add">
        ➕ Nova Corrida
      </button>
    </div>

    <div v-if="loading" class="loading">
      Carregando corridas...
    </div>

    <div v-else-if="corridas.length === 0" class="empty-state">
      <p>Nenhuma corrida encontrada</p>
      <button @click="showForm = true" class="btn-primary">
        Cadastrar primeira corrida
      </button>
    </div>

    <div v-else class="corridas-grid">
      <div v-for="corrida in corridas" :key="corrida.id" class="corrida-card">
        <div v-if="corrida.imagem" class="corrida-image">
          <img 
            :src="corrida.imagem" 
            :alt="corrida.titulo"
            loading="lazy"
            decoding="async"
          />
        </div>
        
        <div class="corrida-content">
          <div class="corrida-header">
            <h3>{{ corrida.titulo }}</h3>
          </div>

          <div v-if="corrida.distancias && corrida.distancias.length > 0" class="distancias-badges">
            <span 
              v-for="distancia in corrida.distancias" 
              :key="distancia"
              class="distance-badge"
            >
              {{ distancia }}
            </span>
          </div>

          <div class="corrida-info">
            <div class="info-item">
              <span class="icon">📅</span>
              <span>{{ formatDate(corrida.data) }}</span>
            </div>
            
            <div class="info-item">
              <span class="icon">📍</span>
              <span>{{ corrida.local }}</span>
            </div>
            
            <div v-if="corrida.valor || corrida.valor60" class="info-item valores">
              <span class="icon">💰</span>
              <div class="valores-container">
                <span v-if="corrida.valor" class="valor-item">
                  Geral: R$ {{ formatPrice(corrida.valor) }}
                </span>
                <span v-if="corrida.valor60" class="valor-item valor-60">
                  60+: R$ {{ formatPrice(corrida.valor60) }}
                </span>
              </div>
            </div>
            
            <div v-if="corrida.vagas" class="info-item">
              <span class="icon">👥</span>
              <span>{{ corrida.participantes?.length || 0 }}/{{ corrida.vagas }} vagas</span>
            </div>
          </div>

          <div v-if="corrida.descricao" class="corrida-descricao">
            <div 
              v-for="(linha, index) in formatDescricao(corrida.descricao)" 
              :key="index"
              class="descricao-item"
            >
              <span class="descricao-icon">{{ linha.icon }}</span>
              <span class="descricao-text">{{ linha.text }}</span>
            </div>
          </div>

          <div class="corrida-actions">
            <PresencaButton :corrida-id="corrida.id" />
            
            <div class="corrida-actions-buttons">
              <button 
                v-if="corrida.linkInscricao" 
                @click="openLink(corrida.linkInscricao)"
                class="btn-inscricao"
              >
                Inscrever-se
              </button>
              
              <button 
                v-if="canEdit(corrida)"
                @click="editCorrida(corrida)"
                class="btn-edit"
              >
                Editar
              </button>
            </div>
          </div>

          <div class="corrida-footer">
            <small>Por {{ corrida.organizadorNome }}</small>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal do formulário -->
    <div v-if="showForm" class="modal-overlay" @click="closeForm">
      <div class="modal-content" @click.stop>
        <CorridaForm 
          :corrida="editingCorrida"
          :is-edit="!!editingCorrida"
          @success="handleFormSuccess"
          @cancel="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { corridaService } from '@/services/corridaService'
import { useAuth } from '@/composables/useAuth'
import CorridaForm from './CorridaForm.vue'
import PresencaButton from '@/components/social/PresencaButton.vue'

const { user, isInitialized } = useAuth()

const corridas = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingCorrida = ref(null)

const loadCorridas = async () => {
  // Only load if Firebase is initialized
  if (!isInitialized.value) {
    console.log('Firebase not initialized yet, waiting...')
    return
  }

  try {
    loading.value = true
    console.log('Loading corridas...')
    corridas.value = await corridaService.getCorridas()
  } catch (error) {
    console.error('Erro ao carregar corridas:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatPrice = (price) => {
  return parseFloat(price).toFixed(2).replace('.', ',')
}

const formatDescricao = (descricao) => {
  if (!descricao) return []
  
  // Divide a descrição por linhas
  const linhas = descricao.split('\n').filter(linha => linha.trim())
  
  return linhas.map(linha => {
    // Remove espaços extras
    const texto = linha.trim()
    
    // Detecta se a linha começa com emoji
    const emojiMatch = texto.match(/^([\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u)
    
    if (emojiMatch) {
      // Se tem emoji no início, usa ele
      return {
        icon: emojiMatch[0],
        text: texto.substring(emojiMatch[0].length).trim()
      }
    } else {
      // Se não tem emoji, usa um padrão
      return {
        icon: '•',
        text: texto
      }
    }
  })
}

const canEdit = (corrida) => {
  return user.value && corrida.organizador === user.value.uid
}

const editCorrida = (corrida) => {
  editingCorrida.value = corrida
  showForm.value = true
}

const openLink = (url) => {
  window.open(url, '_blank')
}

const closeForm = () => {
  showForm.value = false
  editingCorrida.value = null
}

const handleFormSuccess = () => {
  closeForm()
  loadCorridas()
}

// Watch for Firebase initialization
watch(isInitialized, (initialized) => {
  if (initialized) {
    console.log('Firebase initialized, loading corridas')
    loadCorridas()
  }
}, { immediate: true })

onMounted(() => {
  // Only load if already initialized
  if (isInitialized.value) {
    loadCorridas()
  }
})
</script>

<style scoped>
.corridas-list {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  padding: 2rem;
  padding-top: calc(2rem + env(safe-area-inset-top)); /* Safe area iOS */
  padding-bottom: calc(2rem + env(safe-area-inset-bottom));
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.list-header h2 {
  color: white;
  margin: 0;
}

.btn-add {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 0.75rem 1.5rem;
  min-height: 44px; /* Touch target */
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  background: rgba(255,255,255,0.3);
}

.loading,
.empty-state {
  text-align: center;
  color: white;
  padding: 4rem 2rem;
}

.btn-primary {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 1rem 2rem;
  min-height: 44px; /* Touch target */
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.corridas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.corrida-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.corrida-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.15);
}

.corrida-image {
  height: 160px;
  overflow: hidden;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.corrida-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
}

.corrida-content {
  padding: 1.25rem;
}

.corrida-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.corrida-header h3 {
  color: white;
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
}

.distancias-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.distance-badge {
  background: rgba(59, 130, 246, 0.3);
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(59, 130, 246, 0.5);
  font-weight: 500;
}

.corrida-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  color: rgba(255,255,255,0.9);
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.info-item.valores {
  align-items: flex-start;
}

.valores-container {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.valor-item {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.9);
}

.valor-60 {
  color: rgba(251, 191, 36, 1);
  font-weight: 600;
}

.info-item .icon {
  margin-right: 0.5rem;
  width: 18px;
  font-size: 0.9rem;
}

.corrida-descricao {
  background: rgba(139, 92, 246, 0.15);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 1rem;
}

.descricao-item {
  display: flex;
  align-items: flex-start;
  color: rgba(255,255,255,0.95);
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  line-height: 1.4;
}

.descricao-item:last-child {
  margin-bottom: 0;
}

.descricao-icon {
  margin-right: 0.6rem;
  font-size: 1rem;
  min-width: 20px;
  display: inline-block;
  flex-shrink: 0;
}

.descricao-text {
  flex: 1;
}

.corrida-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.corrida-actions > :first-child {
  width: 100%;
}

.corrida-actions-buttons {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.btn-inscricao,
.btn-edit {
  padding: 0.5rem 1rem;
  min-height: 44px; /* Touch target */
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-inscricao {
  background: rgba(16, 185, 129, 0.8);
  color: white;
}

.btn-inscricao:hover {
  background: rgba(16, 185, 129, 1);
}

.btn-edit {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-edit:hover {
  background: rgba(255,255,255,0.3);
}

.corrida-footer {
  color: rgba(255,255,255,0.6);
  font-size: 0.75rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: visible;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .corridas-list {
    padding: 1rem;
    padding-top: calc(1rem + env(safe-area-inset-top));
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }
  
  .list-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .corridas-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    max-height: 95vh;
  }
}

@media (max-width: 480px) {
  .corridas-list {
    padding: 0.75rem;
    padding-top: calc(0.75rem + env(safe-area-inset-top));
    padding-bottom: calc(0.75rem + env(safe-area-inset-bottom));
  }
  
  .list-header h2 {
    font-size: 1.25rem;
  }
  
  .btn-add {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }
  
  .corrida-card {
    border-radius: 8px;
  }
  
  .corrida-content {
    padding: 1rem;
  }
  
  .corrida-header h3 {
    font-size: 1rem;
  }
  
  .distance-badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.7rem;
  }
  
  .info-item {
    font-size: 0.8rem;
  }
  
  .descricao-item {
    font-size: 0.75rem;
  }
  
  .btn-inscricao,
  .btn-edit {
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
  
  /* Modal full-screen em mobile pequeno */
  .modal-overlay {
    padding: 0;
  }
  
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
}

/* Orientação landscape */
@media (max-height: 500px) and (orientation: landscape) {
  .corridas-list {
    padding: 0.5rem;
  }
  
  .corrida-image {
    height: 120px;
  }
  
  .modal-content {
    max-height: 95vh;
  }
}
</style>