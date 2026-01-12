import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const userService = {
  async createProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId)
      await setDoc(userRef, {
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      return true
    } catch (error) {
      throw new Error('Erro ao criar perfil: ' + error.message)
    }
  },

  async getProfile(userId) {
    try {
      const userRef = doc(db, 'users', userId)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        return userSnap.data()
      }
      return null
    } catch (error) {
      throw new Error('Erro ao buscar perfil: ' + error.message)
    }
  },

  async updateProfile(userId, profileData) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      })
      return true
    } catch (error) {
      throw new Error('Erro ao atualizar perfil: ' + error.message)
    }
  },

  async checkEmailExists(email) {
    try {
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', email))
      const querySnapshot = await getDocs(q)
      
      return !querySnapshot.empty
    } catch (error) {
      throw new Error('Erro ao verificar email: ' + error.message)
    }
  },

  async getPublicProfile(userId) {
    try {
      const profile = await this.getProfile(userId)
      
      if (!profile) return null
      
      // Retorna apenas dados públicos
      const publicData = {
        name: profile.name,
        bio: profile.bio,
        photoUrl: profile.photoUrl,
        goal: profile.goal,
        createdAt: profile.createdAt
      }
      
      // Adiciona peso e altura se o usuário permitir
      if (profile.showPersonalInfo) {
        publicData.weight = profile.weight
        publicData.height = profile.height
      }
      
      return publicData
    } catch (error) {
      throw new Error('Erro ao buscar perfil público: ' + error.message)
    }
  }
}