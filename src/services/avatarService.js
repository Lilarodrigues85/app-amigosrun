export const avatarService = {
  getAvatarUrl(user) {
    // Se o usuário tem foto personalizada, usa ela
    if (user.photoUrl) {
      return user.photoUrl
    }
    
    // Gera avatar baseado no nome
    const name = user.name || 'Usuario'
    const initials = this.getInitials(name)
    
    // Usa DiceBear API para gerar avatar consistente
    return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=667eea&textColor=ffffff`
  },

  getInitials(name) {
    if (!name) return 'US'
    
    const words = name.trim().split(' ')
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase()
    }
    
    return (words[0][0] + words[words.length - 1][0]).toUpperCase()
  },

  generateColorFromName(name) {
    // Gera cor consistente baseada no nome
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c',
      '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
      '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3'
    ]
    
    return colors[Math.abs(hash) % colors.length]
  }
}