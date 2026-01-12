import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '@/firebase/config'

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
      
      await sendEmailVerification(userCredential.user)
      
      return userCredential.user
    } catch (error) {
      throw this.handleAuthError(error)
    }
  },

  async logout() {
    try {
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