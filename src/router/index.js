import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase/config'
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

// Navigation guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else if (to.path === '/login' && currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router