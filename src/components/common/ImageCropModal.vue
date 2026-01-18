<template>
  <div v-if="show" class="crop-modal-overlay" @click="handleOverlayClick">
    <div class="crop-modal" @click.stop>
      <div class="crop-header">
        <h3>✂️ Ajustar Foto de Perfil</h3>
        <button @click="$emit('close')" class="close-btn">×</button>
      </div>
      
      <div class="crop-content">
        <div class="crop-container">
          <div class="image-wrapper">
            <img 
              ref="imageRef"
              :src="imageSrc"
              class="crop-image"
              @load="initializeCrop"
              @mousedown="startDrag"
              @touchstart="startDrag"
            />
            <div 
              v-if="cropArea"
              class="crop-overlay"
              :class="{ 'is-dragging': isDragging, 'is-resizing': isResizing }"
              :style="cropOverlayStyle"
              @mousedown="startDrag"
              @touchstart="startDrag"
            >
              <div class="crop-grid">
                <div class="grid-line grid-line-h" style="top: 33.33%"></div>
                <div class="grid-line grid-line-h" style="top: 66.66%"></div>
                <div class="grid-line grid-line-v" style="left: 33.33%"></div>
                <div class="grid-line grid-line-v" style="left: 66.66%"></div>
              </div>
              <div class="crop-handles">
                <div 
                  v-for="handle in handles" 
                  :key="handle"
                  :class="`crop-handle crop-handle-${handle}`"
                  @mousedown.stop="startResize($event, handle)"
                  @touchstart.stop="startResize($event, handle)"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="crop-preview">
          <h4>Preview:</h4>
          <div class="preview-container">
            <canvas ref="previewCanvas" class="preview-canvas"></canvas>
          </div>
          <p class="preview-hint">Arraste para mover • Cantos para redimensionar</p>
        </div>
      </div>
      
      <div class="crop-actions">
        <button @click="resetCrop" class="btn-secondary">🔄 Resetar</button>
        <button @click="$emit('close')" class="btn-secondary">❌ Cancelar</button>
        <button @click="applyCrop" class="btn-primary">✅ Aplicar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  imageSrc: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['close', 'crop'])

const imageRef = ref(null)
const previewCanvas = ref(null)
const cropArea = ref(null)
const isDragging = ref(false)
const isResizing = ref(false)
const resizeHandle = ref('')
const dragStart = ref({ x: 0, y: 0 })
const imageLoaded = ref(false)

const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w']

const cropOverlayStyle = computed(() => {
  if (!cropArea.value) return {}
  
  return {
    left: `${cropArea.value.x}px`,
    top: `${cropArea.value.y}px`,
    width: `${cropArea.value.width}px`,
    height: `${cropArea.value.height}px`
  }
})

const initializeCrop = () => {
  nextTick(() => {
    if (!imageRef.value) return
    
    const img = imageRef.value
    const rect = img.getBoundingClientRect()
    
    // Inicializa com crop quadrado no centro
    const size = Math.min(rect.width, rect.height) * 0.8
    const x = (rect.width - size) / 2
    const y = (rect.height - size) / 2
    
    cropArea.value = {
      x: x,
      y: y,
      width: size,
      height: size
    }
    
    imageLoaded.value = true
    updatePreview()
  })
}

const startDrag = (event) => {
  if (isResizing.value) return
  
  event.preventDefault()
  event.stopPropagation()
  
  const rect = imageRef.value.getBoundingClientRect()
  const clientX = event.clientX || event.touches?.[0]?.clientX
  const clientY = event.clientY || event.touches?.[0]?.clientY
  
  if (!clientX || !clientY) return
  
  const x = clientX - rect.left
  const y = clientY - rect.top
  
  // Verifica se clicou dentro da área de crop para arrastar
  if (
    x >= cropArea.value.x && 
    x <= cropArea.value.x + cropArea.value.width &&
    y >= cropArea.value.y && 
    y <= cropArea.value.y + cropArea.value.height
  ) {
    isDragging.value = true
    dragStart.value = {
      x: x - cropArea.value.x,
      y: y - cropArea.value.y
    }
  }
}

const updateCrop = (event) => {
  if (!isDragging.value && !isResizing.value) return
  if (!imageRef.value) return
  
  event.preventDefault()
  event.stopPropagation()
  
  const rect = imageRef.value.getBoundingClientRect()
  const clientX = event.clientX || event.touches?.[0]?.clientX
  const clientY = event.clientY || event.touches?.[0]?.clientY
  
  if (!clientX || !clientY) return
  
  const x = clientX - rect.left
  const y = clientY - rect.top
  
  if (isDragging.value) {
    // Arrastar área de crop
    let newX = x - dragStart.value.x
    let newY = y - dragStart.value.y
    
    // Limitar dentro da imagem
    newX = Math.max(0, Math.min(newX, rect.width - cropArea.value.width))
    newY = Math.max(0, Math.min(newY, rect.height - cropArea.value.height))
    
    cropArea.value = {
      ...cropArea.value,
      x: newX,
      y: newY
    }
  } else if (isResizing.value) {
    // Redimensionar área de crop
    resizeCropArea(x, y, rect)
  }
  
  updatePreview()
}

const endCrop = (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  isDragging.value = false
  isResizing.value = false
  resizeHandle.value = ''
}

const startResize = (event, handle) => {
  event.preventDefault()
  event.stopPropagation()
  isResizing.value = true
  resizeHandle.value = handle
}

const resizeCropArea = (mouseX, mouseY, rect) => {
  const handle = resizeHandle.value
  
  let { x, y, width, height } = cropArea.value
  const minSize = 50
  const maxSize = Math.min(rect.width, rect.height)
  
  // Calcular novo tamanho baseado no handle
  let newSize = width
  
  if (handle.includes('e') || handle.includes('w')) {
    // Redimensionar horizontal
    if (handle.includes('e')) {
      newSize = Math.max(minSize, Math.min(maxSize, mouseX - x))
    } else if (handle.includes('w')) {
      const newX = Math.max(0, Math.min(mouseX, x + width - minSize))
      newSize = width + (x - newX)
      if (newSize >= minSize && newSize <= maxSize) {
        x = newX
      } else {
        newSize = width
      }
    }
  }
  
  if (handle.includes('n') || handle.includes('s')) {
    // Redimensionar vertical
    if (handle.includes('s')) {
      newSize = Math.max(minSize, Math.min(maxSize, mouseY - y))
    } else if (handle.includes('n')) {
      const newY = Math.max(0, Math.min(mouseY, y + height - minSize))
      newSize = height + (y - newY)
      if (newSize >= minSize && newSize <= maxSize) {
        y = newY
      } else {
        newSize = height
      }
    }
  }
  
  // Aplicar tamanho quadrado
  width = newSize
  height = newSize
  
  // Garantir que não ultrapasse os limites da imagem
  if (x + width > rect.width) {
    width = rect.width - x
    height = width
  }
  if (y + height > rect.height) {
    height = rect.height - y
    width = height
  }
  
  // Ajustar posição se necessário ao redimensionar pelos cantos superiores/esquerdos
  if (handle.includes('w') && x + width > rect.width) {
    x = rect.width - width
  }
  if (handle.includes('n') && y + height > rect.height) {
    y = rect.height - height
  }
  
  cropArea.value = { x, y, width, height }
}

const updatePreview = () => {
  if (!previewCanvas.value || !imageRef.value || !cropArea.value || !imageLoaded.value) return
  
  try {
    const canvas = previewCanvas.value
    const ctx = canvas.getContext('2d')
    const img = imageRef.value
    
    // Configurar canvas para preview
    canvas.width = 150
    canvas.height = 150
    
    // Limpar canvas
    ctx.clearRect(0, 0, 150, 150)
    
    // Calcular proporções
    const scaleX = img.naturalWidth / img.offsetWidth
    const scaleY = img.naturalHeight / img.offsetHeight
    
    // Desenhar imagem recortada
    ctx.drawImage(
      img,
      cropArea.value.x * scaleX,
      cropArea.value.y * scaleY,
      cropArea.value.width * scaleX,
      cropArea.value.height * scaleY,
      0,
      0,
      150,
      150
    )
  } catch (error) {
    console.error('Erro ao atualizar preview:', error)
  }
}

const resetCrop = () => {
  initializeCrop()
}

const applyCrop = () => {
  if (!imageRef.value || !cropArea.value) {
    console.error('Imagem ou área de crop não disponível')
    return
  }
  
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = imageRef.value
    
    // Configurar canvas final (400x400 para boa qualidade)
    canvas.width = 400
    canvas.height = 400
    
    // Calcular proporções
    const scaleX = img.naturalWidth / img.offsetWidth
    const scaleY = img.naturalHeight / img.offsetHeight
    
    // Desenhar imagem recortada em alta qualidade
    ctx.drawImage(
      img,
      cropArea.value.x * scaleX,
      cropArea.value.y * scaleY,
      cropArea.value.width * scaleX,
      cropArea.value.height * scaleY,
      0,
      0,
      400,
      400
    )
    
    // Converter para blob
    canvas.toBlob((blob) => {
      if (blob) {
        emit('crop', blob)
      } else {
        console.error('Erro ao gerar blob da imagem')
      }
    }, 'image/jpeg', 0.92)
  } catch (error) {
    console.error('Erro ao aplicar crop:', error)
  }
}

const handleOverlayClick = () => {
  emit('close')
}

// Adicionar event listeners globais
const addGlobalListeners = () => {
  document.addEventListener('mousemove', updateCrop)
  document.addEventListener('mouseup', endCrop)
  document.addEventListener('touchmove', updateCrop)
  document.addEventListener('touchend', endCrop)
}

const removeGlobalListeners = () => {
  document.removeEventListener('mousemove', updateCrop)
  document.removeEventListener('mouseup', endCrop)
  document.removeEventListener('touchmove', updateCrop)
  document.removeEventListener('touchend', endCrop)
}

watch(() => props.show, (newVal) => {
  if (newVal) {
    addGlobalListeners()
  } else {
    removeGlobalListeners()
  }
})
</script>

<style scoped>
.crop-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.crop-modal {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.crop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.crop-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #666;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #333;
}

.crop-content {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 2rem;
}

.crop-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f9fafb;
  border-radius: 12px;
  padding: 1rem;
  min-height: 300px;
}

.image-wrapper {
  position: relative;
  display: inline-block;
  max-width: 100%;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.crop-image {
  max-width: 100%;
  max-height: 400px;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: none;
}

.crop-overlay {
  position: absolute;
  border: 3px solid #3b82f6;
  background: rgba(59, 130, 246, 0.1);
  cursor: move;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
  transition: none;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.crop-overlay:hover {
  border-color: #2563eb;
  background: rgba(59, 130, 246, 0.15);
}

.crop-overlay:active {
  cursor: grabbing;
}

.crop-overlay.is-dragging {
  cursor: grabbing;
  border-color: #1d4ed8;
  background: rgba(59, 130, 246, 0.2);
}

.crop-overlay.is-resizing {
  border-color: #1d4ed8;
}

.crop-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.grid-line-h {
  left: 0;
  right: 0;
  height: 1px;
}

.grid-line-v {
  top: 0;
  bottom: 0;
  width: 1px;
}

.crop-handles {
  position: relative;
  width: 100%;
  height: 100%;
}

.crop-handle {
  position: absolute;
  width: 16px;
  height: 16px;
  background: white;
  border: 3px solid #3b82f6;
  border-radius: 50%;
  cursor: pointer;
  transform: translate(-50%, -50%);
  transition: all 0.2s ease;
  z-index: 10;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
}

.crop-handle:hover {
  background: #3b82f6;
  transform: translate(-50%, -50%) scale(1.3);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}

.crop-handle:active {
  background: #2563eb;
  transform: translate(-50%, -50%) scale(1.4);
  box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.4);
}

.crop-handle-nw { top: 0; left: 0; cursor: nw-resize; }
.crop-handle-ne { top: 0; right: 0; transform: translate(50%, -50%); cursor: ne-resize; }
.crop-handle-sw { bottom: 0; left: 0; transform: translate(-50%, 50%); cursor: sw-resize; }
.crop-handle-se { bottom: 0; right: 0; transform: translate(50%, 50%); cursor: se-resize; }
.crop-handle-n { top: 0; left: 50%; cursor: n-resize; }
.crop-handle-s { bottom: 0; left: 50%; transform: translate(-50%, 50%); cursor: s-resize; }
.crop-handle-w { top: 50%; left: 0; cursor: w-resize; }
.crop-handle-e { top: 50%; right: 0; transform: translate(50%, -50%); cursor: e-resize; }

.crop-handle-ne:hover, .crop-handle-sw:hover, .crop-handle-se:hover {
  transform: translate(50%, 50%) scale(1.2);
}

.crop-handle-nw:hover {
  transform: translate(-50%, -50%) scale(1.2);
}

.crop-preview {
  text-align: center;
}

.crop-preview h4 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1rem;
}

.preview-container {
  background: #f9fafb;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-canvas {
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-hint {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.4;
}

.crop-actions {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
  justify-content: flex-end;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.9rem;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 768px) {
  .crop-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .crop-modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
  
  .crop-actions {
    flex-direction: column;
  }
  
  .btn-primary, .btn-secondary {
    width: 100%;
  }
}
</style>
