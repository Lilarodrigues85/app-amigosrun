import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'

export function useSessionTimeout(timeoutMinutes = 60) {
  const router = useRouter()
  const timeoutId = ref(null)
  const warningTimeoutId = ref(null)
  const showWarning = ref(false)
  
  // Tempo em milissegundos
  const TIMEOUT_DURATION = timeoutMinutes * 60 * 1000 // 60 minutos
  const WARNING_DURATION = (timeoutMinutes - 5) * 60 * 1000 // 5 minutos antes
  
  // Eventos que indicam atividade do usuário
  const activityEvents = [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ]
  
  const logout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem('lastActivity')
      router.push('/login')
    } catch (error) {
      console.error('❌ Erro ao fazer logout:', error)
    }
  }
  
  const resetTimer = () => {
    // Limpar timers existentes
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
    if (warningTimeoutId.value) {
      clearTimeout(warningTimeoutId.value)
    }
    
    showWarning.value = false
    
    // Salvar timestamp da última atividade
    localStorage.setItem('lastActivity', Date.now().toString())
    
    // Timer de aviso (5 minutos antes)
    warningTimeoutId.value = setTimeout(() => {
      showWarning.value = true
      console.warn('⚠️ Sessão expirará em 5 minutos por inatividade')
    }, WARNING_DURATION)
    
    // Timer de logout
    timeoutId.value = setTimeout(() => {
      console.warn('⚠️ Sessão expirada por inatividade')
      logout()
    }, TIMEOUT_DURATION)
  }
  
  const checkLastActivity = () => {
    const lastActivity = localStorage.getItem('lastActivity')
    
    if (lastActivity) {
      const timeSinceLastActivity = Date.now() - parseInt(lastActivity)
      
      // Se passou mais de 1 hora desde a última atividade
      if (timeSinceLastActivity > TIMEOUT_DURATION) {
        console.warn('⚠️ Sessão expirada (verificação ao carregar)')
        logout()
        return false
      }
    }
    
    return true
  }
  
  const setupListeners = () => {
    // Adicionar listeners para todos os eventos de atividade
    activityEvents.forEach(event => {
      window.addEventListener(event, resetTimer, { passive: true })
    })
  }
  
  const removeListeners = () => {
    // Remover listeners
    activityEvents.forEach(event => {
      window.removeEventListener(event, resetTimer)
    })
    
    // Limpar timers
    if (timeoutId.value) {
      clearTimeout(timeoutId.value)
    }
    if (warningTimeoutId.value) {
      clearTimeout(warningTimeoutId.value)
    }
  }
  
  const extendSession = () => {
    resetTimer()
    showWarning.value = false
  }
  
  onMounted(() => {
    // Verificar se a sessão já expirou
    if (checkLastActivity()) {
      setupListeners()
      resetTimer()
    }
  })
  
  onUnmounted(() => {
    removeListeners()
  })
  
  return {
    showWarning,
    extendSession,
    logout
  }
}
