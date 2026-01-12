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
          <img :src="corrida.imagem" :alt="corrida.titulo" />
        </div>
        
        <div class="corrida-content">
          <div class="corrida-header">
            <h3>{{ corrida.titulo }}</h3>
            <span v-if="corrida.distancia" class="distance-badge">
              {{ corrida.distancia }}
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
            
            <div v-if="corrida.valor" class="info-item">
              <span class="icon">💰</span>
              <span>R$ {{ formatPrice(corrida.valor) }}</span>
            </div>
            
            <div v-if="corrida.vagas" class="info-item">
              <span class="icon">👥</span>
              <span>{{ corrida.participantes?.length || 0 }}/{{ corrida.vagas }} vagas</span>
            </div>
          </div>

          <div v-if="corrida.descricao" class="corrida-description">
            <p>{{ corrida.descricao }}</p>
          </div>

          <div class="corrida-actions">
            <PresencaButton :corrida-id="corrida.id" />
            
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
import { ref, onMounted } from 'vue'
import { corridaService } from '@/services/corridaService'
import { useAuth } from '@/composables/useAuth'
import CorridaForm from './CorridaForm.vue'
import PresencaButton from '@/components/social/PresencaButton.vue'

const { user } = useAuth()

const corridas = ref([])
const loading = ref(true)
const showForm = ref(false)
const editingCorrida = ref(null)

const loadCorridas = async () => {
  try {
    loading.value = true
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

onMounted(() => {
  loadCorridas()
})
</script>

<style scoped>
.corridas-list {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  padding: 2rem;
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
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.corridas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.corrida-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
  overflow: hidden;
  transition: all 0.3s ease;
}

.corrida-card:hover {
  transform: translateY(-5px);
  background: rgba(255,255,255,0.15);
}

.corrida-image {
  height: 200px;
  overflow: hidden;
}

.corrida-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.corrida-content {
  padding: 1.5rem;
}

.corrida-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.corrida-header h3 {
  color: white;
  margin: 0;
  flex: 1;
}

.distance-badge {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-left: 1rem;
}

.corrida-info {
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  color: rgba(255,255,255,0.9);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.info-item .icon {
  margin-right: 0.5rem;
  width: 20px;
}

.corrida-description {
  margin-bottom: 1.5rem;
}

.corrida-description p {
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
  margin: 0;
}

.corrida-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.btn-inscricao,
.btn-edit {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-inscricao {
  background: rgba(16, 185, 129, 0.8);
  color: white;
  flex: 1;
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
  font-size: 0.8rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .corridas-list {
    padding: 1rem;
  }
  
  .list-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .corridas-grid {
    grid-template-columns: 1fr;
  }
}
</style>