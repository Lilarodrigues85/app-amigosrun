// Script para adicionar admin Dalila no Firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'
import * as dotenv from 'dotenv'

// Carregar variáveis de ambiente
dotenv.config()

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

console.log('🔧 Inicializando Firebase...')
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const adminEmail = 'dalila.analistadesistema@gmail.com'

async function addAdmin() {
  try {
    console.log(`\n📝 Adicionando admin: ${adminEmail}`)
    
    await setDoc(doc(db, 'admins', adminEmail), {
      email: adminEmail,
      role: 'admin',
      name: 'Dalila',
      createdAt: Timestamp.now()
    })
    
    console.log('✅ Admin adicionado com sucesso!')
    console.log('\n📊 Dados do admin:')
    console.log(`   Email: ${adminEmail}`)
    console.log(`   Role: admin`)
    console.log(`   Name: Dalila`)
    console.log(`   CreatedAt: ${new Date().toISOString()}`)
    console.log('\n🎉 Pronto! Agora você pode fazer login como admin.')
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Erro ao adicionar admin:', error)
    process.exit(1)
  }
}

addAdmin()
