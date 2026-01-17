import { ref } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth'
import { auth } from '@/firebase/config'

const user = ref(null)
const loading = ref(true)
const isInitialized = ref(false)

// Initialize auth state listener once
let unsubscribe = null

const initializeAuth = () => {
  if (unsubscribe) return // Já inicializado

  unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
    console.log('Auth state changed:', firebaseUser ? 'Logged in' : 'Logged out')
    user.value = firebaseUser
    loading.value = false
    isInitialized.value = true
  }, (error) => {
    console.error('Auth state error:', error)
    loading.value = false
    isInitialized.value = true
  })
}

// Inicializar imediatamente
initializeAuth()

export function useAuth() {
  const login = async (email, password) => {
    try {
      loading.value = true
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      if (!userCredential.user.emailVerified) {
        throw new Error('Por favor, verifique seu email antes de fazer login')
      }
      
      console.log('Login successful:', userCredential.user.email)
      return userCredential.user
    } catch (error) {
      console.error('Login error:', error)
      throw new Error(getErrorMessage(error.code))
    } finally {
      loading.value = false
    }
  }

  const loginWithGoogle = async () => {
    try {
      loading.value = true
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      console.log('Google login successful:', result.user.email)
      return result.user
    } catch (error) {
      console.error('Google login error:', error)
      throw new Error(getErrorMessage(error.code))
    } finally {
      loading.value = false
    }
  }

  const register = async (email, password, name) => {
    try {
      loading.value = true
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await updateProfile(userCredential.user, {
        displayName: name
      })
      
      await sendEmailVerification(userCredential.user)
      
      throw new Error('Cadastro realizado! Verifique seu email para ativar a conta.')
    } catch (error) {
      throw new Error(getErrorMessage(error.code))
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      loading.value = true
      await signOut(auth)
      console.log('Logout successful')
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Erro ao fazer logout')
    } finally {
      loading.value = false
    }
  }

  const waitForAuthInit = () => {
    return new Promise((resolve) => {
      if (isInitialized.value) {
        resolve(user.value)
        return
      }

      const checkInit = () => {
        if (isInitialized.value) {
          resolve(user.value)
        } else {
          setTimeout(checkInit, 50)
        }
      }
      checkInit()
    })
  }

  const getErrorMessage = (errorCode) => {
    const messages = {
      'auth/user-not-found': 'Usuário não encontrado',
      'auth/wrong-password': 'Senha incorreta',
      'auth/email-already-in-use': 'Email já está em uso',
      'auth/weak-password': 'Senha muito fraca',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
      'auth/popup-closed-by-user': 'Login cancelado',
      'auth/cancelled-popup-request': 'Login cancelado'
    }
    return messages[errorCode] || 'Erro desconhecido'
  }

  return {
    user,
    loading,
    isInitialized,
    login,
    loginWithGoogle,
    register,
    logout,
    waitForAuthInit
  }
}