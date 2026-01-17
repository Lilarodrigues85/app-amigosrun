<template>
  <div class="calendario-container">
    <div class="calendario-header">
      <button @click="mesAnterior" class="nav-btn">‹</button>
      <h2>{{ nomeDoMes }} {{ ano }}</h2>
      <button @click="proximoMes" class="nav-btn">›</button>
    </div>

    <div class="calendario-grid">
      <div class="dia-semana" v-for="dia in diasSemana" :key="dia">
        {{ dia }}
      </div>
      
      <div 
        v-for="dia in diasDoMes" 
        :key="dia.data"
        :class="['dia', { 
          'outro-mes': dia.outroMes,
          'hoje': dia.hoje,
          'tem-corrida': dia.corridas.length > 0
        }]"
        @click="selecionarDia(dia)"
      >
        <span class="numero-dia">{{ dia.numero }}</span>
        <div v-if="dia.corridas.length > 0" class="indicador-corridas">
          <div 
            v-for="corrida in dia.corridas.slice(0, 2)" 
            :key="corrida.id"
            class="mini-corrida"
            :title="corrida.titulo"
          >
            {{ corrida.titulo.substring(0, 15) }}{{ corrida.titulo.length > 15 ? '...' : '' }}
          </div>
          <div v-if="dia.corridas.length > 2" class="mais-corridas">
            +{{ dia.corridas.length - 2 }} mais
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalhes do dia -->
    <div v-if="diaSelecionado" class="modal-overlay" @click="fecharModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ formatarDataCompleta(diaSelecionado.data) }}</h3>
          <button @click="fecharModal" class="btn-fechar">×</button>
        </div>
        
        <div class="modal-body">
          <div v-if="diaSelecionado.corridas.length === 0" class="sem-corridas">
            Nenhuma corrida neste dia
          </div>
          
          <div v-else class="corridas-do-dia">
            <div 
              v-for="corrida in diaSelecionado.corridas" 
              :key="corrida.id"
              class="corrida-item"
            >
              <div class="corrida-info">
                <h4>{{ corrida.titulo }}</h4>
                <p class="corrida-local">📍 {{ corrida.local }}</p>
                <p class="corrida-hora">🕐 {{ formatarHora(corrida.data) }}</p>
                <p v-if="corrida.distancia" class="corrida-distancia">
                  🏃 {{ corrida.distancia }}
                </p>
              </div>
              
              <div class="corrida-acoes">
                <button 
                  v-if="corrida.linkInscricao"
                  @click="abrirLink(corrida.linkInscricao)"
                  class="btn-inscricao"
                >
                  Inscrever-se
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { corridaService } from '@/services/corridaService'

const { isInitialized } = useAuth()

const mesAtual = ref(new Date().getMonth())
const anoAtual = ref(new Date().getFullYear())
const corridas = ref([])
const diaSelecionado = ref(null)

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

const nomeDoMes = computed(() => {
  const nomes = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]
  return nomes[mesAtual.value]
})

const ano = computed(() => anoAtual.value)

const diasDoMes = computed(() => {
  const dias = []
  const primeiroDia = new Date(anoAtual.value, mesAtual.value, 1)
  const ultimoDia = new Date(anoAtual.value, mesAtual.value + 1, 0)
  const hoje = new Date()
  
  // Dias do mês anterior para completar a primeira semana
  const diasAnterior = primeiroDia.getDay()
  for (let i = diasAnterior - 1; i >= 0; i--) {
    const data = new Date(anoAtual.value, mesAtual.value, -i)
    dias.push({
      numero: data.getDate(),
      data: data.toISOString().split('T')[0],
      outroMes: true,
      hoje: false,
      corridas: getCorridasDoDia(data)
    })
  }
  
  // Dias do mês atual
  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const data = new Date(anoAtual.value, mesAtual.value, dia)
    const ehHoje = data.toDateString() === hoje.toDateString()
    
    dias.push({
      numero: dia,
      data: data.toISOString().split('T')[0],
      outroMes: false,
      hoje: ehHoje,
      corridas: getCorridasDoDia(data)
    })
  }
  
  // Dias do próximo mês para completar a última semana
  const diasRestantes = 42 - dias.length // 6 semanas × 7 dias
  for (let dia = 1; dia <= diasRestantes; dia++) {
    const data = new Date(anoAtual.value, mesAtual.value + 1, dia)
    dias.push({
      numero: dia,
      data: data.toISOString().split('T')[0],
      outroMes: true,
      hoje: false,
      corridas: getCorridasDoDia(data)
    })
  }
  
  return dias
})

const getCorridasDoDia = (data) => {
  const dataStr = data.toISOString().split('T')[0]
  return corridas.value.filter(corrida => {
    const corridaData = new Date(corrida.data).toISOString().split('T')[0]
    return corridaData === dataStr
  })
}

const carregarCorridas = async () => {
  // Only load if Firebase is initialized
  if (!isInitialized.value) {
    console.log('Firebase not initialized yet, waiting...')
    return
  }

  try {
    console.log('Loading corridas for calendar...')
    corridas.value = await corridaService.getCorridasDoMes(anoAtual.value, mesAtual.value + 1)
  } catch (error) {
    console.error('Erro ao carregar corridas:', error)
  }
}

const mesAnterior = () => {
  if (mesAtual.value === 0) {
    mesAtual.value = 11
    anoAtual.value--
  } else {
    mesAtual.value--
  }
}

const proximoMes = () => {
  if (mesAtual.value === 11) {
    mesAtual.value = 0
    anoAtual.value++
  } else {
    mesAtual.value++
  }
}

const selecionarDia = (dia) => {
  if (dia.corridas.length > 0 || !dia.outroMes) {
    diaSelecionado.value = dia
  }
}

const fecharModal = () => {
  diaSelecionado.value = null
}

const formatarDataCompleta = (dataStr) => {
  const data = new Date(dataStr + 'T00:00:00')
  return data.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatarHora = (dataStr) => {
  const data = new Date(dataStr)
  return data.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const abrirLink = (url) => {
  window.open(url, '_blank')
}

watch([mesAtual, anoAtual], () => {
  if (isInitialized.value) {
    carregarCorridas()
  }
})

// Watch for Firebase initialization
watch(isInitialized, (initialized) => {
  if (initialized) {
    console.log('Firebase initialized, loading calendar corridas')
    carregarCorridas()
  }
}, { immediate: true })

onMounted(() => {
  // Only load if already initialized
  if (isInitialized.value) {
    carregarCorridas()
  }
})
</script>

<style scoped>
.calendario-container {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
  padding: 2rem;
  margin: 2rem auto;
  max-width: 800px;
}

.calendario-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.calendario-header h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.nav-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: rgba(255,255,255,0.3);
}

.calendario-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  overflow: hidden;
}

.dia-semana {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
}

.dia {
  background: rgba(255,255,255,0.05);
  min-height: 100px;
  padding: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.dia:hover {
  background: rgba(255,255,255,0.1);
}

.dia.outro-mes {
  opacity: 0.3;
}

.dia.hoje {
  background: rgba(102, 126, 234, 0.3);
  border: 2px solid rgba(102, 126, 234, 0.6);
}

.dia.tem-corrida {
  background: rgba(16, 185, 129, 0.2);
}

.numero-dia {
  color: white;
  font-weight: 600;
  display: block;
  margin-bottom: 0.25rem;
}

.indicador-corridas {
  font-size: 0.7rem;
}

.mini-corrida {
  background: rgba(255,255,255,0.2);
  color: white;
  padding: 0.1rem 0.3rem;
  border-radius: 3px;
  margin-bottom: 0.1rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mais-corridas {
  color: rgba(255,255,255,0.8);
  font-size: 0.6rem;
  text-align: center;
  margin-top: 0.2rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.2);
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.modal-header h3 {
  color: white;
  margin: 0;
  text-transform: capitalize;
}

.btn-fechar {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.3s ease;
}

.btn-fechar:hover {
  background: rgba(255,255,255,0.2);
}

.modal-body {
  padding: 1.5rem;
}

.sem-corridas {
  text-align: center;
  color: rgba(255,255,255,0.7);
  padding: 2rem;
}

.corrida-item {
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255,255,255,0.2);
}

.corrida-item:last-child {
  margin-bottom: 0;
}

.corrida-info h4 {
  color: white;
  margin: 0 0 0.5rem 0;
}

.corrida-info p {
  color: rgba(255,255,255,0.8);
  margin: 0.25rem 0;
  font-size: 0.9rem;
}

.corrida-acoes {
  margin-top: 1rem;
}

.btn-inscricao {
  background: rgba(16, 185, 129, 0.8);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-inscricao:hover {
  background: rgba(16, 185, 129, 1);
}

@media (max-width: 768px) {
  .calendario-container {
    margin: 1rem;
    padding: 1rem;
  }
  
  .dia {
    min-height: 80px;
    padding: 0.25rem;
  }
  
  .numero-dia {
    font-size: 0.9rem;
  }
  
  .mini-corrida {
    font-size: 0.6rem;
    padding: 0.05rem 0.2rem;
  }
}
</style>