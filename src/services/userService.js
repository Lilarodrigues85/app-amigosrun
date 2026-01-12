import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { avatarService } from './avatarService'

export const userService = {
  async createUser(uid, userData) {
    const userRef = doc(db, 'users', uid)
    
    await setDoc(userRef, {
      ...userData,
      photoUrl: userData.photoUrl || null,
      createdAt: serverTimestamp()
    })
  },

  async updateProfile(uid, profileData) {
    const userRef = doc(db, 'users', uid)
    
    // Validate photo URL if provided
    if (profileData.photoUrl && !avatarService.isValidImageUrl(profileData.photoUrl)) {
      profileData.photoUrl = null
    }
    
    await setDoc(userRef, {
      ...profileData,
      updatedAt: serverTimestamp()
    }, { merge: true })
  },

  async getProfile(uid) {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return userSnap.data()
    }
    return null
  },

  async updateProfilePhoto(uid, photoUrl) {
    const userRef = doc(db, 'users', uid)
    const validUrl = avatarService.isValidImageUrl(photoUrl) ? photoUrl : null
    await updateDoc(userRef, { photoUrl: validUrl })
  },

  async getPublicProfile(userId) {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (!userDoc.exists()) {
      throw new Error('Usuário não encontrado')
    }
    
    const userData = userDoc.data()
    return {
      name: userData.name,
      photoURL: userData.photoUrl,
      bio: userData.bio,
      goal: userData.goal,
      weight: userData.showPersonalInfo ? userData.weight : null,
      height: userData.showPersonalInfo ? userData.height : null,
      showPersonalInfo: userData.showPersonalInfo || false
    }
  }
}