import { db } from '@/firebase/config'
import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore'

export const notificacaoService = {
  async criarNotificacao(userId, tipo, mensagem, dadosExtras = {}) {
    const notifsRef = collection(db, 'notificacoes')
    await addDoc(notifsRef, {
      userId,
      tipo, // 'confirmacao', 'nova-corrida', 'geral'
      mensagem,
      lida: false,
      timestamp: serverTimestamp(),
      ...dadosExtras
    })
  },

  async marcarComoLida(notifId) {
    const notifRef = doc(db, 'notificacoes', notifId)
    await updateDoc(notifRef, { lida: true })
  },

  async removerNotificacao(notifId) {
    const notifRef = doc(db, 'notificacoes', notifId)
    await deleteDoc(notifRef)
  },

  onNotificacoesChange(userId, callback) {
    const notifsRef = collection(db, 'notificacoes')
    const q = query(
      notifsRef, 
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    )
    return onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(notifs)
    })
  }
}