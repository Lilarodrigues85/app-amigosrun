import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

console.log('🔵 [Firebase] Iniciando configuração do Firebase')

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

console.log('📦 [Firebase] Configuração carregada:', {
  apiKey: firebaseConfig.apiKey ? '✅ Presente' : '❌ Ausente',
  authDomain: firebaseConfig.authDomain || '❌ Ausente',
  projectId: firebaseConfig.projectId || '❌ Ausente',
  storageBucket: firebaseConfig.storageBucket || '❌ Ausente',
  messagingSenderId: firebaseConfig.messagingSenderId ? '✅ Presente' : '❌ Ausente',
  appId: firebaseConfig.appId ? '✅ Presente' : '❌ Ausente'
})

console.log('🔄 [Firebase] Inicializando app...')
const app = initializeApp(firebaseConfig)
console.log('✅ [Firebase] App inicializado')

console.log('🔄 [Firebase] Inicializando Auth...')
export const auth = getAuth(app)
console.log('✅ [Firebase] Auth inicializado')

console.log('🔄 [Firebase] Inicializando Firestore...')
export const db = getFirestore(app)
console.log('✅ [Firebase] Firestore inicializado')

console.log('🎉 [Firebase] Configuração completa!')
console.log('📊 [Firebase] Project ID:', firebaseConfig.projectId)
console.log('🌐 [Firebase] Auth Domain:', firebaseConfig.authDomain)