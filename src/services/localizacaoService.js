export const localizacaoService = {
  async obterLocalizacaoAtual() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não suportada'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          })
        },
        (error) => {
          reject(new Error(`Erro de geolocalização: ${error.message}`))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutos
        }
      )
    })
  },

  async compartilharLocalizacao(userId, corridaId = null) {
    try {
      const posicao = await this.obterLocalizacaoAtual()
      
      // Salvar no Firebase
      const { db } = await import('@/firebase/config')
      const { collection, addDoc, serverTimestamp } = await import('firebase/firestore')
      
      const localizacoesRef = collection(db, 'localizacoes')
      await addDoc(localizacoesRef, {
        userId,
        corridaId,
        latitude: posicao.latitude,
        longitude: posicao.longitude,
        accuracy: posicao.accuracy,
        timestamp: serverTimestamp(),
        ativo: true
      })
      
      return posicao
    } catch (error) {
      throw new Error(`Erro ao compartilhar localização: ${error.message}`)
    }
  },

  async obterLocalizacoesProximas(latitude, longitude, raioKm = 5) {
    try {
      const { db } = await import('@/firebase/config')
      const { collection, query, where, getDocs, orderBy, limit } = await import('firebase/firestore')
      
      // Cálculo aproximado de graus por km (1 grau ≈ 111 km)
      const deltaGraus = raioKm / 111
      
      const localizacoesRef = collection(db, 'localizacoes')
      const q = query(
        localizacoesRef,
        where('ativo', '==', true),
        where('latitude', '>=', latitude - deltaGraus),
        where('latitude', '<=', latitude + deltaGraus),
        orderBy('timestamp', 'desc'),
        limit(50)
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Erro ao buscar localizações:', error)
      return []
    }
  },

  calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371 // Raio da Terra em km
    const dLat = this.toRad(lat2 - lat1)
    const dLon = this.toRad(lon2 - lon1)
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distância em km
  },

  toRad(graus) {
    return graus * (Math.PI / 180)
  }
}