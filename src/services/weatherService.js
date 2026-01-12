const API_KEY = '4f8c0e7b2a1d3e9f5c6b8a2d4e7f9c1b' // Substitua pela sua chave da OpenWeatherMap
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

export const weatherService = {
  async getCurrentWeather(lat, lon) {
    try {
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
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        city: data.name
      }
    } catch (error) {
      throw new Error('Erro ao obter dados do clima: ' + error.message)
    }
  },

  async getForecast(lat, lon, days = 5) {
    try {
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
            windSpeed: []
          }
        }
        
        dailyForecasts[date].temperatures.push(item.main.temp)
        dailyForecasts[date].descriptions.push(item.weather[0].description)
        dailyForecasts[date].icons.push(item.weather[0].icon)
        dailyForecasts[date].humidity.push(item.main.humidity)
        dailyForecasts[date].windSpeed.push(item.wind.speed)
      })
      
      // Processa dados diários
      return Object.values(dailyForecasts).slice(0, days).map(day => ({
        date: day.date,
        minTemp: Math.round(Math.min(...day.temperatures)),
        maxTemp: Math.round(Math.max(...day.temperatures)),
        description: day.descriptions[0], // Primeira previsão do dia
        icon: day.icons[0],
        humidity: Math.round(day.humidity.reduce((a, b) => a + b) / day.humidity.length),
        windSpeed: Math.round(day.windSpeed.reduce((a, b) => a + b) / day.windSpeed.length)
      }))
    } catch (error) {
      throw new Error('Erro ao obter previsão: ' + error.message)
    }
  },

  async getWeatherByCity(cityName) {
    try {
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
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like),
        city: data.name,
        country: data.sys.country,
        coordinates: {
          lat: data.coord.lat,
          lon: data.coord.lon
        }
      }
    } catch (error) {
      throw new Error('Erro ao buscar clima da cidade: ' + error.message)
    }
  },

  getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  },

  getRunningRecommendation(weather) {
    const temp = weather.temperature
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
      recommendation.tips.push('Use roupas térmicas')
    } else if (temp < 15) {
      recommendation.message = 'Temperatura boa para corrida'
      recommendation.tips.push('Use roupas de manga longa')
    } else if (temp < 25) {
      recommendation.message = 'Temperatura ideal para corrida'
      recommendation.tips.push('Roupas leves são suficientes')
    } else if (temp < 30) {
      recommendation.message = 'Temperatura quente, cuidado com hidratação'
      recommendation.tips.push('Leve água', 'Evite horários de pico de calor')
    } else {
      recommendation.suitable = false
      recommendation.message = 'Muito quente para corrida'
      recommendation.tips.push('Evite correr neste horário', 'Prefira início da manhã ou final da tarde')
    }
    
    // Umidade
    if (humidity > 80) {
      recommendation.tips.push('Alta umidade - hidrate-se bem')
    }
    
    // Vento
    if (windSpeed > 20) {
      recommendation.tips.push('Vento forte - cuidado com a estabilidade')
    }
    
    return recommendation
  }
}