<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-form">
        <h2>Meu Perfil</h2>
        
        <form @submit.prevent="handleSubmit">


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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { avatarService } from '@/services/avatarService'
import { userService } from '@/services/userService'
import { cloudinaryService } from '@/services/cloudinaryService'

const currentUser = ref(null)

onAuthStateChanged(auth, (user) => {
  currentUser.value = user
})

const form = ref({
  name: '',
  weight: null,
  height: null,
  goal: '',
  bio: '',
  photoUrl: null,
  showPersonalInfo: false
})


const customPhotoUrl = ref('')
const uploading = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('success')



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
    uploading.value = true
    
    const imageUrl = await cloudinaryService.uploadImage(file)
    form.value.photoUrl = imageUrl
    
    showMessage('Foto enviada com sucesso!')
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    uploading.value = false
    event.target.value = ''
  }
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const handleSubmit = async () => {
  if (!form.value.name.trim()) {
    showMessage('Nome é obrigatório', 'error')
    return
  }

  loading.value = true
  
  try {
    const profileData = {
      ...form.value,
      photoUrl: form.value.photoUrl,
      updatedAt: new Date().toISOString()
    }
    
    await userService.updateProfile(currentUser.value.uid, profileData)
    showMessage('Perfil salvo com sucesso!')
  } catch (error) {
    showMessage('Erro ao salvar perfil: ' + error.message, 'error')
  } finally {
    loading.value = false
  }
}

const loadProfile = async () => {
  if (!currentUser.value) return
  
  try {
    const profile = await userService.getProfile(currentUser.value.uid)
    if (profile) {
      form.value = { ...profile }
    } else {
      // Set default name from auth
      form.value.name = currentUser.value.displayName || currentUser.value.email?.split('@')[0] || ''
    }
  } catch (error) {
    console.error('Erro ao carregar perfil:', error)
  }
}

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('/amigos_run_banner.png');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.profile-container {
  width: 100%;
  max-width: 600px;
}

.profile-form {
  background: rgba(255,255,255,0.1);
  padding: 2rem;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.2);
  transition: all 0.3s ease;
  overflow: hidden;
}

.profile-form h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: white;
}



.photo-section {
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  backdrop-filter: blur(5px);
}

.avatar {
  width: 120px;
  height: 120px;
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
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
}

.form-group label input[type="checkbox"] {
  margin-right: 0.5rem;
  margin-bottom: 0;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;
  font-size: 16px;
  color: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255,255,255,0.5);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: rgba(255,255,255,0.4);
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(10px);
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group small {
  color: rgba(255,255,255,0.7);
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

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }
  
  .profile-form {
    padding: 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .avatar {
    width: 100px;
    height: 100px;
  }
}
</style>