import { ref, onMounted } from 'vue'
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '@/firebase/config'

const user = ref(null)
const loading = ref(true)

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
      'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde'
    }
    return messages[errorCode] || 'Erro desconhecido'
  }

  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  })

  return {
    user,
    loading,
    login,
    register,
    logout
  }
}