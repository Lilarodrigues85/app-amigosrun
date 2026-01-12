import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'

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
    path: '/perfil',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/profile/:id',
    name: 'PublicProfile',
    component: () => import('@/views/PublicProfile.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router