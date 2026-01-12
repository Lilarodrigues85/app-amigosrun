import { db } from '@/firebase/config'
import { collection, doc, setDoc, deleteDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore'
import { feedService } from '@/services/feedService'
import { notificacaoService } from '@/services/notificacaoService'

export const presencaService = {
  async confirmarPresenca(corridaId, userId) {
    const presencaRef = doc(db, 'presencas', `${corridaId}_${userId}`)
    await setDoc(presencaRef, {
      corridaId,
      userId,
      status: 'confirmado',
      dataConfirmacao: new Date()
    })
    
    // Criar post no feed
    await feedService.criarPost(userId, 'confirmacao', 'confirmou presença em uma corrida', corridaId)
    
    // Criar notificação para outros usuários interessados
    await notificacaoService.criarNotificacao(
      userId, 
      'confirmacao', 
      'Alguém confirmou presença na corrida que você tem interesse'
    )
  },

  async cancelarPresenca(corridaId, userId) {
    const presencaRef = doc(db, 'presencas', `${corridaId}_${userId}`)
    await deleteDoc(presencaRef)
  },

  async verificarPresenca(corridaId, userId) {
    const presencasRef = collection(db, 'presencas')
    const q = query(presencasRef, where('corridaId', '==', corridaId), where('userId', '==', userId))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  },

  async contarPresencas(corridaId) {
    const presencasRef = collection(db, 'presencas')
    const q = query(presencasRef, where('corridaId', '==', corridaId))
    const snapshot = await getDocs(q)
    return snapshot.size
  },

  onPresencasChange(corridaId, callback) {
    const presencasRef = collection(db, 'presencas')
    const q = query(presencasRef, where('corridaId', '==', corridaId))
    return onSnapshot(q, callback)
  }
}