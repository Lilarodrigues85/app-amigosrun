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
    console.log('🔵 [userService] Iniciando createProfile')
    console.log('👤 [userService] userId:', userId)
    console.log('📦 [userService] profileData:', JSON.stringify(profileData, null, 2))
    
    try {
      const userRef = doc(db, 'users', userId)
      console.log('📄 [userService] Referência do documento criada:', userRef.path)
      
      const dataToSave = {
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      console.log('💾 [userService] Dados a serem salvos:', JSON.stringify(dataToSave, null, 2))
      console.log('🔄 [userService] Executando setDoc...')
      
      await setDoc(userRef, dataToSave)
      
      console.log('✅ [userService] Perfil criado com sucesso!')
      return true
    } catch (error) {
      console.error('❌ [userService] Erro ao criar perfil:', error)
      console.error('❌ [userService] Error code:', error.code)
      console.error('❌ [userService] Error message:', error.message)
      console.error('❌ [userService] Stack trace:', error.stack)
      throw new Error('Erro ao criar perfil: ' + error.message)
    }
  },

  async getProfile(userId) {
    console.log('🔵 [userService] Iniciando getProfile')
    console.log('👤 [userService] userId:', userId)
    
    try {
      const userRef = doc(db, 'users', userId)
      console.log('📄 [userService] Referência do documento:', userRef.path)
      console.log('🔄 [userService] Executando getDoc...')
      
      const userSnap = await getDoc(userRef)
      
      console.log('📦 [userService] Snapshot obtido:', {
        exists: userSnap.exists(),
        id: userSnap.id
      })
      
      if (userSnap.exists()) {
        const data = userSnap.data()
        console.log('✅ [userService] Perfil encontrado:', JSON.stringify(data, null, 2))
        return data
      }
      
      console.log('⚠️ [userService] Perfil não existe')
      return null
    } catch (error) {
      console.error('❌ [userService] Erro ao buscar perfil:', error)
      console.error('❌ [userService] Error code:', error.code)
      console.error('❌ [userService] Error message:', error.message)
      console.error('❌ [userService] Stack trace:', error.stack)
      throw new Error('Erro ao buscar perfil: ' + error.message)
    }
  },

  async updateProfile(userId, profileData) {
    console.log('🔵 [userService] Iniciando updateProfile')
    console.log('👤 [userService] userId:', userId)
    console.log('📦 [userService] profileData:', JSON.stringify(profileData, null, 2))
    
    try {
      const userRef = doc(db, 'users', userId)
      console.log('📄 [userService] Referência do documento:', userRef.path)
      
      const dataToUpdate = {
        ...profileData,
        updatedAt: new Date().toISOString()
      }
      
      console.log('💾 [userService] Dados a serem atualizados:', JSON.stringify(dataToUpdate, null, 2))
      console.log('🔄 [userService] Executando updateDoc...')
      
      await updateDoc(userRef, dataToUpdate)
      
      console.log('✅ [userService] Perfil atualizado com sucesso!')
      return true
    } catch (error) {
      console.error('❌ [userService] Erro ao atualizar perfil:', error)
      console.error('❌ [userService] Error code:', error.code)
      console.error('❌ [userService] Error message:', error.message)
      console.error('❌ [userService] Stack trace:', error.stack)
      
      // Se o documento não existe, tentar criar
      if (error.code === 'not-found') {
        console.log('⚠️ [userService] Documento não encontrado, tentando criar...')
        try {
          await this.createProfile(userId, profileData)
          console.log('✅ [userService] Perfil criado após erro not-found')
          return true
        } catch (createError) {
          console.error('❌ [userService] Erro ao criar perfil após not-found:', createError)
          throw new Error('Erro ao criar perfil: ' + createError.message)
        }
      }
      
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
        createdAt: profile.createdAt,
        stats: profile.stats || {
          totalRuns: 0,
          totalDistance: 0,
          averagePace: '',
          friends: 0
        }
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