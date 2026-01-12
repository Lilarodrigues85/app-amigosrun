import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import Corridas from '@/views/Corridas.vue'
import Mapa from '@/views/Mapa.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/corridas',
    name: 'Corridas',
    component: Corridas
  },
  {
    path: '/mapa',
    name: 'Mapa',
    component: Mapa
  },
  {
    path: '/perfil',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/perfil/:id',
    name: 'PublicProfile',
    component: () => import('@/views/PublicProfile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router