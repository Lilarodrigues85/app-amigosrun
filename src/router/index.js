import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
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
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: Mapa,
    meta: { requiresAuth: true }
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
    meta: { requiresAuth: true }
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

// Navigation guard corrigido
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    try {
      // Aguarda o Firebase inicializar e verificar se há usuário logado
      const currentUser = await getCurrentUser()
      
      if (currentUser) {
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
        next('/')
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