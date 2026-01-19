<template>
  <div class="corrida-form">
    <div class="form-header">
      <h2>{{ isEdit ? 'Editar Corrida' : 'Nova Corrida' }}</h2>
      <button type="button" @click="$emit('cancel')" class="btn-close">
        <span>✕</span>
      </button>
    </div>
    
    <form @submit.prevent="handleSubmit" class="form-content">
      <div class="form-section">
        <h3 class="section-title">Informações Básicas</h3>
        
        <div class="form-group">
          <label>Título da Corrida <span class="required">*</span></label>
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
            <label>Data e Hora <span class="required">*</span></label>
            <input
              v-model="form.data"
              type="datetime-local"
              required
              :min="minDate"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Local <span class="required">*</span></label>
            <input
              v-model="form.local"
              type="text"
              required
              placeholder="Ex: Parque Ibirapuera, São Paulo"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Distâncias Disponíveis <span class="required">*</span></h3>
        <div class="distancias-grid">
          <label 
            v-for="opcao in opcoesDistancia" 
            :key="opcao.value"
            class="distancia-checkbox"
            :class="{ active: form.distancias.includes(opcao.value) }"
          >
            <input
              type="checkbox"
              :value="opcao.value"
              v-model="form.distancias"
            />
            <span class="checkbox-label">{{ opcao.label }}</span>
          </label>
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Detalhes do Evento</h3>
        
        <div class="form-row">
          <div class="form-group">
            <label>Valor de Inscrição (Geral)</label>
            <div class="input-with-prefix">
              <span class="prefix">R$</span>
              <input
                v-model="form.valor"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                class="form-input with-prefix"
              />
            </div>
          </div>
          
          <div class="form-group">
            <label>Valor 60+ (Idosos)</label>
            <div class="input-with-prefix">
              <span class="prefix">R$</span>
              <input
                v-model="form.valor60"
                type="number"
                min="0"
                step="0.01"
                placeholder="0,00"
                class="form-input with-prefix"
              />
            </div>
            <small class="field-hint">Valor especial para maiores de 60 anos</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Número de Vagas</label>
            <input
              v-model="form.vagas"
              type="number"
              min="1"
              placeholder="100"
              class="form-input"
            />
          </div>
          
          <div class="form-group">
            <label>Link de Inscrição</label>
            <input
              v-model="form.linkInscricao"
              type="url"
              placeholder="https://exemplo.com/inscricao"
              class="form-input"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Descrição</label>
          <textarea
            v-model="form.descricao"
            rows="4"
            placeholder="Descreva os detalhes da corrida, percurso, premiação, etc..."
            class="form-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Link de Inscrição</label>
          <input
            v-model="form.linkInscricao"
            type="url"
            placeholder="https://exemplo.com/inscricao"
            class="form-input"
          />
        </div>
      </div>

      <div class="form-section">
        <h3 class="section-title">Imagem do Evento</h3>
        
        <div class="upload-area">
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="file-input"
            id="file-upload"
          />
          <label for="file-upload" class="upload-label">
            <div v-if="!form.imagem && !uploading" class="upload-placeholder">
              <span class="upload-icon">📷</span>
              <span class="upload-text">Clique para selecionar uma imagem</span>
              <span class="upload-hint">PNG, JPG ou JPEG até 10MB</span>
            </div>
            <div v-if="uploading" class="upload-loading">
              <div class="spinner"></div>
              <span>Enviando imagem...</span>
            </div>
            <div v-if="form.imagem && !uploading" class="upload-preview">
              <img :src="form.imagem" alt="Preview" />
              <span class="upload-success">✓ Imagem carregada</span>
            </div>
          </label>
        </div>
      </div>

      <div v-if="message" :class="['message', messageType]">
        {{ message }}
      </div>

      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn-secondary">
          Cancelar
        </button>
        <button type="submit" :disabled="loading || form.distancias.length === 0" class="btn-primary">
          <span v-if="!loading">{{ isEdit ? '💾 Atualizar Corrida' : '✨ Criar Corrida' }}</span>
          <span v-else class="loading-text">
            <div class="spinner-small"></div>
            Salvando...
          </span>
        </button>
      </div>
    </form>
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

const opcoesDistancia = [
  { value: '3K', label: '3K' },
  { value: '5K', label: '5K' },
  { value: '10K', label: '10K' },
  { value: '15K', label: '15K' },
  { value: '21K', label: 'Meia Maratona (21K)' },
  { value: '42K', label: 'Maratona (42K)' },
  { value: 'Caminhada', label: 'Caminhada' },
  { value: 'Outro', label: 'Outro' }
]

const form = ref({
  titulo: '',
  data: '',
  local: '',
  latitude: null,
  longitude: null,
  distancias: [],
  valor: null,
  valor60: null,
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
    const imageUrl = await cloudinaryService.uploadCorridaImage(file)
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
    // Prepara os dados garantindo tipos corretos
    const corridaData = {
      titulo: form.value.titulo,
      data: form.value.data,
      local: form.value.local,
      latitude: form.value.latitude,
      longitude: form.value.longitude,
      distancias: form.value.distancias,
      valor: form.value.valor ? parseFloat(form.value.valor) : null,
      valor60: form.value.valor60 ? parseFloat(form.value.valor60) : null,
      vagas: form.value.vagas ? parseInt(form.value.vagas) : null,
      descricao: form.value.descricao,
      linkInscricao: form.value.linkInscricao,
      imagem: form.value.imagem,
      organizador: user.value.uid,
      organizadorNome: user.value.displayName || user.value.email
    }

    console.log('📝 Dados da corrida a serem salvos:', corridaData)

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
    console.error('❌ Erro ao salvar corrida:', error)
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
    distancias: [],
    valor: null,
    valor60: null,
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
    console.log('📝 Editando corrida:', props.corrida)
    
    form.value = { 
      titulo: props.corrida.titulo || '',
      data: props.corrida.data || '',
      local: props.corrida.local || '',
      latitude: props.corrida.latitude || null,
      longitude: props.corrida.longitude || null,
      distancias: props.corrida.distancias || [],
      valor: props.corrida.valor || null,
      valor60: props.corrida.valor60 || null, // Garante compatibilidade com corridas antigas
      vagas: props.corrida.vagas || null,
      descricao: props.corrida.descricao || '',
      linkInscricao: props.corrida.linkInscricao || '',
      imagem: props.corrida.imagem || null,
      organizador: props.corrida.organizador || null
    }
    
    console.log('📝 Formulário preenchido com:', form.value)
  }
})
</script>

<style scoped>
.corrida-form {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px 12px 0 0;
}

.form-header h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.btn-close {
  background: rgba(255,255,255,0.2);
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: rgba(255,255,255,0.3);
  transform: rotate(90deg);
}

.btn-close span {
  color: white;
  font-size: 20px;
  font-weight: 300;
}

.form-content {
  padding: 2rem;
  max-height: calc(90vh - 180px);
  overflow-y: auto;
}

.form-content::-webkit-scrollbar {
  width: 8px;
}

.form-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.form-content::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.form-content::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-title {
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

.form-group label {
  display: block;
  color: #374151;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
}

.required {
  color: #ef4444;
  margin-left: 2px;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: #1f2937;
  font-size: 0.95rem;
  box-sizing: border-box;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:hover {
  border-color: #cbd5e1;
}

textarea.form-input {
  resize: vertical;
  min-height: 100px;
  line-height: 1.5;
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.prefix {
  position: absolute;
  left: 1rem;
  color: #6b7280;
  font-weight: 500;
  pointer-events: none;
  z-index: 1;
}

.form-input.with-prefix {
  padding-left: 2.5rem;
}

.field-hint {
  display: block;
  margin-top: 0.375rem;
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
}

.distancias-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.distancia-checkbox {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.distancia-checkbox:hover {
  background: #f3f4f6;
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.distancia-checkbox.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.distancia-checkbox.active .checkbox-label {
  color: white;
  font-weight: 600;
}

.distancia-checkbox input[type="checkbox"] {
  margin-right: 0.75rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.checkbox-label {
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 500;
}

.upload-area {
  margin-top: 0.5rem;
}

.file-input {
  display: none;
}

.upload-label {
  display: block;
  cursor: pointer;
}

.upload-placeholder,
.upload-loading,
.upload-preview {
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.upload-placeholder:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.upload-icon {
  font-size: 3rem;
}

.upload-text {
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
}

.upload-hint {
  color: #9ca3af;
  font-size: 0.85rem;
}

.upload-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  border-style: solid;
  border-color: #667eea;
  background: #f0f4ff;
}

.upload-preview {
  border-style: solid;
  border-color: #10b981;
  background: #f0fdf4;
  padding: 1rem;
}

.upload-preview img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  object-fit: cover;
}

.upload-success {
  color: #10b981;
  font-weight: 600;
  font-size: 0.9rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 0.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.success {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #10b981;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #ef4444;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 2px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #cbd5e1;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-text {
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .form-header {
    padding: 1.25rem 1.5rem;
  }
  
  .form-header h2 {
    font-size: 1.25rem;
  }
  
  .form-content {
    padding: 1.5rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .distancias-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.5rem;
  }
  
  .distancia-checkbox {
    padding: 0.6rem 0.8rem;
  }
  
  .checkbox-label {
    font-size: 0.85rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style>