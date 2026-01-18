<template>
  <div class="weather-cards">
    <h3 class="weather-title">🌤️ Previsão do Tempo</h3>
    
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando previsão...</p>
    </div>
    
    <div v-else-if="error" class="error-state">
      <p>❌ {{ error }}</p>
      <button @click="loadWeather" class="retry-btn">Tentar novamente</button>
    </div>
    
    <div v-else class="weather-grid">
      <div 
        v-for="(day, index) in forecast" 
        :key="index"
        class="weather-card"
        :class="{ 'today': index === 0 }"
      >
        <!-- Header do Card -->
        <div class="card-header">
          <div class="day-info">
            <span class="day-name">{{ getDayName(day.date, index) }}</span>
            <span class="day-date">{{ formatDate(day.date) }}</span>
          </div>
          <img 
            :src="getWeatherIcon(day.icon)" 
            :alt="day.description"
            class="weather-icon"
          />
        </div>
        
        <!-- Temperatura -->
        <div class="temperature-section">
          <div class="temp-main">
            <span class="temp-max">{{ day.maxTemp }}°</span>
            <span class="temp-min">{{ day.minTemp }}°</span>
          </div>
          <p class="weather-desc">{{ day.description }}</p>
        </div>
        
        <!-- Informações Detalhadas -->
        <div class="weather-details">
          <!-- Chuva -->
          <div class="detail-item">
            <span class="detail-icon">🌧️</span>
            <div class="detail-info">
              <span class="detail-label">Chuva</span>
              <span class="detail-value">{{ getRainChance(day) }}%</span>
            </div>
          </div>
          
          <!-- Vento -->
          <div class="detail-item">
            <span class="detail-icon">💨</span>
            <div class="detail-info">
              <span class="detail-label">Vento</span>
              <span class="detail-value">{{ day.windSpeed }} km/h</span>
            </div>
          </div>
          
          <!-- Umidade -->
          <div class="detail-item">
            <span class="detail-icon">💧</span>
            <div class="detail-info">
              <span class="detail-label">Umidade</span>
              <span class="detail-value">{{ day.humidity }}%</span>
            </div>
          </div>
          
          <!-- Sol -->
          <div class="detail-item">
            <span class="detail-icon">☀️</span>
            <div class="detail-info">
              <span class="detail-label">UV</span>
              <span class="detail-value">{{ getUVIndex(day) }}</span>
            </div>
          </div>
        </div>
        
        <!-- Previsão de Arco-íris -->
        <div v-if="hasRainbowChance(day)" class="rainbow-prediction">
          <span class="rainbow-icon">🌈</span>
          <span class="rainbow-text">Possível arco-íris!</span>
        </div>
        
        <!-- Recomendação para Corrida -->
        <div class="running-recommendation">
          <div 
            class="recommendation-badge"
            :class="getRecommendationClass(day)"
          >
            {{ getRunningRecommendation(day) }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Localização -->
    <div v-if="currentLocation" class="location-info">
      <span class="location-icon">📍</span>
      <span>{{ currentLocation }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { weatherService } from '@/services/weatherService'

const forecast = ref([])
const loading = ref(true)
const error = ref('')
const currentLocation = ref('')

const loadWeather = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Tentar obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await fetchWeatherData(latitude, longitude)
        },
        async () => {
          // Fallback para São Paulo se não conseguir localização
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
    const forecastData = await weatherService.getForecast(lat, lon, 5)
    const currentWeather = await weatherService.getCurrentWeather(lat, lon)
    
    forecast.value = forecastData
    currentLocation.value = currentWeather.city
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
      5
    )
    
    forecast.value = forecastData
    currentLocation.value = currentWeather.city
    loading.value = false
  } catch (err) {
    error.value = err.message
    loading.value = false
  }
}

const getDayName = (date, index) => {
  if (index === 0) return 'Hoje'
  if (index === 1) return 'Amanhã'
  
  return date.toLocaleDateString('pt-BR', { weekday: 'short' })
}

const formatDate = (date) => {
  return date.toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit' 
  })
}

const getWeatherIcon = (iconCode) => {
  return weatherService.getWeatherIcon(iconCode)
}

const getRainChance = (day) => {
  // Simula chance de chuva baseada na descrição
  const desc = day.description.toLowerCase()
  if (desc.includes('chuva') || desc.includes('chuvisco')) return Math.floor(Math.random() * 40) + 60
  if (desc.includes('nuvem')) return Math.floor(Math.random() * 30) + 20
  return Math.floor(Math.random() * 20)
}

const getUVIndex = (day) => {
  // Simula índice UV baseado na temperatura
  if (day.maxTemp > 25) return 'Alto'
  if (day.maxTemp > 20) return 'Médio'
  return 'Baixo'
}

const hasRainbowChance = (day) => {
  // Arco-íris: sol + chuva
  const rainChance = getRainChance(day)
  const hasSun = !day.description.toLowerCase().includes('nublado')
  return rainChance > 30 && rainChance < 80 && hasSun
}

const getRunningRecommendation = (day) => {
  const temp = (day.maxTemp + day.minTemp) / 2
  const humidity = day.humidity
  
  if (temp < 10) return '❄️ Muito Frio'
  if (temp > 30) return '🔥 Muito Quente'
  if (humidity > 80) return '💧 Muito Úmido'
  if (getRainChance(day) > 70) return '🌧️ Chuva'
  
  return '✅ Ideal'
}

const getRecommendationClass = (day) => {
  const recommendation = getRunningRecommendation(day)
  
  if (recommendation.includes('Ideal')) return 'good'
  if (recommendation.includes('Frio') || recommendation.includes('Quente') || recommendation.includes('Úmido')) return 'warning'
  if (recommendation.includes('Chuva')) return 'bad'
  
  return 'neutral'
}

onMounted(() => {
  loadWeather()
})
</script>

<style scoped>
.weather-cards {
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  border: 1px solid rgba(255,255,255,0.5);
}

.weather-title {
  margin: 0 0 1.5rem 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.weather-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.weather-card.today {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 2px solid rgba(102, 126, 234, 0.4);
  transform: scale(1.02);
}

.weather-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.day-info {
  display: flex;
  flex-direction: column;
}

.day-name {
  font-weight: 600;
  font-size: 16px;
  color: #333;
}

.day-date {
  font-size: 12px;
  color: #666;
}

.weather-icon {
  width: 50px;
  height: 50px;
}

.temperature-section {
  text-align: center;
  margin-bottom: 1rem;
}

.temp-main {
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.temp-max {
  font-size: 2rem;
  font-weight: 700;
  color: #333;
}

.temp-min {
  font-size: 1.2rem;
  color: #666;
}

.weather-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
  text-transform: capitalize;
}

.weather-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.5);
  padding: 0.5rem;
  border-radius: 8px;
}

.detail-icon {
  font-size: 16px;
}

.detail-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.detail-label {
  font-size: 11px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
}

.detail-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.rainbow-prediction {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

.running-recommendation {
  text-align: center;
}

.recommendation-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.recommendation-badge.good {
  background: rgba(16, 185, 129, 0.2);
  color: #059669;
}

.recommendation-badge.warning {
  background: rgba(245, 158, 11, 0.2);
  color: #d97706;
}

.recommendation-badge.bad {
  background: rgba(239, 68, 68, 0.2);
  color: #dc2626;
}

.recommendation-badge.neutral {
  background: rgba(107, 114, 128, 0.2);
  color: #4b5563;
}

.location-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(0,0,0,0.1);
  font-size: 14px;
  color: #666;
}

.location-icon {
  font-size: 16px;
}

@media (max-width: 768px) {
  .weather-grid {
    grid-template-columns: 1fr;
  }
  
  .weather-details {
    grid-template-columns: 1fr;
  }
}
</style>