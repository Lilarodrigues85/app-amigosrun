<template>
  <div class="weather-widget">
    <div v-if="loading" class="loading">
      Carregando clima...
    </div>
    
    <div v-else-if="weather" class="weather-content">
      <div class="current-weather">
        <div class="weather-main">
          <div class="temperature">{{ weather.temperature }}°C</div>
        </div>
        
        <div class="weather-info">
          <h3>{{ weather.city }}</h3>
          <p class="description">{{ weather.description }}</p>
          <div class="details">
            <span>Sensação: {{ weather.feelsLike }}°C</span>
            <span>Umidade: {{ weather.humidity }}%</span>
          </div>
        </div>
      </div>

      <div v-if="recommendation" class="running-recommendation">
        <div :class="['recommendation-status', { 'suitable': recommendation.suitable }]">
          <span class="status-icon">{{ recommendation.suitable ? '✅' : '⚠️' }}</span>
          <span class="status-text">{{ recommendation.message }}</span>
        </div>
      </div>
    </div>

    <div v-else class="location-request">
      <p>Para mostrar o clima:</p>
      <button @click="getCurrentLocation" class="location-btn">
        📍 Permitir localização
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { weatherService } from '@/services/weatherService'

const weather = ref(null)
const recommendation = ref(null)
const loading = ref(false)

const getCurrentLocation = () => {
  if (!navigator.geolocation) return

  loading.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords
        const weatherData = await weatherService.getCurrentWeather(latitude, longitude)
        weather.value = weatherData
        recommendation.value = weatherService.getRunningRecommendation(weatherData)
      } catch (err) {
        console.error('Erro ao carregar clima:', err)
      } finally {
        loading.value = false
      }
    },
    () => {
      loading.value = false
    }
  )
}

onMounted(() => {
  getCurrentLocation()
})
</script>

<style scoped>
.weather-widget {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 1.5rem;
  color: white;
}

.loading,
.location-request {
  text-align: center;
  padding: 1rem;
}

.current-weather {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.temperature {
  font-size: 2rem;
  font-weight: bold;
}

.weather-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
}

.description {
  margin: 0 0 0.5rem 0;
  text-transform: capitalize;
  color: rgba(255,255,255,0.9);
}

.details {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
}

.running-recommendation {
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 1rem;
}

.recommendation-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.suitable {
  color: #10b981;
}

.location-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.location-btn:hover {
  background: rgba(255,255,255,0.3);
}
</style>