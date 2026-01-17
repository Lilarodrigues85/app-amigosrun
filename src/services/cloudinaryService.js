const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'amigos_run'
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dqcpkpgte'

export const cloudinaryService = {
  async uploadImage(file) {
    try {
      this.validateFile(file)
      
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
      
      console.log('Uploading to Cloudinary:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET
      })
      
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )
      
      if (!response.ok) {
        const errorData = await response.text()
        console.error('Cloudinary error:', errorData)
        throw new Error(`Erro no upload da imagem: ${response.status} - ${errorData}`)
      }
      
      const data = await response.json()
      console.log('Upload successful:', data.secure_url)
      return data.secure_url
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Erro ao fazer upload: ' + error.message)
    }
  },

  validateFile(file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    
    if (!file) {
      throw new Error('Nenhum arquivo selecionado')
    }
    
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Máximo 5MB')
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado. Use JPG, PNG ou WebP')
    }
  },

  getOptimizedUrl(url, width = 400, height = 400) {
    if (!url || !url.includes('cloudinary.com')) {
      return url
    }
    
    // Adiciona transformações do Cloudinary para otimizar a imagem
    return url.replace('/upload/', `/upload/w_${width},h_${height},c_fill,f_auto,q_auto/`)
  }
}