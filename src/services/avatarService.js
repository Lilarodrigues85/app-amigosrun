export const avatarService = {
  generateAvatar(name) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=4285f4&color=fff`
  },

  getAvatarUrl(user) {
    if (user.photoUrl && this.isValidImageUrl(user.photoUrl)) {
      return user.photoUrl
    }
    return this.generateAvatar(user.name)
  },

  isValidImageUrl(url) {
    return url && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url)
  }
}