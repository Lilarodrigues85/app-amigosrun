# Amigos Run - Web App Especificação Técnica

<div align="center">

**Web App** | **Versão**: 1.0.0 | **Última Atualização**: 19/10/2025

[![DATAMETRIA](https://img.shields.io/badge/DATAMETRIA-Standards-blue)](link)
[![Firebase](https://img.shields.io/badge/Firebase-Free%20Tier-orange)](link)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.3+-green)](link)

</div>

---

## 📋 Índice

- [🎯 Visão Geral](#visao-geral)
- [🏗️ Arquitetura Firebase](#arquitetura-firebase)
- [🔧 Implementação por Feature](#implementacao-por-feature)
- [💰 Limites Free Tier](#limites-free-tier)
- [🚀 Estrutura do Projeto](#estrutura-do-projeto)

---

## 🎯 Visão Geral

### Stack Tecnológico

| Componente | Tecnologia | Custo |
|------------|------------|-------|
| **Frontend** | Vue.js 3.3+ + Vite | Gratuito |
| **Backend** | Firebase (Free Tier) | Gratuito |
| **Autenticação** | Firebase Auth | Gratuito |
| **Banco de Dados** | Cloud Firestore | Gratuito até 50k reads/day |
| **Storage** | Firebase Storage | Gratuito até 5GB |
| **Hosting** | Firebase Hosting | Gratuito até 10GB |
| **Mapas** | OpenStreetMap + Leaflet | Gratuito ilimitado |
| **Clima** | OpenWeatherMap API | Gratuito até 1000 calls/day |

### Funcionalidades Core

- ✅ Login com confirmação de email
- ✅ Perfil completo (foto, dados, meta)
- ✅ Calendário com previsão do tempo
- ✅ Corridas do mês
- ✅ Mapa com Google Maps
- ✅ Sistema "Vou/Não Vou"
- ✅ Feed de interação (texto only)
- ✅ Localização em tempo real

---

## 🏗️ Arquitetura Firebase

### Estrutura do Firestore

```
users/{uid}
├── name: string
├── email: string
├── photoUrl: string
├── peso: number
├── altura: number
├── meta: string
├── biografia: string
├── corridasInscritas: array
└── createdAt: timestamp

corridas/{runId}
├── titulo: string
├── data: timestamp
├── local: object
│   ├── endereco: string
│   ├── cidade: string
│   ├── lat: number
│   └── lng: number
├── linkInscricao: string
├── valor: number
├── createdBy: string
└── createdAt: timestamp

corridas/{runId}/presencas/{uid}
├── status: "vou" | "nao_vou"
├── userName: string
└── updatedAt: timestamp

feed/{postId}
├── userId: string
├── runId: string (opcional)
├── texto: string
├── userName: string
└── createdAt: timestamp

locations/{uid}
├── lat: number
├── lng: number
├── isActive: boolean
└── updatedAt: timestamp
```

### Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - só o próprio usuário pode editar
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Corridas - qualquer autenticado pode ler, só criador pode editar
    match /corridas/{runId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.createdBy;
    }
    
    // Presenças - só o próprio usuário pode alterar
    match /corridas/{runId}/presencas/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Feed - qualquer autenticado pode ler/criar, só autor pode editar
    match /feed/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
    
    // Locations - só o próprio usuário pode alterar
    match /locations/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🔧 Implementação por Feature

### 1. Login com Confirmação

```javascript
// src/services/authService.js
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth'
import { auth } from '@/firebase/config'

export const authService = {
  async signUp(email, password) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await sendEmailVerification(result.user)
      return result
    } catch (error) {
      throw new Error(`Erro no cadastro: ${error.message}`)
    }
  },

  async signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      if (!result.user.emailVerified) {
        throw new Error('Email não verificado. Verifique sua caixa de entrada.')
      }
      
      return result
    } catch (error) {
      throw new Error(`Erro no login: ${error.message}`)
    }
  },

  async logout() {
    await signOut(auth)
  }
}
```

### 2. Perfil do Usuário

```javascript
// src/services/userService.js
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/config'

export const userService = {
  async createUser(uid, userData) {
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, {
      ...userData,
      corridasInscritas: [],
      createdAt: serverTimestamp()
    })
  },

  async updateUser(uid, userData) {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, userData)
  },

  async uploadProfilePhoto(uid, file) {
    const photoRef = ref(storage, `profile_photos/${uid}.jpg`)
    await uploadBytes(photoRef, file)
    return await getDownloadURL(photoRef)
  },

  async getUser(uid) {
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)
    return userSnap.exists() ? { uid, ...userSnap.data() } : null
  }
}

// src/composables/useUser.js
import { ref, computed } from 'vue'
import { useAuthState } from '@vueuse/firebase/useAuth'
import { userService } from '@/services/userService'

export function useUser() {
  const { user } = useAuthState()
  const userData = ref(null)
  const loading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  
  const loadUserData = async () => {
    if (!user.value) return
    loading.value = true
    try {
      userData.value = await userService.getUser(user.value.uid)
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    userData,
    loading,
    isLoggedIn,
    loadUserData
  }
}
```

### 3. Calendário + Previsão do Tempo (SEM Cloud Functions)

```javascript
// src/services/corridaService.js
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const corridaService = {
  async createCorrida(corridaData) {
    const corridasRef = collection(db, 'corridas')
    return await addDoc(corridasRef, {
      ...corridaData,
      createdAt: serverTimestamp()
    })
  },

  async getCorridasDoMes(ano, mes) {
    const startDate = new Date(ano, mes - 1, 1)
    const endDate = new Date(ano, mes, 0)
    
    const q = query(
      collection(db, 'corridas'),
      where('data', '>=', startDate),
      where('data', '<=', endDate),
      orderBy('data', 'asc')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
}

// src/services/weatherService.js - OpenWeatherMap API
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export const weatherService = {
  cache: new Map(),
  
  async getWeatherForecast(cidade, data) {
    const diasAte = Math.ceil((new Date(data) - new Date()) / (1000 * 60 * 60 * 24))
    
    if (diasAte > 7 || diasAte < 0) return null
    
    const cacheKey = `${cidade}-${new Date(data).toDateString()}`
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)
      const cacheAge = Date.now() - cached.timestamp
      if (cacheAge < 2 * 60 * 60 * 1000) {
        return cached.data
      }
    }
    
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cidade},BR&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
      )
      
      if (response.ok) {
        const result = await response.json()
        
        const targetDate = new Date(data).toDateString()
        const forecast = result.list.find(item => 
          new Date(item.dt * 1000).toDateString() === targetDate
        )
        
        const weatherData = forecast ? {
          temperature: Math.round(forecast.main.temp),
          text: forecast.weather[0].description,
          icon: `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`
        } : null
        
        if (weatherData) {
          this.cache.set(cacheKey, {
            data: weatherData,
            timestamp: Date.now()
          })
        }
        
        return weatherData
      }
    } catch (error) {
      console.error('Erro ao buscar clima:', error)
    }
    
    return null
  }
}

// src/components/CalendarioView.vue
<template>
  <div class="calendario">
    <div class="mes-navegacao">
      <button @click="mesAnterior">‹</button>
      <h2>{{ mesAtual.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }) }}</h2>
      <button @click="proximoMes">›</button>
    </div>
    
    <div class="corridas-mes">
      <div v-for="corrida in corridas" :key="corrida.id" class="corrida-card">
        <h3>{{ corrida.titulo }}</h3>
        <p>📅 {{ new Date(corrida.data.seconds * 1000).toLocaleDateString('pt-BR') }}</p>
        <p>📍 {{ corrida.local.endereco }}</p>
        <p>💰 R$ {{ corrida.valor }}</p>
        
        <div v-if="corrida.weather" class="weather">
          <p>🌤️ {{ corrida.weather.text }}</p>
          <p>🌡️ {{ corrida.weather.temperature }}°C</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { corridaService } from '@/services/corridaService'
import { weatherService } from '@/services/weatherService'

const mesAtual = ref(new Date())
const corridas = ref([])

const carregarCorridas = async () => {
  const ano = mesAtual.value.getFullYear()
  const mes = mesAtual.value.getMonth() + 1
  
  corridas.value = await corridaService.getCorridasDoMes(ano, mes)
  
  // Buscar previsão do tempo para cada corrida
  for (const corrida of corridas.value) {
    corrida.weather = await weatherService.getWeatherForecast(
      corrida.local.cidade, 
      corrida.data.seconds * 1000
    )
  }
}

const mesAnterior = () => {
  mesAtual.value = new Date(mesAtual.value.getFullYear(), mesAtual.value.getMonth() - 1)
}

const proximoMes = () => {
  mesAtual.value = new Date(mesAtual.value.getFullYear(), mesAtual.value.getMonth() + 1)
}

watch(mesAtual, carregarCorridas)
onMounted(carregarCorridas)
</script>
```

### 4. Sistema "Vou/Não Vou"

```javascript
// src/services/presencaService.js
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const presencaService = {
  async marcarPresenca(runId, userId, userName, vou) {
    const presencaRef = doc(db, 'corridas', runId, 'presencas', userId)
    await setDoc(presencaRef, {
      status: vou ? 'vou' : 'nao_vou',
      userName,
      updatedAt: serverTimestamp()
    })
  },

  async getPresencas(runId) {
    const q = query(
      collection(db, 'corridas', runId, 'presencas'),
      where('status', '==', 'vou')
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }))
  }
}

// src/components/PresencaWidget.vue
<template>
  <div class="presenca-widget">
    <div class="botoes">
      <button 
        @click="marcarPresenca(true)" 
        :class="{ active: minhaPresenca === 'vou' }"
        class="btn-vou"
      >
        ✅ Vou ({{ totalVou }})
      </button>
      
      <button 
        @click="marcarPresenca(false)" 
        :class="{ active: minhaPresenca === 'nao_vou' }"
        class="btn-nao-vou"
      >
        ❌ Não Vou
      </button>
    </div>
    
    <div class="lista-presencas" v-if="presencas.length > 0">
      <h4>Quem vai:</h4>
      <div class="participantes">
        <span v-for="pessoa in presencas" :key="pessoa.userId" class="participante">
          {{ pessoa.userName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { presencaService } from '@/services/presencaService'
import { useUser } from '@/composables/useUser'

const props = defineProps(['runId'])
const { user, userData } = useUser()

const presencas = ref([])
const minhaPresenca = ref(null)

const totalVou = computed(() => presencas.value.length)

const marcarPresenca = async (vou) => {
  if (!user.value || !userData.value) return
  
  await presencaService.marcarPresenca(
    props.runId, 
    user.value.uid, 
    userData.value.name, 
    vou
  )
  
  minhaPresenca.value = vou ? 'vou' : 'nao_vou'
  await carregarPresencas()
}

const carregarPresencas = async () => {
  presencas.value = await presencaService.getPresencas(props.runId)
  
  // Verificar minha presença
  const minha = presencas.value.find(p => p.userId === user.value?.uid)
  minhaPresenca.value = minha?.status || null
}

onMounted(carregarPresencas)
</script>
```

### 5. Feed de Interação

```javascript
// src/services/feedService.js
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const feedService = {
  async createPost(userId, userName, texto, runId = null) {
    const feedRef = collection(db, 'feed')
    return await addDoc(feedRef, {
      userId,
      userName,
      texto,
      runId,
      createdAt: serverTimestamp()
    })
  },

  async getFeed(limitCount = 50) {
    const q = query(
      collection(db, 'feed'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }
}

// src/components/FeedView.vue
<template>
  <div class="feed">
    <div class="novo-post">
      <textarea 
        v-model="novoPost" 
        placeholder="Compartilhe algo com os corredores..."
        maxlength="280"
      ></textarea>
      <button @click="publicarPost" :disabled="!novoPost.trim()">Publicar</button>
    </div>
    
    <div class="posts">
      <div v-for="post in posts" :key="post.id" class="post">
        <div class="post-header">
          <strong>{{ post.userName }}</strong>
          <span class="data">{{ formatarData(post.createdAt) }}</span>
        </div>
        <p class="post-texto">{{ post.texto }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { feedService } from '@/services/feedService'
import { useUser } from '@/composables/useUser'

const { user, userData } = useUser()
const posts = ref([])
const novoPost = ref('')

const publicarPost = async () => {
  if (!user.value || !userData.value || !novoPost.value.trim()) return
  
  await feedService.createPost(
    user.value.uid,
    userData.value.name,
    novoPost.value.trim()
  )
  
  novoPost.value = ''
  await carregarFeed()
}

const carregarFeed = async () => {
  posts.value = await feedService.getFeed()
}

const formatarData = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp.seconds * 1000).toLocaleString('pt-BR')
}

onMounted(carregarFeed)
</script>
```

### 6. Localização em Tempo Real

```javascript
// src/services/locationService.js
import { doc, setDoc, updateDoc, collection, query, where, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const locationService = {
  locationInterval: null,

  async startSharingLocation(userId, userName) {
    if (!navigator.geolocation) {
      throw new Error('Geolocalização não suportada')
    }

    const updateLocation = () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const locationRef = doc(db, 'locations', userId)
          await setDoc(locationRef, {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            userName,
            isActive: true,
            updatedAt: serverTimestamp()
          })
        },
        (error) => console.error('Erro ao obter localização:', error),
        { enableHighAccuracy: true, timeout: 10000 }
      )
    }

    // Atualizar imediatamente
    updateLocation()
    
    // Atualizar a cada 10 segundos
    this.locationInterval = setInterval(updateLocation, 10000)
  },

  async stopSharingLocation(userId) {
    if (this.locationInterval) {
      clearInterval(this.locationInterval)
      this.locationInterval = null
    }

    const locationRef = doc(db, 'locations', userId)
    await updateDoc(locationRef, { isActive: false })
  },

  async getActiveLocations() {
    const q = query(
      collection(db, 'locations'),
      where('isActive', '==', true)
    )
    
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ userId: doc.id, ...doc.data() }))
  }
}

// src/components/MapaView.vue
<template>
  <div class="mapa-container">
    <div class="controles">
      <button 
        @click="toggleCompartilhamento" 
        :class="{ active: compartilhandoLocalizacao }"
      >
        {{ compartilhandoLocalizacao ? '📍 Parar Compartilhamento' : '📍 Compartilhar Localização' }}
      </button>
    </div>
    
    <div id="mapa" class="mapa"></div>
    
    <div class="usuarios-ativos" v-if="localizacoesAtivas.length > 0">
      <h4>Corredores Online:</h4>
      <div class="lista-usuarios">
        <span v-for="loc in localizacoesAtivas" :key="loc.userId" class="usuario-ativo">
          🏃‍♂️ {{ loc.userName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { locationService } from '@/services/locationService'
import { useUser } from '@/composables/useUser'

const { user, userData } = useUser()
const compartilhandoLocalizacao = ref(false)
const localizacoesAtivas = ref([])
let mapa = null
let markers = new Map()

const toggleCompartilhamento = async () => {
  if (!user.value || !userData.value) return
  
  if (compartilhandoLocalizacao.value) {
    await locationService.stopSharingLocation(user.value.uid)
    compartilhandoLocalizacao.value = false
  } else {
    await locationService.startSharingLocation(user.value.uid, userData.value.name)
    compartilhandoLocalizacao.value = true
  }
}

const carregarLocalizacoes = async () => {
  localizacoesAtivas.value = await locationService.getActiveLocations()
  atualizarMarcadores()
}

const atualizarMarcadores = () => {
  if (!mapa) return
  
  // Limpar marcadores antigos
  markers.forEach(marker => marker.setMap(null))
  markers.clear()
  
  // Adicionar novos marcadores
  localizacoesAtivas.value.forEach(loc => {
    const marker = new google.maps.Marker({
      position: { lat: loc.lat, lng: loc.lng },
      map: mapa,
      title: loc.userName,
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="8" fill="#4285f4" stroke="white" stroke-width="2"/>
            <text x="12" y="16" text-anchor="middle" fill="white" font-size="12">🏃</text>
          </svg>
        `),
        scaledSize: new google.maps.Size(24, 24)
      }
    })
    
    markers.set(loc.userId, marker)
  })
}

const inicializarMapa = () => {
  mapa = new google.maps.Map(document.getElementById('mapa'), {
    zoom: 13,
    center: { lat: -23.5505, lng: -46.6333 }, // São Paulo
    mapTypeId: 'roadmap'
  })
}

// Atualizar localizações a cada 15 segundos
let intervalId = null

onMounted(() => {
  inicializarMapa()
  carregarLocalizacoes()
  intervalId = setInterval(carregarLocalizacoes, 15000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
  if (compartilhandoLocalizacao.value && user.value) {
    locationService.stopSharingLocation(user.value.uid)
  }
})
</script>
```

---

## 💰 Limites Free Tier (SEM Cloud Functions)

### Firebase Spark Plan (Gratuito)
- **Firestore Reads**: 50,000/dia
- **Firestore Writes**: 20,000/dia
- **Storage**: 5 GB
- **Hosting**: 10 GB/mês
- **❌ Cloud Functions**: NÃO DISPONÍVEL

### APIs Externas
- **Google Maps**: $200 crédito/mês (~28k loads)
- **Climatempo**: 100 requests/dia (gratuito)
- **AllOrigins Proxy**: Gratuito (rate limited)

### Alternativas Gratuitas para Proxy

| Serviço | Limite | Vantagem |
|---------|--------|-----------|
| **AllOrigins** | Rate limited | Simples, sem setup |
| **Netlify Functions** | 125k requests/mês | Integrado com hosting |
| **Vercel Edge** | 100k requests/mês | Rápido, global |
| **Railway** | 500h/mês | Backend completo |
| **Render** | 750h/mês | Deploy automático |

### Alternativas SEM Cloud Functions

#### 1. **Proxy CORS Público** (Usado acima)
```javascript
// Usar allorigins.win como proxy gratuito
const proxyUrl = 'https://api.allorigins.win/raw?url='
const response = await fetch(proxyUrl + encodeURIComponent(apiUrl))
```

#### 2. **Netlify Functions** (Se hospedar na Netlify)
```javascript
// netlify/functions/weather.js
exports.handler = async (event) => {
  const { cidade, data } = event.queryStringParameters
  
  const response = await fetch(
    `http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${cidade}/days/15?token=${process.env.CLIMATEMPO_TOKEN}`
  )
  
  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify(await response.json())
  }
}

// No frontend
const weather = await fetch('/.netlify/functions/weather?cidade=3477&data=2025-01-01')
```

#### 3. **Backend Simples (Recomendado)**
```javascript
// server.js - Deploy no Railway/Render (gratuito)
const express = require('express')
const cors = require('cors')
const fetch = require('node-fetch')

const app = express()
app.use(cors())

app.get('/weather/:cidade/:data', async (req, res) => {
  try {
    const { cidade, data } = req.params
    const response = await fetch(
      `http://apiadvisor.climatempo.com.br/api/v1/forecast/locale/${cidade}/days/15?token=${process.env.CLIMATEMPO_TOKEN}`
    )
    
    const weatherData = await response.json()
    res.json(weatherData)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar clima' })
  }
})

app.listen(process.env.PORT || 3000)
```

```javascript
// src/utils/cache.js
class CacheService {
  constructor() {
    this.cache = new Map()
    this.cacheTime = new Map()
  }

  isValid(key, minutesValid = 5) {
    const time = this.cacheTime.get(key)
    if (!time) return false
    return (Date.now() - time) / (1000 * 60) < minutesValid
  }

  get(key) {
    return this.isValid(key) ? this.cache.get(key) : null
  }

  set(key, value) {
    this.cache.set(key, value)
    this.cacheTime.set(key, Date.now())
  }

  clear() {
    this.cache.clear()
    this.cacheTime.clear()
  }
}

export const cacheService = new CacheService()

// Pagination para economizar reads
export const getCorridasPaginated = async (lastDoc = null, limitCount = 10) => {
  let q = query(
    collection(db, 'corridas'),
    orderBy('data', 'desc'),
    limit(limitCount)
  )
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }
  
  const snapshot = await getDocs(q)
  return {
    docs: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    lastDoc: snapshot.docs[snapshot.docs.length - 1]
  }
}

// Composable para cache reativo
import { ref, computed } from 'vue'

export function useCache(key, fetcher, options = {}) {
  const { ttl = 5 } = options
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetch = async () => {
    // Verificar cache primeiro
    const cached = cacheService.get(key)
    if (cached) {
      data.value = cached
      return cached
    }

    loading.value = true
    error.value = null
    
    try {
      const result = await fetcher()
      data.value = result
      cacheService.set(key, result)
      return result
    } catch (err) {
      error.value = err
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    data: computed(() => data.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetch
  }
}
```

---

## 🚀 Estrutura do Projeto

```
src/
├── main.js
├── App.vue
├── router/
│   └── index.js
├── stores/
│   ├── auth.js
│   ├── user.js
│   └── corridas.js
├── services/
│   ├── authService.js
│   ├── userService.js
│   ├── corridaService.js
│   ├── weatherService.js
│   ├── presencaService.js
│   ├── feedService.js
│   └── locationService.js
├── composables/
│   ├── useUser.js
│   ├── useAuth.js
│   └── useGeolocation.js
├── components/
│   ├── auth/
│   │   ├── LoginForm.vue
│   │   └── RegisterForm.vue
│   ├── profile/
│   │   └── ProfileForm.vue
│   ├── corridas/
│   │   ├── CalendarioView.vue
│   │   ├── CorridaCard.vue
│   │   └── AddCorridaForm.vue
│   ├── feed/
│   │   └── FeedView.vue
│   ├── map/
│   │   └── MapaView.vue
│   └── common/
│       ├── WeatherWidget.vue
│       └── PresencaWidget.vue
├── views/
│   ├── Home.vue
│   ├── Profile.vue
│   ├── Corridas.vue
│   ├── Feed.vue
│   └── Mapa.vue
├── firebase/
│   └── config.js
└── assets/
    ├── css/
    └── images/
```

### package.json

```json
{
  "name": "amigos-run",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy"
  },
  "dependencies": {
    "vue": "^3.3.8",
    "vue-router": "^4.2.5",
    "pinia": "^2.1.7",
    "firebase": "^10.7.1",
    "@vueuse/firebase": "^10.7.0",
    "leaflet": "^1.9.4"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.5.2",
    "vite": "^5.0.8"
  }
}
```

### Comandos de Setup

```bash
# Criar projeto Vue
npm create vue@latest amigos-run
cd amigos-run

# Instalar dependências
npm install
npm install firebase @vueuse/firebase @vueuse/core pinia leaflet

# Configurar Firebase
npm install -g firebase-tools
firebase login
firebase init hosting

# Executar em desenvolvimento
npm run dev

# Build e deploy
npm run build
firebase deploy
```

### Configuração Firebase

```javascript
// src/firebase/config.js
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
```

### .env

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLIMATEMPO_TOKEN=your_climatempo_token
VITE_OPENWEATHER_API_KEY=your_openweather_key
```

---

## 🎯 Próximos Passos

### MVP (4 semanas)
1. **Semana 1**: Auth + Perfil
2. **Semana 2**: Corridas + Calendário  
3. **Semana 3**: Mapa + Presença
4. **Semana 4**: Feed + Localização

### Pós-MVP
- Push notifications (FCM)
- Chat entre participantes
- Ranking de corredores
- Integração com wearables
- Monetização (premium features)

---

**Desenvolvido por**: Equipe DATAMETRIA  
**Versão**: 1.0.0  
**Data**: 19/10/2025