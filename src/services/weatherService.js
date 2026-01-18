// Usando API gratuita do OpenWeatherMap
// Para produção, registre-se em: https://openweathermap.org/api
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const weatherService = {
  async getCurrentWeather(lat, lon) {
    try {
      // Se não tiver API key válida, retorna dados mock
      if (API_KEY === 'demo_key') {
        return this.getMockCurrentWeather()
      }

      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar dados do clima')
      }
      
      const data = await response.json()
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Converter m/s para km/h
        feelsLike: Math.round(data.main.feels_like),
        city: data.name,
        pressure: data.main.pressure,
        visibility: data.visibility / 1000 // Converter para km
      }
    } catch (error) {
      console.warn('Usando dados mock do clima:', error.message)
      return this.getMockCurrentWeather()
    }
  },

  async getForecast(lat, lon, days = 5) {
    try {
      // Se não tiver API key válida, retorna dados mock
      if (API_KEY === 'demo_key') {
        return this.getMockForecast(days)
      }

      const response = await fetch(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=pt_br`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar previsão do tempo')
      }
      
      const data = await response.json()
      
      // Agrupa previsões por dia
      const dailyForecasts = {}
      
      data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString()
        
        if (!dailyForecasts[date]) {
          dailyForecasts[date] = {
            date: new Date(item.dt * 1000),
            temperatures: [],
            descriptions: [],
            icons: [],
            humidity: [],
            windSpeed: [],
            rain: []
          }
        }
        
        dailyForecasts[date].temperatures.push(item.main.temp)
        dailyForecasts[date].descriptions.push(item.weather[0].description)
        dailyForecasts[date].icons.push(item.weather[0].icon)
        dailyForecasts[date].humidity.push(item.main.humidity)
        dailyForecasts[date].windSpeed.push(item.wind?.speed || 0)
        dailyForecasts[date].rain.push(item.rain?.['3h'] || 0)
      })
      
      // Processa dados diários
      return Object.values(dailyForecasts).slice(0, days).map(day => ({
        date: day.date,
        minTemp: Math.round(Math.min(...day.temperatures)),
        maxTemp: Math.round(Math.max(...day.temperatures)),
        description: day.descriptions[0],
        icon: day.icons[0],
        humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
        windSpeed: Math.round((day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length) * 3.6),
        rainAmount: day.rain.reduce((a, b) => a + b) / day.rain.length
      }))
    } catch (error) {
      console.warn('Usando dados mock da previsão:', error.message)
      return this.getMockForecast(days)
    }
  },

  async getWeatherByCity(cityName) {
    try {
      // Se não tiver API key válida, retorna dados mock
      if (API_KEY === 'demo_key') {
        return this.getMockCurrentWeather(cityName)
      }

      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(cityName)}&appid=${API_KEY}&units=metric&lang=pt_br`
      )
      
      if (!response.ok) {
        throw new Error('Cidade não encontrada')
      }
      
      const data = await response.json()
      
      return {
        temperature: Math.round(data.main.temp),
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        feelsLike: Math.round(data.main.feels_like),
        city: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      }
    } catch (error) {
      console.warn('Usando dados mock da cidade:', error.message)
      return this.getMockCurrentWeather(cityName)
    }
  },

  // Dados mock para desenvolvimento/demo
  getMockCurrentWeather(city = 'São Paulo') {
    const mockWeathers = [
      {
        temperature: 24,
        description: 'parcialmente nublado',
        icon: '02d',
        humidity: 65,
        windSpeed: 12,
        feelsLike: 26,
        city: city,
        coordinates: { lat: -23.5505, lon: -46.6333 }
      },
      {
        temperature: 28,
        description: 'ensolarado',
        icon: '01d',
        humidity: 45,
        windSpeed: 8,
        feelsLike: 30,
        city: city,
        coordinates: { lat: -23.5505, lon: -46.6333 }
      }
    ]
    
    return mockWeathers[Math.floor(Math.random() * mockWeathers.length)]
  },

  getMockForecast(days = 5) {
    const mockIcons = ['01d', '02d', '03d', '04d', '09d', '10d', '11d']
    const mockDescriptions = [
      'ensolarado', 'parcialmente nublado', 'nublado', 
      'chuva leve', 'chuva', 'tempestade', 'céu limpo'
    ]
    
    return Array.from({ length: days }, (_, index) => {
      const date = new Date()
      date.setDate(date.getDate() + index)
      
      const baseTemp = 22 + Math.random() * 10
      
      return {
        date,
        minTemp: Math.round(baseTemp - 3 - Math.random() * 3),
        maxTemp: Math.round(baseTemp + 3 + Math.random() * 3),
        description: mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)],
        icon: mockIcons[Math.floor(Math.random() * mockIcons.length)],
        humidity: Math.round(40 + Math.random() * 40),
        windSpeed: Math.round(5 + Math.random() * 15),
        rainAmount: Math.random() * 5
      }
    })
  },

  getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  },

  getRunningRecommendation(weather) {
    const temp = weather.temperature || (weather.maxTemp + weather.minTemp) / 2
    const humidity = weather.humidity
    const windSpeed = weather.windSpeed
    
    let recommendation = {
      suitable: true,
      message: '',
      tips: []
    }
    
    // Temperatura
    if (temp < 5) {
      recommendation.suitable = false
      recommendation.message = 'Muito frio para corrida'
      recommendation.tips.push('Use roupas térmicas', 'Faça aquecimento prolongado')
    } else if (temp < 15) {
      recommendation.message = 'Temperatura boa para corrida'
      recommendation.tips.push('Use roupas de manga longa', 'Aquecimento adequado')
    } else if (temp < 25) {
      recommendation.message = 'Temperatura ideal para corrida'
      recommendation.tips.push('Roupas leves são suficientes', 'Hidratação normal')
    } else if (temp < 30) {
      recommendation.message = 'Temperatura quente, cuidado com hidratação'
      recommendation.tips.push('Leve água', 'Evite horários de pico de calor', 'Use protetor solar')
    } else {
      recommendation.suitable = false
      recommendation.message = 'Muito quente para corrida'
      recommendation.tips.push('Evite correr neste horário', 'Prefira início da manhã ou final da tarde')
    }
    
    // Umidade
    if (humidity > 80) {
      recommendation.tips.push('Alta umidade - hidrate-se bem', 'Reduza o ritmo')
    }
    
    // Vento
    if (windSpeed > 20) {
      recommendation.tips.push('Vento forte - cuidado com a estabilidade')
    }
    
    return recommendation
  }
}