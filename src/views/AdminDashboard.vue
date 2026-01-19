<template>
  <div class="admin-dashboard">
    <div class="admin-header">
      <div class="header-left">
        <button @click="handleBack" class="back-button">
          <span class="back-icon">←</span>
        </button>
        <div class="header-title">
          <h1>Gerenciamento de Usuários</h1>
          <p class="header-subtitle">Painel de Administração</p>
        </div>
      </div>
      <div class="admin-badge">
        <span class="badge-icon">👑</span>
        <span class="badge-text">Admin</span>
      </div>
    </div>

    <div class="stats-container">
      <div class="stat-card pending-card">
        <div class="stat-icon-wrapper pending">
          <span class="stat-icon">⏳</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.pending }}</div>
          <div class="stat-label">Pendentes</div>
          <div class="stat-badge">Aguardando</div>
        </div>
      </div>
      
      <div class="stat-card approved-card">
        <div class="stat-icon-wrapper approved">
          <span class="stat-icon">✅</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.approved }}</div>
          <div class="stat-label">Aprovados</div>
          <div class="stat-badge success">Ativos</div>
        </div>
      </div>
      
      <div class="stat-card rejected-card">
        <div class="stat-icon-wrapper rejected">
          <span class="stat-icon">❌</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.rejected }}</div>
          <div class="stat-label">Rejeitados</div>
          <div class="stat-badge danger">Negados</div>
        </div>
      </div>
      
      <div class="stat-card total-card">
        <div class="stat-icon-wrapper total">
          <span class="stat-icon">👥</span>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.total }}</div>
          <div class="stat-label">Total de Usuários</div>
          <div class="stat-badge info">Geral</div>
        </div>
      </div>
    </div>

    <div class="filters-section">
      <h3 class="filters-title">Filtrar Usuários</h3>
      <div class="filters">
        <button 
          v-for="filter in filters" 
          :key="filter.value"
          @click="currentFilter = filter.value"
          :class="['filter-button', { active: currentFilter === filter.value }]"
        >
          <span class="filter-icon">{{ filter.icon }}</span>
          <span class="filter-label">{{ filter.label }}</span>
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Carregando usuários...</p>
    </div>

    <div v-else class="users-list">
      <div v-if="filteredUsers.length === 0" class="empty-state">
        <p>📭 Nenhum usuário encontrado</p>
      </div>
      
      <div v-else class="user-cards">
        <div v-for="user in filteredUsers" :key="user.id" class="user-card">
          <div class="user-header">
            <div class="user-avatar">
              {{ getInitials(user.name) }}
            </div>
            <div class="user-info">
              <h3>{{ user.name }}</h3>
              <p class="user-email">{{ user.email }}</p>
            </div>
            <div :class="['status-badge', user.status]">
              {{ getStatusLabel(user.status) }}
            </div>
          </div>
          
          <div class="user-details">
            <div class="detail-item">
              <span class="detail-label">Solicitado:</span>
              <span class="detail-value">{{ formatDate(user.requestedAt) }}</span>
            </div>
            
            <div v-if="user.approvedAt" class="detail-item">
              <span class="detail-label">Aprovado:</span>
              <span class="detail-value">{{ formatDate(user.approvedAt) }}</span>
            </div>
            
            <div v-if="user.rejectedAt" class="detail-item">
              <span class="detail-label">Rejeitado:</span>
              <span class="detail-value">{{ formatDate(user.rejectedAt) }}</span>
            </div>
          </div>
          
          <div v-if="user.status === 'pending'" class="user-actions">
            <button 
              @click="handleApprove(user)" 
              class="action-button approve"
              :disabled="processing"
            >
              ✅ Aprovar
            </button>
            <button 
              @click="handleReject(user)" 
              class="action-button reject"
              :disabled="processing"
            >
              ❌ Rejeitar
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showRejectModal" class="modal-overlay" @click="closeRejectModal">
      <div class="modal-content" @click.stop>
        <h2>Rejeitar Cadastro</h2>
        <p>Usuário: <strong>{{ selectedUser?.name }}</strong></p>
        
        <div class="form-group">
          <label>Motivo da rejeição (opcional):</label>
          <textarea 
            v-model="rejectionReason" 
            placeholder="Explique o motivo da rejeição..."
            rows="4"
          ></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="closeRejectModal" class="modal-button cancel">
            Cancelar
          </button>
          <button @click="confirmReject" class="modal-button confirm" :disabled="processing">
            {{ processing ? 'Rejeitando...' : 'Confirmar Rejeição' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/adminService'
import { auth } from '@/firebase/config'

const router = useRouter()
const loading = ref(true)
const processing = ref(false)
const users = ref([])
const stats = ref({
  total: 0,
  pending: 0,
  approved: 0,
  rejected: 0
})

const currentFilter = ref('pending')
const filters = [
  { label: 'Todos', value: 'all', icon: '📊' },
  { label: 'Pendentes', value: 'pending', icon: '⏳' },
  { label: 'Aprovados', value: 'approved', icon: '✅' },
  { label: 'Rejeitados', value: 'rejected', icon: '❌' }
]

const showRejectModal = ref(false)
const selectedUser = ref(null)
const rejectionReason = ref('')

const filteredUsers = computed(() => {
  if (currentFilter.value === 'all') {
    return users.value
  }
  return users.value.filter(user => user.status === currentFilter.value)
})

onMounted(async () => {
  await checkAdminAccess()
  await loadData()
})

const checkAdminAccess = async () => {
  const user = auth.currentUser
  if (!user) {
    router.push('/login')
    return
  }
  
  const isAdmin = await adminService.isAdmin(user.email)
  if (!isAdmin) {
    router.push('/')
  }
}

const loadData = async () => {
  loading.value = true
  try {
    const [usersData, statsData] = await Promise.all([
      adminService.getAllUsers('all'),
      adminService.getUserStats()
    ])
    
    users.value = usersData
    stats.value = statsData
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

const handleApprove = async (user) => {
  if (!confirm(`Aprovar o cadastro de ${user.name}?`)) return
  
  processing.value = true
  try {
    await adminService.approveUser(user.id, auth.currentUser.email)
    await loadData()
  } catch (error) {
    alert('Erro ao aprovar usuário')
  } finally {
    processing.value = false
  }
}

const handleReject = (user) => {
  selectedUser.value = user
  rejectionReason.value = ''
  showRejectModal.value = true
}

const closeRejectModal = () => {
  showRejectModal.value = false
  selectedUser.value = null
  rejectionReason.value = ''
}

const confirmReject = async () => {
  processing.value = true
  try {
    await adminService.rejectUser(
      selectedUser.value.id, 
      auth.currentUser.email,
      rejectionReason.value
    )
    await loadData()
    closeRejectModal()
  } catch (error) {
    alert('Erro ao rejeitar usuário')
  } finally {
    processing.value = false
  }
}

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const getStatusLabel = (status) => {
  const labels = {
    pending: '⏳ Pendente',
    approved: '✅ Aprovado',
    rejected: '❌ Rejeitado'
  }
  return labels[status] || status
}

const formatDate = (timestamp) => {
  if (!timestamp) return '-'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleBack = () => {
  router.push('/')
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
}

.admin-header {
  background: white;
  border-radius: 16px;
  padding: 1.5rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.back-button {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #e5e7eb;
  transform: translateX(-4px);
}

.back-icon {
  font-size: 1.5rem;
  color: #374151;
}

.header-title h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #111827;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.admin-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.3);
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-text {
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
  letter-spacing: 0.5px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.stat-icon-wrapper.pending {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.stat-icon-wrapper.approved {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.stat-icon-wrapper.rejected {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.stat-icon-wrapper.total {
  background: linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%);
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.stat-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
}

.stat-badge.success {
  background: #d1fae5;
  color: #065f46;
}

.stat-badge.danger {
  background: #fee2e2;
  color: #991b1b;
}

.stat-badge.info {
  background: #dbeafe;
  color: #1e40af;
}

.filters-section {
  background: white;
  border-radius: 16px;
  padding: 1.75rem 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
}

.filters-title {
  margin: 0 0 1.25rem 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #111827;
}

.filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-button {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  color: #374151;
  transition: all 0.3s ease;
}

.filter-button:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  transform: translateY(-2px);
}

.filter-button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.filter-icon {
  font-size: 1.125rem;
}

.filter-label {
  font-size: 0.9375rem;
}

.loading {
  background: white;
  border-radius: 16px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
}

.loading p {
  color: #6b7280;
  font-size: 1rem;
  font-weight: 500;
}

.spinner {
  width: 56px;
  height: 56px;
  border: 4px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.users-list {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e5e7eb;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state p {
  color: #9ca3af;
  font-size: 1.125rem;
  margin: 0;
}

.user-cards {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.user-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.user-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.user-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.125rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
}

.user-info {
  flex: 1;
}

.user-info h3 {
  margin: 0;
  color: #111827;
  font-size: 1.0625rem;
  font-weight: 600;
}

.user-email {
  margin: 0.25rem 0 0 0;
  color: #6b7280;
  font-size: 0.875rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 600;
}

.status-badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.status-badge.approved {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}

.user-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  color: #9ca3af;
  font-size: 0.8125rem;
  font-weight: 500;
}

.detail-value {
  color: #374151;
  font-weight: 600;
  font-size: 0.9375rem;
}

.user-actions {
  display: flex;
  gap: 0.75rem;
}

.action-button {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.action-button.approve {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}

.action-button.approve:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
}

.action-button.reject {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.25);
}

.action-button.reject:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 540px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  animation: modalSlideUp 0.3s ease;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h2 {
  margin: 0 0 0.5rem 0;
  color: #111827;
  font-size: 1.5rem;
  font-weight: 700;
}

.modal-content p {
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.9375rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.625rem;
  color: #374151;
  font-weight: 600;
  font-size: 0.875rem;
}

.form-group textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-family: inherit;
  font-size: 0.9375rem;
  color: #111827;
  resize: vertical;
  transition: all 0.3s ease;
}

.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.modal-button {
  flex: 1;
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-button.cancel {
  background: #f3f4f6;
  color: #374151;
}

.modal-button.cancel:hover {
  background: #e5e7eb;
}

.modal-button.confirm {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.modal-button.confirm:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
}

.modal-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 1rem;
  }
  
  .admin-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    padding: 1.25rem 1.5rem;
  }
  
  .header-title h1 {
    font-size: 1.5rem;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .filters {
    flex-direction: column;
  }
  
  .filter-button {
    width: 100%;
    justify-content: center;
  }
  
  .user-header {
    flex-wrap: wrap;
  }
  
  .user-actions {
    flex-direction: column;
  }
}
</style>
