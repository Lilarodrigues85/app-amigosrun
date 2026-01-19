import { db } from '@/firebase/config'
import { collection, doc, setDoc, deleteDoc, query, where, getDocs, onSnapshot, getDoc } from 'firebase/firestore'
import { feedService } from '@/services/feedService'
import { notificacaoService } from '@/services/notificacaoService'

export const presencaService = {
  async setPresenca(corridaId, userId, status) {
    // status: 'sim', 'nao', 'talvez'
    const presencaRef = doc(db, 'presencas', `${corridaId}_${userId}`)
    await setDoc(presencaRef, {
      corridaId,
      userId,
      status,
      dataAtualizacao: new Date()
    })
    
    // Criar post no feed apenas se for confirmação
    if (status === 'sim') {
      await feedService.criarPost(userId, 'confirmacao', 'confirmou presença em uma corrida', corridaId)
      
      // Criar notificação para outros usuários interessados
      await notificacaoService.criarNotificacao(
        userId, 
        'confirmacao', 
        'Alguém confirmou presença na corrida que você tem interesse'
      )
    }
  },

  async confirmarPresenca(corridaId, userId) {
    return this.setPresenca(corridaId, userId, 'sim')
  },

  async cancelarPresenca(corridaId, userId) {
    const presencaRef = doc(db, 'presencas', `${corridaId}_${userId}`)
    await deleteDoc(presencaRef)
  },

  async getPresencaStatus(corridaId, userId) {
    const presencaRef = doc(db, 'presencas', `${corridaId}_${userId}`)
    const snapshot = await getDoc(presencaRef)
    
    if (snapshot.exists()) {
      return snapshot.data().status || null
    }
    return null
  },

  async verificarPresenca(corridaId, userId) {
    const status = await this.getPresencaStatus(corridaId, userId)
    return status === 'sim'
  },

  async contarPresencas(corridaId) {
    const presencasRef = collection(db, 'presencas')
    const q = query(presencasRef, where('corridaId', '==', corridaId))
    const snapshot = await getDocs(q)
    return snapshot.size
  },

  async contarPresencasPorStatus(corridaId) {
    const presencasRef = collection(db, 'presencas')
    const q = query(presencasRef, where('corridaId', '==', corridaId))
    const snapshot = await getDocs(q)
    
    const contadores = { sim: 0, nao: 0, talvez: 0 }
    snapshot.forEach(doc => {
      const data = doc.data()
      if (data.status && contadores.hasOwnProperty(data.status)) {
        contadores[data.status]++
      }
    })
    
    return contadores
  },

  onPresencasChange(corridaId, callback) {
    const presencasRef = collection(db, 'presencas')
    const q = query(presencasRef, where('corridaId', '==', corridaId))
    return onSnapshot(q, callback)
  }
}