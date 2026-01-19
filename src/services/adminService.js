import { db } from '@/firebase/config'
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore'

export const adminService = {
  /**
   * Verifica se um email é de administrador
   */
  async isAdmin(email) {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', email))
      return adminDoc.exists()
    } catch (error) {
      console.error('Erro ao verificar admin:', error)
      return false
    }
  },

  /**
   * Lista usuários pendentes de aprovação
   */
  async getPendingUsers() {
    try {
      const usersRef = collection(db, 'users')
      const q = query(
        usersRef, 
        where('status', '==', 'pending'),
        orderBy('requestedAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Erro ao buscar usuários pendentes:', error)
      throw new Error('Erro ao buscar usuários pendentes')
    }
  },

  /**
   * Lista todos os usuários com filtro opcional
   */
  async getAllUsers(filter = 'all') {
    try {
      const usersRef = collection(db, 'users')
      let q
      
      if (filter === 'all') {
        q = query(usersRef, orderBy('createdAt', 'desc'))
      } else {
        q = query(
          usersRef, 
          where('status', '==', filter),
          orderBy('createdAt', 'desc')
        )
      }
      
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      throw new Error('Erro ao buscar usuários')
    }
  },

  /**
   * Aprova um usuário
   */
  async approveUser(userId, adminEmail) {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        status: 'approved',
        approvedAt: Timestamp.now(),
        approvedBy: adminEmail
      })
      
      return true
    } catch (error) {
      console.error('Erro ao aprovar usuário:', error)
      throw new Error('Erro ao aprovar usuário')
    }
  },

  /**
   * Rejeita um usuário
   */
  async rejectUser(userId, adminEmail, reason = '') {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        status: 'rejected',
        rejectedAt: Timestamp.now(),
        rejectedBy: adminEmail,
        rejectionReason: reason
      })
      
      return true
    } catch (error) {
      console.error('Erro ao rejeitar usuário:', error)
      throw new Error('Erro ao rejeitar usuário')
    }
  },

  /**
   * Obtém estatísticas de usuários
   */
  async getUserStats() {
    try {
      const usersRef = collection(db, 'users')
      const snapshot = await getDocs(usersRef)
      
      const stats = {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0
      }
      
      snapshot.docs.forEach(doc => {
        const data = doc.data()
        stats.total++
        
        if (data.status === 'pending') stats.pending++
        else if (data.status === 'approved') stats.approved++
        else if (data.status === 'rejected') stats.rejected++
      })
      
      return stats
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw new Error('Erro ao buscar estatísticas')
    }
  }
}
