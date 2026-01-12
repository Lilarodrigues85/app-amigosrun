import { ref } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/config'
import { authService } from '@/services/authService'

const user = ref(null)
const loading = ref(true)

export function useAuth() {
  const router = useRouter()
  
  onAuthStateChanged(auth, (firebaseUser) => {
    user.value = firebaseUser
    loading.value = false
    
    if (firebaseUser && router.currentRoute.value.path === '/login') {
      router.push('/profile')
    }
  })

  const logout = async () => {
    await authService.logout()
    router.push('/login')
  }

  return {
    user,
    loading,
    logout,
    isAuthenticated: () => !!user.value
  }
}