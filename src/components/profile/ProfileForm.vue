<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-form">
        <h2>Complete seu Perfil</h2>
        <p class="profile-subtitle">
          📝 Complete suas informações para acessar todas as funcionalidades do app
        </p>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-columns">
            <!-- Coluna Esquerda -->
            <div class="form-column">
              <!-- Avatar Section -->
              <div class="photo-section">
                <img :src="avatarUrl" :alt="form.name || 'Avatar'" class="avatar" />
                
                <div class="photo-options">
                  <input 
                    type="file" 
                    ref="fileInput"
                    @change="handleFileUpload"
                    accept="image/*"
                    style="display: none"
                  />
                  
                  <button type="button" @click="$refs.fileInput.click()" :disabled="uploading">
                    {{ uploading ? 'Enviando...' : 'Escolher Foto' }}
                  </button>
                </div>
              </div>

              <!-- Personal Info -->
              <div class="form-group">
                <label>Nome Completo *</label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  required 
                  placeholder="Seu nome completo"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Peso (kg)</label>
                  <input 
                    v-model.number="form.weight" 
                    type="number" 
                    min="30" 
                    max="200" 
                    placeholder="70"
                  />
                </div>
                
                <div class="form-group">
                  <label>Altura (cm)</label>
                  <input 
                    v-model.number="form.height" 
                    type="number" 
                    min="100" 
                    max="250" 
                    placeholder="170"
                  />
                </div>
              </div>
            </div>

            <!-- Coluna Direita -->
            <div class="form-column">
              <!-- Estatísticas de Corrida -->
              <div class="stats-section">
                <h3>📊 Suas Estatísticas</h3>
                
                <div class="stats-grid">
                  <div class="form-group">
                    <label>Corridas Realizadas</label>
                    <input 
                      v-model.number="form.stats.totalRuns" 
                      type="number" 
                      min="0" 
                      placeholder="0"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label>Quilometragem Total (km)</label>
                    <input 
                      v-model.number="form.stats.totalDistance" 
                      type="number" 
                      min="0" 
                      step="0.1" 
                      placeholder="0"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label>Pace Médio (min/km)</label>
                    <input 
                      v-model="form.stats.averagePace" 
                      type="text" 
                      placeholder="5:30"
                    />
                  </div>
                  
                  <div class="form-group">
                    <label>Amigos Corredores</label>
                    <input 
                      v-model.number="form.stats.friends" 
                      type="number" 
                      min="0" 
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label>Meta de Corrida</label>
                <select v-model="form.goal">
                  <option value="">Selecione sua meta</option>
                  <option value="iniciante">Iniciante - Começar a correr</option>
                  <option value="5k">Correr 5K</option>
                  <option value="10k">Correr 10K</option>
                  <option value="21k">Meia Maratona (21K)</option>
                  <option value="42k">Maratona (42K)</option>
                  <option value="ultramaratona">Ultramaratona</option>
                </select>
              </div>

              <div class="form-group">
                <label>Biografia</label>
                <textarea 
                  v-model="form.bio" 
                  placeholder="Conte um pouco sobre você, sua experiência com corrida..."
                  rows="4"
                  maxlength="500"
                ></textarea>
                <small>{{ form.bio?.length || 0 }}/500 caracteres</small>
              </div>

              <div class="form-group">
                <label>
                  <input 
                    type="checkbox" 
                    v-model="form.showPersonalInfo"
                  />
                  Mostrar peso e altura publicamente
                </label>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="loading" class="save-btn">
              {{ loading ? 'Salvando...' : 'Salvar Perfil' }}
            </button>
          </div>
        </form>

        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </div>
    </div>
    
    <!-- Modal de Crop de Imagem -->
    <ImageCropModal 
      :show="showCropModal"
      :image-src="selectedImageSrc"
      @close="closeCropModal"
      @crop="handleCropComplete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/config'
import { avatarService } from '@/services/avatarService'
import { userService } from '@/services/userService'
import { cloudinaryService } from '@/services/cloudinaryService'
import ImageCropModal from '@/components/common/ImageCropModal.vue'

const router = useRouter()
const currentUser = ref(null)

onAuthStateChanged(auth, (user) => {
  console.log('🔵 [ProfileForm] onAuthStateChanged disparado')
  console.log('👤 [ProfileForm] User:', user ? {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL
  } : 'null')
  
  currentUser.value = user
  
  if (user) {
    console.log('✅ [ProfileForm] Usuário autenticado, carregando perfil...')
    loadProfile()
  } else {
    console.log('⚠️ [ProfileForm] Nenhum usuário autenticado')
  }
})

const form = ref({
  name: '',
  weight: null,
  height: null,
  goal: '',
  bio: '',
  photoUrl: null,
  showPersonalInfo: false,
  stats: {
    totalRuns: 0,
    totalDistance: 0,
    averagePace: '',
    friends: 0
  }
})


const customPhotoUrl = ref('')
const uploading = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('success')

// Estados do crop modal
const showCropModal = ref(false)
const selectedImageSrc = ref('')
const selectedFile = ref(null)



const avatarUrl = computed(() => {
  return avatarService.getAvatarUrl({
    name: form.value.name || 'Usuario',
    photoUrl: form.value.photoUrl
  })
})

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    cloudinaryService.validateFile(file)
    
    // Criar URL temporária para preview
    const reader = new FileReader()
    reader.onload = (e) => {
      selectedImageSrc.value = e.target.result
      selectedFile.value = file
      showCropModal.value = true
    }
    reader.readAsDataURL(file)
    
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    event.target.value = ''
  }
}

const handleCropComplete = async (croppedBlob) => {
  console.log('🔵 [ProfileForm] Iniciando handleCropComplete')
  console.log('📦 [ProfileForm] Blob recebido:', {
    size: croppedBlob.size,
    type: croppedBlob.type
  })
  
  try {
    uploading.value = true
    showCropModal.value = false
    
    // Criar arquivo a partir do blob
    const croppedFile = new File([croppedBlob], selectedFile.value.name, {
      type: 'image/jpeg',
      lastModified: Date.now()
    })
    
    console.log('📁 [ProfileForm] Arquivo criado:', {
      name: croppedFile.name,
      size: croppedFile.size,
      type: croppedFile.type
    })
    
    console.log('🔄 [ProfileForm] Enviando para Cloudinary...')
    const imageUrl = await cloudinaryService.uploadImage(croppedFile)
    
    console.log('✅ [ProfileForm] Upload concluído:', imageUrl)
    form.value.photoUrl = imageUrl
    
    showMessage('Foto atualizada com sucesso!')
  } catch (error) {
    console.error('❌ [ProfileForm] Erro no crop/upload:', error)
    console.error('❌ [ProfileForm] Stack trace:', error.stack)
    showMessage(error.message, 'error')
  } finally {
    uploading.value = false
    console.log('🏁 [ProfileForm] handleCropComplete finalizado')
  }
}

const closeCropModal = () => {
  showCropModal.value = false
  selectedImageSrc.value = ''
  selectedFile.value = null
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const handleSubmit = async () => {
  console.log('🔵 [ProfileForm] Iniciando handleSubmit')
  console.log('📋 [ProfileForm] Dados do formulário:', JSON.stringify(form.value, null, 2))
  
  if (!form.value.name.trim()) {
    console.log('❌ [ProfileForm] Validação falhou: Nome vazio')
    showMessage('Nome é obrigatório', 'error')
    return
  }

  console.log('✅ [ProfileForm] Validação passou')
  console.log('👤 [ProfileForm] Current User:', {
    uid: currentUser.value?.uid,
    email: currentUser.value?.email,
    displayName: currentUser.value?.displayName
  })

  loading.value = true
  
  try {
    const profileData = {
      ...form.value,
      photoUrl: form.value.photoUrl,
      updatedAt: new Date().toISOString()
    }
    
    console.log('📦 [ProfileForm] Dados preparados para salvar:', JSON.stringify(profileData, null, 2))
    console.log('🔄 [ProfileForm] Chamando userService.updateProfile...')
    
    await userService.updateProfile(currentUser.value.uid, profileData)
    
    console.log('✅ [ProfileForm] Perfil salvo com sucesso!')
    showMessage('Perfil salvo com sucesso!')
    
    // Emitir evento customizado para notificar que o perfil foi atualizado
    console.log('📢 [ProfileForm] Emitindo evento profile-updated')
    window.dispatchEvent(new CustomEvent('profile-updated'))
    
    // Após salvar o perfil, redireciona para Home
    console.log('🔄 [ProfileForm] Redirecionando para Home em 1.5s...')
    setTimeout(() => {
      console.log('➡️ [ProfileForm] Executando redirecionamento para /')
      router.push('/')
    }, 1500)
  } catch (error) {
    console.error('❌ [ProfileForm] Erro ao salvar perfil:', error)
    console.error('❌ [ProfileForm] Stack trace:', error.stack)
    console.error('❌ [ProfileForm] Error name:', error.name)
    console.error('❌ [ProfileForm] Error message:', error.message)
    showMessage('Erro ao salvar perfil: ' + error.message, 'error')
  } finally {
    loading.value = false
    console.log('🏁 [ProfileForm] handleSubmit finalizado')
  }
}

const loadProfile = async () => {
  console.log('🔵 [ProfileForm] Iniciando loadProfile')
  
  if (!currentUser.value) {
    console.log('⚠️ [ProfileForm] Nenhum usuário autenticado')
    return
  }
  
  console.log('👤 [ProfileForm] Carregando perfil para:', {
    uid: currentUser.value.uid,
    email: currentUser.value.email
  })
  
  try {
    console.log('🔄 [ProfileForm] Chamando userService.getProfile...')
    const profile = await userService.getProfile(currentUser.value.uid)
    
    console.log('📦 [ProfileForm] Perfil retornado:', profile ? JSON.stringify(profile, null, 2) : 'null')
    
    if (profile) {
      // Garantir que as estatísticas sempre existam
      form.value = {
        ...profile,
        stats: {
          totalRuns: profile.stats?.totalRuns || 0,
          totalDistance: profile.stats?.totalDistance || 0,
          averagePace: profile.stats?.averagePace || '',
          friends: profile.stats?.friends || 0
        }
      }
      console.log('✅ [ProfileForm] Perfil carregado no formulário')
    } else {
      console.log('⚠️ [ProfileForm] Perfil não existe, criando perfil padrão...')
      
      // Set default name from auth e criar perfil básico
      form.value.name = currentUser.value.displayName || currentUser.value.email?.split('@')[0] || ''
      
      // Criar perfil no Firestore se não existir
      const defaultProfile = {
        name: form.value.name,
        email: currentUser.value.email,
        photoUrl: currentUser.value.photoURL,
        stats: {
          totalRuns: 0,
          totalDistance: 0,
          averagePace: '',
          friends: 0
        }
      }
      
      console.log('📦 [ProfileForm] Criando perfil padrão:', JSON.stringify(defaultProfile, null, 2))
      await userService.createProfile(currentUser.value.uid, defaultProfile)
      form.value = { ...form.value, ...defaultProfile }
      console.log('✅ [ProfileForm] Perfil padrão criado')
    }
    
    console.log('📋 [ProfileForm] Estado final do formulário:', JSON.stringify(form.value, null, 2))
  } catch (error) {
    console.error('❌ [ProfileForm] Erro ao carregar perfil:', error)
    console.error('❌ [ProfileForm] Stack trace:', error.stack)
  }
}

onMounted(() => {
  console.log('🔵 [ProfileForm] Componente montado')
  console.log('👤 [ProfileForm] Current user no mount:', currentUser.value ? {
    uid: currentUser.value.uid,
    email: currentUser.value.email
  } : 'null')
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.profile-container {
  width: 100%;
  max-width: 1000px;
}

.form-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.form-column {
  display: flex;
  flex-direction: column;
}

.profile-form {
  background: rgba(255,255,255,0.9);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
}

.profile-form h2 {
  text-align: center;
  margin-bottom: 0.5rem;
  color: #333;
}

.profile-subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.95rem;
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}



.photo-section {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 1rem;
  border: 4px solid #667eea;
  object-fit: cover;
}

.photo-options {
  max-width: 300px;
  margin: 0 auto;
}

.photo-options button {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  width: 100%;
}

.photo-options button:hover:not(:disabled) {
  background: #5a67d8;
}

.photo-options button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  align-items: end;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  line-height: 1.2;
}

.form-group label input[type="checkbox"] {
  margin-right: 0.75rem;
  margin-bottom: 0;
  width: auto;
  flex-shrink: 0;
  vertical-align: middle;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  color: #333;
  transition: all 0.3s ease;
  box-sizing: border-box;
  height: 48px;
  line-height: 1.5;
}

.form-group textarea {
  height: auto;
  min-height: 80px;
  resize: vertical;
  line-height: 1.6;
  padding-top: 12px;
}

.form-group select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
  font-style: italic;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.form-group small {
  color: #666;
  font-size: 12px;
  margin-top: 0.25rem;
  display: block;
}

.form-actions {
  text-align: center;
  margin-top: 2rem;
}

.save-btn {
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  margin-top: 1rem;
  padding: 12px;
  border-radius: 8px;
  text-align: center;
  font-weight: 500;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.stats-section {
  background: rgba(102, 126, 234, 0.1);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.stats-section h3 {
  color: #333;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-items: end;
}

.stats-grid .form-group {
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
    min-height: 100vh;
    align-items: flex-start;
    padding-top: 2rem;
  }
  
  .profile-form {
    padding: 1.5rem;
  }
  
  .form-columns {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .avatar {
    width: 80px;
    height: 80px;
  }
  
  .photo-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    font-size: 16px; /* Evita zoom no iOS */
  }
  
  .profile-subtitle {
    padding: 0.75rem;
    margin-bottom: 1rem;
  }
}
</style>