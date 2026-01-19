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
      // Garante que campos numéricos sejam tratados corretamente
      const dataToCreate = {
        ...corridaData,
        valor: corridaData.valor ? parseFloat(corridaData.valor) : null,
        valor60: corridaData.valor60 ? parseFloat(corridaData.valor60) : null,
        vagas: corridaData.vagas ? parseInt(corridaData.vagas) : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        participantes: []
      }
      
      console.log('📝 Criando corrida com dados:', dataToCreate)
      
      const docRef = await addDoc(collection(db, 'corridas'), dataToCreate)
      return docRef.id
    } catch (error) {
      console.error('❌ Erro detalhado ao criar:', error)
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
      
      // Garante que campos numéricos sejam tratados corretamente
      const dataToUpdate = {
        ...corridaData,
        valor: corridaData.valor ? parseFloat(corridaData.valor) : null,
        valor60: corridaData.valor60 ? parseFloat(corridaData.valor60) : null,
        vagas: corridaData.vagas ? parseInt(corridaData.vagas) : null,
        updatedAt: new Date().toISOString()
      }
      
      console.log('📝 Atualizando corrida com dados:', dataToUpdate)
      
      await updateDoc(docRef, dataToUpdate)
      return true
    } catch (error) {
      console.error('❌ Erro detalhado ao atualizar:', error)
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