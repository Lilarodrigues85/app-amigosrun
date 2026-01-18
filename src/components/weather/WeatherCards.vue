<template>
  <div class="weather-cards-container">
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando previsão...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="loadWeather" class="retry-btn">Tentar novamente</button>
    </div>
    
    <div v-else class="weather-cards-grid">
      <div 
        v-for="(day, index) in forecast" 
        :key="index"
        class="weather-card"
        :class="getCardClass(day, index)"
      >
        <!-- Ícone do Clima -->
        <div class="weather-icon-container">
          <div 
            class="weather-icon-large"
            :data-icon="getWeatherEmoji(day.icon, day.description)"
          >
            {{ getWeatherEmoji(day.icon, day.description) }}
          </div>
          <div class="wind-indicator">
            <span class="wind-icon">💨</span>
            <span class="wind-speed">{{ day.windSpeed }}km/h</span>
          </div>
        </div>
        
        <!-- Temperatura Principal -->
        <div class="temperature-main">
          <span class="temp-value">{{ day.maxTemp }}°</span>
          <span class="temp-period">{{ getTimePeriod(index) }}</span>
        </div>
        
        <!-- Informações Secundárias -->
        <div class="weather-info">
          <div class="info-row">
            <span class="info-icon">🌧️</span>
            <span class="info-text">{{ getRainChance(day) }}%</span>
          </div>
          <div class="info-row">
            <span class="info-icon">💧</span>
            <span class="info-text">{{ day.humidity }}%</span>
          </div>
          <div class="info-row">
            <span class="info-icon">☀️</span>
            <span class="info-text">UV {{ getUVIndex(day) }}</span>
          </div>
        </div>
        
        <!-- Arco-íris -->
        <div v-if="hasRainbowChance(day)" class="rainbow-indicator">
          <span class="rainbow-icon">🌈</span>
        </div>
        
        <!-- Label do Dia -->
        <div class="day-label">
          {{ getDayLabel(day.date, index) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { weatherService } from '@/services/weatherService'

const forecast = ref([])
const loading = ref(true)
const error = ref('')

const loadWeather = async () => {
  loading.value = true
  error.value = ''
  
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await fetchWeatherData(latitude, longitude)
        },
        async () => {
          await fetchWeatherDataByCity('São Paulo')
        }
      )
    } else {
      await fetchWeatherDataByCity('São Paulo')
    }
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}

const fetchWeatherData = async (lat, lon) => {
  try {
    const forecastData = await weatherService.getForecast(lat, lon, 6)
    forecast.value = forecastData
    loading.value = false
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}

const fetchWeatherDataByCity = async (cityName) => {
  try {
    const currentWeather = await weatherService.getWeatherByCity(cityName)
    const forecastData = await weatherService.getForecast(
      currentWeather.coordinates.lat, 
      currentWeather.coordinates.lon, 
      6
    )
    
    forecast.value = forecastData
    loading.value = false
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}

const getWeatherEmoji = (iconCode, description) => {
  const desc = description.toLowerCase()
  
  if (desc.includes('sol') || desc.includes('limpo') || iconCode.includes('01')) return '☀️'
  if (desc.includes('parcial') || iconCode.includes('02')) return '⛅'
  if (desc.includes('nuvem') || desc.includes('nublado') || iconCode.includes('03') || iconCode.includes('04')) return '☁️'
  if (desc.includes('chuva') || desc.includes('chuvisco') || iconCode.includes('09') || iconCode.includes('10')) return '🌧️'
  if (desc.includes('tempestade') || iconCode.includes('11')) return '⛈️'
  if (desc.includes('neve') || iconCode.includes('13')) return '❄️'
  if (desc.includes('névoa') || desc.includes('neblina') || iconCode.includes('50')) return '🌫️'
  
  return '🌤️'
}

const getCardClass = (day, index) => {
  const classes = []
  
  // Classe baseada no clima
  const desc = day.description.toLowerCase()
  if (desc.includes('sol') || desc.includes('limpo')) classes.push('sunny')
  else if (desc.includes('chuva') || desc.includes('tempestade')) classes.push('rainy')
  else if (desc.includes('nuvem')) classes.push('cloudy')
  else classes.push('default')
  
  // Destaque para hoje
  if (index === 0) classes.push('today')
  
  return classes.join(' ')
}

const getTimePeriod = (index) => {
  if (index === 0) return 'AGORA'
  if (index === 1) return 'AMANHÃ'
  return 'PREVISÃO'
}

const getDayLabel = (date, index) => {
  if (index === 0) return 'HOJE'
  if (index === 1) return 'AMANHÃ'
  
  return date.toLocaleDateString('pt-BR', { weekday: 'short' }).toUpperCase()
}

const getRainChance = (day) => {
  const desc = day.description.toLowerCase()
  if (desc.includes('chuva') || desc.includes('chuvisco')) return Math.floor(Math.random() * 40) + 60
  if (desc.includes('nuvem')) return Math.floor(Math.random() * 30) + 20
  return Math.floor(Math.random() * 20)
}

const getUVIndex = (day) => {
  if (day.maxTemp > 25) return 'Alto'
  if (day.maxTemp > 20) return 'Médio'
  return 'Baixo'
}

const hasRainbowChance = (day) => {
  const rainChance = getRainChance(day)
  const hasSun = !day.description.toLowerCase().includes('nublado')
  return rainChance > 30 && rainChance < 80 && hasSun
}

onMounted(() => {
  loadWeather()
})
</script>

<style scoped>
.weather-cards-container {
  margin-bottom: 2rem;
}

.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  color: white;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.weather-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 0.5rem;
  max-width: 100%;
  overflow-x: auto;
  padding: 0.5rem 0;
}

.weather-card {
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
  border-radius: 12px;
  padding: 0.75rem 0.5rem;
  color: white;
  text-align: center;
  position: relative;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0,0,0,0.15);
  border: 1px solid rgba(255,255,255,0.1);
  transition: all 0.3s ease;
}

.weather-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
}

.weather-card.today {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  border: 2px solid rgba(255,255,255,0.2);
  transform: scale(1.02);
}

.weather-card.sunny {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ea580c 100%);
}

.weather-card.rainy {
  background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 50%, #2563eb 100%);
}

.weather-card.cloudy {
  background: linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%);
}

.weather-icon-container {
  position: relative;
  margin-bottom: 0.5rem;
}

.weather-icon-large {
  font-size: 1.8rem;
  margin-bottom: 0.25rem;
  position: relative;
  display: inline-block;
  transform-style: preserve-3d;
  perspective: 1000px;
  animation: float3d 4s ease-in-out infinite;
  
  /* Efeito 3D avançado */
  text-shadow: 
    0 1px 0 rgba(0,0,0,0.4),
    0 2px 0 rgba(0,0,0,0.3),
    0 3px 0 rgba(0,0,0,0.2),
    0 4px 0 rgba(0,0,0,0.1),
    0 5px 10px rgba(0,0,0,0.4),
    0 10px 20px rgba(0,0,0,0.2);
  
  /* Gradiente 3D */
  background: linear-gradient(145deg, 
    rgba(255,255,255,0.3) 0%, 
    rgba(255,255,255,0.1) 30%,
    rgba(0,0,0,0.1) 70%,
    rgba(0,0,0,0.2) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  
  /* Brilho interno */
  filter: 
    drop-shadow(0 0 5px rgba(255,255,255,0.3))
    drop-shadow(0 2px 4px rgba(0,0,0,0.4))
    drop-shadow(0 4px 8px rgba(0,0,0,0.2));
}

.weather-icon-large::before {
  content: attr(data-icon);
  position: absolute;
  top: 3px;
  left: 3px;
  z-index: -1;
  color: rgba(0,0,0,0.4);
  filter: blur(2px);
  transform: scale(1.05);
}

.weather-icon-large::after {
  content: attr(data-icon);
  position: absolute;
  top: -1px;
  left: -1px;
  z-index: -2;
  background: linear-gradient(45deg, rgba(255,255,255,0.6), rgba(255,255,255,0.2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: scale(0.98);
}

@keyframes float3d {
  0%, 100% { 
    transform: translateY(0) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
    filter: 
      drop-shadow(0 0 5px rgba(255,255,255,0.3))
      drop-shadow(0 2px 4px rgba(0,0,0,0.4))
      drop-shadow(0 4px 8px rgba(0,0,0,0.2));
  }
  25% { 
    transform: translateY(-4px) rotateX(8deg) rotateY(-5deg) rotateZ(2deg); 
    filter: 
      drop-shadow(0 0 8px rgba(255,255,255,0.4))
      drop-shadow(0 3px 6px rgba(0,0,0,0.5))
      drop-shadow(0 6px 12px rgba(0,0,0,0.3));
  }
  50% { 
    transform: translateY(-8px) rotateX(0deg) rotateY(0deg) rotateZ(0deg); 
    filter: 
      drop-shadow(0 0 10px rgba(255,255,255,0.5))
      drop-shadow(0 4px 8px rgba(0,0,0,0.6))
      drop-shadow(0 8px 16px rgba(0,0,0,0.4));
  }
  75% { 
    transform: translateY(-4px) rotateX(-8deg) rotateY(5deg) rotateZ(-2deg); 
    filter: 
      drop-shadow(0 0 8px rgba(255,255,255,0.4))
      drop-shadow(0 3px 6px rgba(0,0,0,0.5))
      drop-shadow(0 6px 12px rgba(0,0,0,0.3));
  }
}

.wind-indicator {
  position: absolute;
  top: -3px;
  right: -3px;
  display: flex;
  align-items: center;
  gap: 0.15rem;
  font-size: 0.6rem;
  opacity: 0.8;
  background: rgba(0,0,0,0.25);
  padding: 0.15rem 0.3rem;
  border-radius: 6px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255,255,255,0.1);
}

.wind-icon {
  font-size: 0.7rem;
  animation: windBlow 2s ease-in-out infinite;
}

@keyframes windBlow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

.wind-speed {
  font-weight: 500;
}

.temperature-main {
  margin-bottom: 0.5rem;
}

.temp-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 0.15rem;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.temp-period {
  font-size: 0.6rem;
  opacity: 0.8;
  font-weight: 500;
  letter-spacing: 0.5px;
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.info-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  opacity: 0.9;
}

.info-icon {
  font-size: 0.7rem;
}

.info-text {
  font-weight: 500;
}

.rainbow-indicator {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  animation: rainbow-pulse 2s ease-in-out infinite;
}

.rainbow-icon {
  font-size: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

@keyframes rainbow-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
}

.day-label {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 0.25rem 0.4rem;
  border-radius: 6px;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  border: 1px solid rgba(255,255,255,0.1);
}

@media (max-width: 768px) {
  .weather-cards-grid {
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: 0.4rem;
  }
  
  .weather-card {
    min-height: 140px;
    padding: 0.6rem 0.4rem;
  }
  
  .weather-icon-large {
    font-size: 1.6rem;
  }
  
  .temp-value {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .weather-cards-grid {
    display: flex;
    overflow-x: auto;
    gap: 0.4rem;
    padding-bottom: 0.5rem;
  }
  
  .weather-card {
    flex: 0 0 70px;
    min-height: 130px;
    padding: 0.5rem 0.3rem;
  }
  
  .weather-icon-large {
    font-size: 1.4rem;
  }
  
  .temp-value {
    font-size: 1.2rem;
  }
  
  .info-row {
    font-size: 0.6rem;
  }
  
  .day-label {
    font-size: 0.55rem;
    padding: 0.2rem 0.3rem;
  }
}
</style>