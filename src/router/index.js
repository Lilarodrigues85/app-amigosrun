import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { userService } from '@/services/userService'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Corridas from '@/views/Corridas.vue'
import Mapa from '@/views/Mapa.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true, requiresProfile: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'blank' }
  },
  {
    path: '/corridas',
    name: 'Corridas',
    component: Corridas,
    meta: { requiresAuth: true, requiresProfile: true }
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: Mapa,
    meta: { requiresAuth: true, requiresProfile: true }
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/perfil/:id',
    name: 'PublicProfile',
    component: () => import('@/views/PublicProfile.vue'),
    meta: { requiresAuth: true, requiresProfile: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Função para aguardar inicialização do Firebase Auth
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

// Função para verificar se o perfil está completo
const checkProfileComplete = async (userId) => {
  try {
    const profile = await userService.getProfile(userId)
    
    if (!profile) return false
    
    // Verifica se os campos obrigatórios estão preenchidos
    const hasBasicInfo = profile.name && profile.name.trim() !== ''
    
    // Considera perfil completo se tem pelo menos o nome
    // Você pode adicionar mais validações aqui se necessário
    return hasBasicInfo
  } catch (error) {
    console.error('Erro ao verificar perfil:', error)
    return false
  }
}

// Navigation guard atualizado
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresProfile = to.matched.some(record => record.meta.requiresProfile)
  
  if (requiresAuth) {
    try {
      // Aguarda o Firebase inicializar e verificar se há usuário logado
      const currentUser = await getCurrentUser()
      
      if (currentUser) {
        // Se a rota requer perfil completo, verifica
        if (requiresProfile && to.name !== 'Profile') {
          const profileComplete = await checkProfileComplete(currentUser.uid)
          
          if (!profileComplete) {
            // Redireciona para perfil se não estiver completo
            next('/perfil')
            return
          }
        }
        
        next()
      } else {
        next('/login')
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      next('/login')
    }
  } else if (to.path === '/login') {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        // Após login, sempre redireciona para perfil primeiro
        const profileComplete = await checkProfileComplete(currentUser.uid)
        if (!profileComplete) {
          next('/perfil')
        } else {
          next('/')
        }
      } else {
        next()
      }
    } catch (error) {
      next()
    }
  } else {
    next()
  }
})

export default router