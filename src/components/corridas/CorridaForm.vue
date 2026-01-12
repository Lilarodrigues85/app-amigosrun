<template>
  <div class="corrida-form-container">
    <div class="form-card">
      <h2>{{ isEdit ? 'Editar Corrida' : 'Nova Corrida' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Título da Corrida *</label>
          <input
            v-model="form.titulo"
            type="text"
            required
            placeholder="Ex: Corrida do Parque"
            class="form-input"
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Data *</label>
            <input
              v-model="form.data"
              type="datetime-local"
              required
              :min="minDate"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Distância</label>
            <select v-model="form.distancia" class="form-input">
              <option value="">Selecione</option>
              <option value="5K">5K</option>
              <option value="10K">10K</option>
              <option value="15K">15K</option>
              <option value="21K">Meia Maratona (21K)</option>
              <option value="42K">Maratona (42K)</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Local *</label>
          <input
            v-model="form.local"
            type="text"
            required
            placeholder="Ex: Parque Ibirapuera, São Paulo"
            class="form-input"
            @click="abrirSeletorMapa"
            readonly
          />
          <button type="button" @click="abrirSeletorMapa" class="btn-mapa">
            🗺️ Selecionar no Mapa
          </button>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Valor de Inscrição</label>
            <input
              v-model="form.valor"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Vagas</label>
            <input
              v-model="form.vagas"
              type="number"
              min="1"
              placeholder="100"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea
            v-model="form.descricao"
            rows="4"
            placeholder="Descreva os detalhes da corrida..."
            class="form-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Link de Inscrição</label>
          <input
            v-model="form.linkInscricao"
            type="url"
            placeholder="https://..."
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label>Imagem do Evento</label>
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="form-input"
          />
          <div v-if="uploading" class="upload-status">
            Enviando imagem...
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="$emit('cancel')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" :disabled="loading" class="btn-submit">
            {{ loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Criar Corrida') }}
          </button>
        </div>
      </form>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { corridaService } from '@/services/corridaService'
import { cloudinaryService } from '@/services/cloudinaryService'
import { useAuth } from '@/composables/useAuth'

const props = defineProps({
  corrida: Object,
  isEdit: { type: Boolean, default: false }
})

const emit = defineEmits(['success', 'cancel'])

const { user } = useAuth()

const form = ref({
  titulo: '',
  data: '',
  local: '',
  latitude: null,
  longitude: null,
  distancia: '',
  valor: null,
  vagas: null,
  descricao: '',
  linkInscricao: '',
  imagem: null,
  organizador: null
})

const loading = ref(false)
const uploading = ref(false)
const message = ref('')
const messageType = ref('success')

const minDate = computed(() => {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
})

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    uploading.value = true
    const imageUrl = await cloudinaryService.uploadImage(file)
    form.value.imagem = imageUrl
    showMessage('Imagem enviada com sucesso!')
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    uploading.value = false
  }
}

const handleSubmit = async () => {
  loading.value = true
  
  try {
    const corridaData = {
      ...form.value,
      organizador: user.value.uid,
      organizadorNome: user.value.displayName || user.value.email
    }

    if (props.isEdit) {
      await corridaService.updateCorrida(props.corrida.id, corridaData)
      showMessage('Corrida atualizada com sucesso!')
    } else {
      await corridaService.createCorrida(corridaData)
      showMessage('Corrida criada com sucesso!')
      resetForm()
    }
    
    emit('success')
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    loading.value = false
  }
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const resetForm = () => {
  form.value = {
    titulo: '',
    data: '',
    local: '',
    latitude: null,
    longitude: null,
    distancia: '',
    valor: null,
    vagas: null,
    descricao: '',
    linkInscricao: '',
    imagem: null,
    organizador: null
  }
}

const abrirSeletorMapa = () => {
  // Simular seleção de coordenadas (implementação simplificada)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      form.value.latitude = position.coords.latitude
      form.value.longitude = position.coords.longitude
      form.value.local = `Localização Atual (${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)})`
    })
  }
}

onMounted(() => {
  if (props.isEdit && props.corrida) {
    form.value = { ...props.corrida }
  }
})
</script>

<style scoped>
.corrida-form-container {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.form-card {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-card h2 {
  color: white;
  text-align: center;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 8px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 16px;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.form-input:focus {
  outline: none;
  border-color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.15);
}

.upload-status {
  color: rgba(255,255,255,0.8);
  font-size: 14px;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-cancel:hover {
  background: rgba(255,255,255,0.2);
}

.btn-submit {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
}

.btn-submit:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-mapa {
  width: 100%;
  margin-top: 0.5rem;
  padding: 8px 12px;
  background: rgba(59, 130, 246, 0.2);
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.btn-mapa:hover {
  background: rgba(59, 130, 246, 0.3);
}

.message {
  margin-top: 1rem;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.message.success {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.message.error {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

@media (max-width: 768px) {
  .corrida-form-container {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>