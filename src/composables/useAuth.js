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

// Initialize auth state listener once
onAuthStateChanged(auth, (firebaseUser) => {
  user.value = firebaseUser
  loading.value = false
})

export function useAuth() {
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      if (!userCredential.user.emailVerified) {
        throw new Error('Por favor, verifique seu email antes de fazer login')
      }
      
      return userCredential.user
    } catch (error) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({
        prompt: 'select_account'
      })
      
      const result = await signInWithPopup(auth, provider)
      return result.user
    } catch (error) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      await updateProfile(userCredential.user, {
        displayName: name
      })
      
      await sendEmailVerification(userCredential.user)
      
      throw new Error('Cadastro realizado! Verifique seu email para ativar a conta.')
    } catch (error) {
      throw new Error(getErrorMessage(error.code))
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      throw new Error('Erro ao fazer logout')
    }
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
    login,
    loginWithGoogle,
    register,
    logout
  }
}