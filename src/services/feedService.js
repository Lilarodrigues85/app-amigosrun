import { db } from '@/firebase/config'
import { 
  collection, 
  doc,
  setDoc,
  getDoc,
  addDoc, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  onSnapshot, 
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  updateDoc
} from 'firebase/firestore'
import { cloudinaryService } from './cloudinaryService'

export const feedService = {
  async criarPost(userId, tipo, conteudo, options = {}) {
    try {
      const userPostsRef = doc(db, 'posts', userId)
      
      const novoPost = {
        id: Date.now().toString(),
        tipo,
        conteudo,
        timestamp: new Date().toISOString(),
        likes: 0
      }
      
      if (options.corridaId) {
        novoPost.corridaId = options.corridaId
      }
      
      if (options.imageUrl) {
        novoPost.imageUrl = options.imageUrl
      }
      
      if (options.location) {
        novoPost.location = options.location
      }
      
      const docSnap = await getDoc(userPostsRef)
      
      if (docSnap.exists()) {
        await updateDoc(userPostsRef, {
          posts: arrayUnion(novoPost),
          updatedAt: new Date().toISOString()
        })
      } else {
        await setDoc(userPostsRef, {
          userId,
          posts: [novoPost],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      }
      
      return novoPost.id
    } catch (error) {
      console.error('❌ [feedService] Erro ao criar post:', error.message)
      throw new Error('Erro ao criar post: ' + error.message)
    }
  },

  async editarPost(userId, postId, novoConteudo) {
    try {
      const userPostsRef = doc(db, 'posts', userId)
      const docSnap = await getDoc(userPostsRef)
      
      if (!docSnap.exists()) {
        throw new Error('Documento do usuário não encontrado')
      }
      
      const data = docSnap.data()
      const posts = data.posts || []
      const postIndex = posts.findIndex(p => p.id === postId)
      
      if (postIndex === -1) {
        throw new Error('Post não encontrado')
      }
      
      const postAtualizado = {
        ...posts[postIndex],
        conteudo: novoConteudo,
        editado: true,
        editadoEm: new Date().toISOString()
      }
      
      const postAntigo = posts[postIndex]
      
      await updateDoc(userPostsRef, {
        posts: arrayRemove(postAntigo)
      })
      
      await updateDoc(userPostsRef, {
        posts: arrayUnion(postAtualizado),
        updatedAt: new Date().toISOString()
      })
      
      return postAtualizado
    } catch (error) {
      console.error('❌ [feedService] Erro ao editar post:', error.message)
      throw new Error('Erro ao editar post: ' + error.message)
    }
  },

  async excluirPost(userId, postId) {
    try {
      const userPostsRef = doc(db, 'posts', userId)
      const docSnap = await getDoc(userPostsRef)
      
      if (!docSnap.exists()) {
        throw new Error('Documento do usuário não encontrado')
      }
      
      const data = docSnap.data()
      const posts = data.posts || []
      const postParaExcluir = posts.find(p => p.id === postId)
      
      if (!postParaExcluir) {
        throw new Error('Post não encontrado')
      }
      
      // Se o post tem imagem, tentar deletar do Cloudinary
      if (postParaExcluir.imageUrl) {
        try {
          await cloudinaryService.deleteImage(postParaExcluir.imageUrl)
        } catch (error) {
          console.warn('⚠️ [feedService] Não foi possível deletar imagem:', error.message)
        }
      }
      
      await updateDoc(userPostsRef, {
        posts: arrayRemove(postParaExcluir),
        updatedAt: new Date().toISOString()
      })
      
      return true
    } catch (error) {
      console.error('❌ [feedService] Erro ao excluir post:', error.message)
      throw new Error('Erro ao excluir post: ' + error.message)
    }
  },

  async buscarPosts(limite = 50) {
    try {
      const postsRef = collection(db, 'posts')
      const snapshot = await getDocs(postsRef)
      
      const todosPosts = []
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        if (data.posts && Array.isArray(data.posts)) {
          data.posts.forEach(post => {
            todosPosts.push({
              ...post,
              userId: data.userId,
              docId: doc.id
            })
          })
        }
      })
      
      todosPosts.sort((a, b) => {
        const dateA = new Date(a.timestamp)
        const dateB = new Date(b.timestamp)
        return dateB - dateA
      })
      
      return todosPosts.slice(0, limite)
    } catch (error) {
      console.error('❌ [feedService] Erro ao buscar posts:', error.message)
      throw new Error('Erro ao buscar posts: ' + error.message)
    }
  },

  onPostsChange(callback, limite = 50) {
    try {
      const postsRef = collection(db, 'posts')
      
      return onSnapshot(postsRef, (snapshot) => {
        const todosPosts = []
        snapshot.docs.forEach(doc => {
          const data = doc.data()
          
          if (data.posts && Array.isArray(data.posts)) {
            data.posts.forEach(post => {
              todosPosts.push({
                ...post,
                userId: data.userId,
                docId: doc.id
              })
            })
          }
        })
        
        todosPosts.sort((a, b) => {
          const dateA = new Date(a.timestamp)
          const dateB = new Date(b.timestamp)
          return dateB - dateA
        })
        
        callback(todosPosts.slice(0, limite))
      }, (error) => {
        console.error('❌ [feedService] Erro no listener:', error.message)
      })
    } catch (error) {
      console.error('❌ [feedService] Erro ao criar listener:', error.message)
      throw new Error('Erro ao criar listener: ' + error.message)
    }
  }
}