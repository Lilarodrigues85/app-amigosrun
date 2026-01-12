import { db } from '@/firebase/config'
import { collection, addDoc, query, orderBy, limit, getDocs, onSnapshot, serverTimestamp } from 'firebase/firestore'

export const feedService = {
  async criarPost(userId, tipo, conteudo, corridaId = null) {
    const postsRef = collection(db, 'posts')
    await addDoc(postsRef, {
      userId,
      tipo, // 'confirmacao', 'foto', 'comentario'
      conteudo,
      corridaId,
      timestamp: serverTimestamp(),
      likes: 0
    })
  },

  async buscarPosts(limite = 10) {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, orderBy('timestamp', 'desc'), limit(limite))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  },

  onPostsChange(callback, limite = 10) {
    const postsRef = collection(db, 'posts')
    const q = query(postsRef, orderBy('timestamp', 'desc'), limit(limite))
    return onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      callback(posts)
    })
  }
}