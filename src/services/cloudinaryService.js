export const cloudinaryService = {
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )
    
    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem')
    }
    
    const data = await response.json()
    return data.secure_url
  },

  validateFile(file) {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    
    if (file.size > maxSize) {
      throw new Error('Imagem deve ter no máximo 5MB')
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Formato deve ser JPG, PNG ou WebP')
    }
    
    return true
  }
}