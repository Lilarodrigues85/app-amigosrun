import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuth } from '@/composables/useAuth'

// Aguardar inicialização do Firebase Auth
const { waitForAuthInit } = useAuth()

const initApp = async () => {
  // Aguarda o Firebase Auth inicializar
  await waitForAuthInit()
  
  const app = createApp(App)
  
  app.use(createPinia())
  app.use(router)
  
  app.mount('#app')
  
  console.log('App initialized with Firebase Auth')
}

initApp().catch(error => {
  console.error('Error initializing app:', error)
})