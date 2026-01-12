import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const corridaService = {
  async createCorrida(corridaData) {
    try {
      const docRef = await addDoc(collection(db, 'corridas'), {
        ...corridaData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        participantes: []
      })
      return docRef.id
    } catch (error) {
      throw new Error('Erro ao criar corrida: ' + error.message)
    }
  },

  async getCorridas() {
    try {
      const q = query(
        collection(db, 'corridas'),
        orderBy('data', 'asc')
      )
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      throw new Error('Erro ao buscar corridas: ' + error.message)
    }
  },

  async getCorridasDoMes(ano, mes) {
    try {
      const inicioMes = new Date(ano, mes - 1, 1).toISOString()
      const fimMes = new Date(ano, mes, 0, 23, 59, 59).toISOString()
      
      const q = query(
        collection(db, 'corridas'),
        where('data', '>=', inicioMes),
        where('data', '<=', fimMes),
        orderBy('data', 'asc')
      )
      
      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      throw new Error('Erro ao buscar corridas do mês: ' + error.message)
    }
  },

  async getCorrida(corridaId) {
    try {
      const docRef = doc(db, 'corridas', corridaId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      }
      return null
    } catch (error) {
      throw new Error('Erro ao buscar corrida: ' + error.message)
    }
  },

  async updateCorrida(corridaId, corridaData) {
    try {
      const docRef = doc(db, 'corridas', corridaId)
      await updateDoc(docRef, {
        ...corridaData,
        updatedAt: new Date().toISOString()
      })
      return true
    } catch (error) {
      throw new Error('Erro ao atualizar corrida: ' + error.message)
    }
  },

  async deleteCorrida(corridaId) {
    try {
      await deleteDoc(doc(db, 'corridas', corridaId))
      return true
    } catch (error) {
      throw new Error('Erro ao deletar corrida: ' + error.message)
    }
  }
}