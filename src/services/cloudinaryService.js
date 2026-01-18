const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'amigos-run'
const CLOUDINARY_UPLOAD_PRESET_POSTS = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_POSTS || 'amigos-run-posts'
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dyxgdeunz'

export const cloudinaryService = {
  async uploadImage(file, folder = 'profiles') {
    try {
      this.validateFile(file)
      
      const formData = new FormData()
      formData.append('file', file)
      
      // Usar preset diferente para posts
      const preset = folder === 'posts' ? CLOUDINARY_UPLOAD_PRESET_POSTS : CLOUDINARY_UPLOAD_PRESET
      formData.append('upload_preset', preset)
      formData.append('folder', folder)
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ [Cloudinary] Erro no upload:', errorText)
        throw new Error(`Erro no upload da imagem: ${response.status}`)
      }
      
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('❌ [Cloudinary] Erro ao fazer upload:', error.message)
      throw new Error('Erro ao fazer upload: ' + error.message)
    }
  },

  // Upload específico para posts
  async uploadPostImage(file) {
    return this.uploadImage(file, 'posts')
  },

  validateFile(file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    
    if (!file) {
      throw new Error('Nenhum arquivo selecionado')
    }
    
    if (file.size > maxSize) {
      throw new Error(`Arquivo muito grande. Máximo 5MB (seu arquivo: ${(file.size / 1024 / 1024).toFixed(2)}MB)`)
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado. Use JPG, PNG ou WebP')
    }
  },

  getOptimizedUrl(url, width = 400, height = 400, options = {}) {
    if (!url || !url.includes('cloudinary.com')) {
      return url
    }
    
    const {
      crop = 'fill',
      quality = 'auto',
      format = 'auto',
      gravity = null
    } = options
    
    let transformation = `w_${width},h_${height},c_${crop},f_${format},q_${quality}`
    
    if (gravity) {
      transformation += `,g_${gravity}`
    }
    
    return url.replace('/upload/', `/upload/${transformation}/`)
  },

  // Gera URL com transformações específicas para avatares
  getAvatarUrl(url, size = 200) {
    return this.getOptimizedUrl(url, size, size, {
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
      gravity: 'face' // Foca no rosto se detectado
    })
  },

  // Gera URL com transformações específicas para posts
  getPostImageUrl(url, width = 800, height = 600) {
    return this.getOptimizedUrl(url, width, height, {
      crop: 'limit', // Não corta, apenas redimensiona se necessário
      quality: 'auto',
      format: 'auto'
      // SEM gravity para posts (causava erro 400)
    })
  },

  // Gera URL para thumbnail
  getThumbnailUrl(url, size = 150) {
    return this.getOptimizedUrl(url, size, size, {
      crop: 'fill',
      quality: '80',
      format: 'auto'
    })
  },

  getPublicIdFromUrl(url) {
    if (!url || !url.includes('cloudinary.com')) {
      return null
    }

    try {
      const parts = url.split('/upload/')
      if (parts.length < 2) return null
      
      let pathAfterUpload = parts[1]
      
      const versionIndex = pathAfterUpload.indexOf('/v')
      if (versionIndex > 0) {
        pathAfterUpload = pathAfterUpload.substring(versionIndex + 1)
      }
      
      const pathParts = pathAfterUpload.split('/')
      if (pathParts.length < 2) return null
      
      const publicIdWithExtension = pathParts.slice(1).join('/')
      const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '')
      
      return publicId
    } catch (error) {
      console.error('❌ [Cloudinary] Erro ao extrair public_id:', error)
      return null
    }
  },

  async deleteImage(imageUrl) {
    try {
      const publicId = this.getPublicIdFromUrl(imageUrl)
      
      if (!publicId) {
        console.warn('⚠️ [Cloudinary] Não foi possível extrair public_id da URL')
        return false
      }
      
      // NOTA: A exclusão via API Admin requer assinatura (API Secret)
      // Como estamos no frontend, não podemos fazer isso diretamente
      // Solução: Implementar Firebase Function ou backend próprio
      // Ver documentação: docs/EXCLUSAO_IMAGENS_CLOUDINARY.md
      
      console.warn('⚠️ [Cloudinary] Exclusão requer backend (API Secret)')
      return true
      
    } catch (error) {
      console.error('❌ [Cloudinary] Erro ao deletar imagem:', error)
      return false
    }
  }
}