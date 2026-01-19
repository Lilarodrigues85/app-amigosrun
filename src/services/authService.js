import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { auth, db } from '@/firebase/config'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'

export const authService = {
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      if (!userCredential.user.emailVerified) {
        throw new Error('Email não verificado')
      }
      
      return userCredential.user
    } catch (error) {
      throw this.handleAuthError(error)
    }
  },

  async register(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await updateProfile(userCredential.user, {
        displayName
      })
      
      // Criar documento no Firestore com status pending
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        name: displayName,
        status: 'pending',
        role: 'user',
        requestedAt: Timestamp.now(),
        createdAt: Timestamp.now(),
        approvedAt: null,
        approvedBy: null,
        rejectedAt: null,
        rejectedBy: null,
        rejectionReason: null
      })
      
      await sendEmailVerification(userCredential.user)
      
      return userCredential.user
    } catch (error) {
      throw this.handleAuthError(error)
    }
  },

  /**
   * Verifica o status de aprovação do usuário
   */
  async checkUserStatus(userId) {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId))
      
      if (!userDoc.exists()) {
        return { status: 'pending', role: 'user' }
      }
      
      const userData = userDoc.data()
      return {
        status: userData.status || 'pending',
        role: userData.role || 'user',
        ...userData
      }
    } catch (error) {
      console.error('Erro ao verificar status:', error)
      return { status: 'pending', role: 'user' }
    }
  },

  async logout() {
    try {
      // Limpar dados de sessão
      localStorage.removeItem('lastActivity')
      
      await signOut(auth)
    } catch (error) {
      throw new Error('Erro ao fazer logout')
    }
  },

  handleAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Este email já está cadastrado',
      'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
    }
    
    return new Error(errorMessages[error.code] || 'Erro de autenticação')
  }
}