import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
  signOut
} from 'firebase/auth'
import { auth } from '@/firebase/config'

const googleProvider = new GoogleAuthProvider()

export const authService = {
  async register(email, password) {
    console.log('🔵 AUTH: Registrando usuário', email)
    const result = await createUserWithEmailAndPassword(auth, email, password)
    console.log('✅ AUTH: Usuário criado', result.user.uid)
    await sendEmailVerification(result.user)
    console.log('✅ AUTH: Email de verificação enviado')
    return result
  },

  async login(email, password) {
    console.log('🔵 AUTH: Fazendo login', email)
    const result = await signInWithEmailAndPassword(auth, email, password)
    console.log('✅ AUTH: Login realizado', result.user.uid)
    
    if (!result.user.emailVerified) {
      console.error('❌ AUTH: Email não verificado')
      throw new Error('Email não verificado')
    }
    
    console.log('✅ AUTH: Email verificado, login completo')
    return result
  },

  async loginWithGoogle() {
    console.log('🔵 AUTH: Fazendo login com Google')
    try {
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      })
      const result = await signInWithPopup(auth, googleProvider)
      console.log('✅ AUTH: Login Google realizado', result.user.uid)
      return result
    } catch (error) {
      console.error('❌ AUTH: Erro no login Google:', error)
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Login cancelado pelo usuário')
      }
      throw error
    }
  },

  async logout() {
    console.log('🔵 AUTH: Fazendo logout')
    await signOut(auth)
    console.log('✅ AUTH: Logout realizado')
  }
}