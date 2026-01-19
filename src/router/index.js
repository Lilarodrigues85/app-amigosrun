import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { userService } from '@/services/userService'
import { authService } from '@/services/authService'
import { adminService } from '@/services/adminService'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Corridas from '@/views/Corridas.vue'
import Mapa from '@/views/Mapa.vue'
import PendingApproval from '@/views/PendingApproval.vue'
import RegistrationRejected from '@/views/RegistrationRejected.vue'
import AdminDashboard from '@/views/AdminDashboard.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true, requiresApproval: true, requiresProfile: true }
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
    meta: { requiresAuth: true, requiresApproval: true, requiresProfile: true }
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: Mapa,
    meta: { requiresAuth: true, requiresApproval: true, requiresProfile: true }
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true, requiresApproval: true }
  },
  {
    path: '/perfil/:id',
    name: 'PublicProfile',
    component: () => import('@/views/PublicProfile.vue'),
    meta: { requiresAuth: true, requiresApproval: true, requiresProfile: true }
  },
  {
    path: '/pending-approval',
    name: 'PendingApproval',
    component: PendingApproval,
    meta: { requiresAuth: true, layout: 'blank' }
  },
  {
    path: '/registration-rejected',
    name: 'RegistrationRejected',
    component: RegistrationRejected,
    meta: { requiresAuth: true, layout: 'blank' }
  },
  {
    path: '/admin/users',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true }
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

// Navigation guard atualizado com verificação de aprovação
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresApproval = to.matched.some(record => record.meta.requiresApproval)
  const requiresProfile = to.matched.some(record => record.meta.requiresProfile)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)
  
  if (requiresAuth) {
    try {
      const currentUser = await getCurrentUser()
      
      if (!currentUser) {
        next('/login')
        return
      }
      
      // Verificar se é admin
      if (requiresAdmin) {
        const isAdmin = await adminService.isAdmin(currentUser.email)
        if (!isAdmin) {
          next('/')
          return
        }
        next()
        return
      }
      
      // Verificar status de aprovação
      if (requiresApproval) {
        const userStatus = await authService.checkUserStatus(currentUser.uid)
        
        // Se pendente, redireciona para página de aguardo
        if (userStatus.status === 'pending' && to.name !== 'PendingApproval') {
          next('/pending-approval')
          return
        }
        
        // Se rejeitado, redireciona para página de rejeição
        if (userStatus.status === 'rejected' && to.name !== 'RegistrationRejected') {
          next('/registration-rejected')
          return
        }
        
        // Se não está aprovado, bloqueia acesso
        if (userStatus.status !== 'approved') {
          next('/pending-approval')
          return
        }
      }
      
      // Verificar perfil completo
      if (requiresProfile && to.name !== 'Profile') {
        const profileComplete = await checkProfileComplete(currentUser.uid)
        
        if (!profileComplete) {
          next('/perfil')
          return
        }
      }
      
      next()
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
      next('/login')
    }
  } else if (to.path === '/login') {
    try {
      const currentUser = await getCurrentUser()
      if (currentUser) {
        const userStatus = await authService.checkUserStatus(currentUser.uid)
        
        // Redireciona baseado no status
        if (userStatus.status === 'pending') {
          next('/pending-approval')
        } else if (userStatus.status === 'rejected') {
          next('/registration-rejected')
        } else if (userStatus.status === 'approved') {
          const profileComplete = await checkProfileComplete(currentUser.uid)
          next(profileComplete ? '/' : '/perfil')
        } else {
          next('/pending-approval')
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