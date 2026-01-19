# 🏃‍♀️ Próximas Corridas - Corrigido

## 🎯 Problema Identificado

O widget "Próximas Corridas" estava usando **dados hardcoded** (fixos) em vez de buscar as corridas reais do Firestore.

## ❌ Antes

```javascript
const upcomingRaces = ref([
  {
    id: 1,
    name: 'Corrida do Parque',
    location: 'Parque Ibirapuera',
    distance: '5K',
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  },
  {
    id: 2,
    name: 'Maratona da Cidade',
    location: 'Centro da Cidade',
    distance: '21K',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  }
])
```

## ✅ Depois

```javascript
const upcomingRaces = ref([])
const loadingRaces = ref(true)

const loadUpcomingRaces = async () => {
  try {
    const allRaces = await corridaService.getCorridas()
    
    // Filtrar apenas corridas futuras
    const now = new Date()
    const futureRaces = allRaces.filter(race => {
      const raceDate = new Date(race.data)
      return raceDate > now
    })
    
    // Ordenar por data e pegar as 3 próximas
    upcomingRaces.value = futureRaces
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 3)
  } catch (error) {
    console.error('Erro ao carregar corridas:', error)
    upcomingRaces.value = []
  }
}
```

## 🔄 Correções Implementadas

### 1. Busca de Dados Reais
- ✅ Integração com `corridaService`
- ✅ Busca corridas do Firestore
- ✅ Filtra apenas corridas futuras
- ✅ Ordena por data
- ✅ Limita a 3 corridas

### 2. Estado de Carregamento
```vue
<div v-if="loadingRaces" class="loading-state">
  <div class="spinner"></div>
  <p>Carregando corridas...</p>
</div>
```

### 3. Estado Vazio
```vue
<div v-else-if="upcomingRaces.length === 0" class="empty-state">
  <div class="empty-icon">📅</div>
  <p>Nenhuma corrida agendada</p>
  <router-link to="/corridas" class="create-race-link">
    Criar corrida →
  </router-link>
</div>
```

### 4. Mapeamento de Campos
```javascript
// Firestore usa:
race.nome      // em vez de race.name
race.local     // em vez de race.location
race.distancia // em vez de race.distance
race.data      // em vez de race.date
```

### 5. Link Funcional
```vue
<router-link to="/corridas" class="view-all-btn">
  Ver todas as corridas →
</router-link>
```

## 📊 Estrutura de Dados

### Firestore Collection: `corridas`
```javascript
{
  id: "abc123",
  nome: "Corrida do Parque",
  local: "Parque Ibirapuera",
  distancia: "5K",
  data: "2026-01-26T09:00:00.000Z",
  descricao: "Corrida matinal no parque",
  createdBy: "userId",
  createdAt: "2026-01-19T00:00:00.000Z",
  participantes: []
}
```

## 🎨 Estados Visuais

### 1. Carregando
```
┌─────────────────────────────┐
│ 🏃‍♀️ Próximas Corridas      │
├─────────────────────────────┤
│         ⏳                  │
│  Carregando corridas...     │
└─────────────────────────────┘
```

### 2. Vazio
```
┌─────────────────────────────┐
│ 🏃‍♀️ Próximas Corridas      │
├─────────────────────────────┤
│         📅                  │
│  Nenhuma corrida agendada   │
│     Criar corrida →         │
└─────────────────────────────┘
```

### 3. Com Corridas
```
┌─────────────────────────────┐
│ 🏃‍♀️ Próximas Corridas      │
├─────────────────────────────┤
│  26  Corrida do Parque      │
│ JAN  📍 Parque Ibirapuera   │
│      5K                     │
├─────────────────────────────┤
│  02  Maratona da Cidade     │
│ FEV  📍 Centro              │
│      21K                    │
├─────────────────────────────┤
│  Ver todas as corridas →    │
└─────────────────────────────┘
```

## 🔄 Fluxo de Dados

```
1. Componente monta
   ↓
2. Chama loadUpcomingRaces()
   ↓
3. Busca todas as corridas do Firestore
   ↓
4. Filtra corridas futuras (data > hoje)
   ↓
5. Ordena por data (mais próxima primeiro)
   ↓
6. Pega as 3 primeiras
   ↓
7. Renderiza na tela
```

## 🧪 Testando

### Teste 1: Sem Corridas
```
1. Acesse a Home
2. Se não houver corridas futuras
3. Deve mostrar:
   - Ícone 📅
   - "Nenhuma corrida agendada"
   - Link "Criar corrida →"
```

### Teste 2: Com Corridas
```
1. Crie algumas corridas futuras
2. Acesse a Home
3. Deve mostrar:
   - Até 3 corridas
   - Ordenadas por data
   - Apenas corridas futuras
   - Botão "Ver todas as corridas →"
```

### Teste 3: Carregamento
```
1. Acesse a Home
2. Deve mostrar spinner
3. Mensagem "Carregando corridas..."
4. Após carregar, mostra corridas ou estado vazio
```

### Teste 4: Link Funcional
```
1. Clique em "Ver todas as corridas →"
2. Deve ir para /corridas
3. Mostra página de corridas completa
```

### Teste 5: Corridas Passadas
```
1. Crie corrida com data passada
2. Acesse a Home
3. Corrida passada NÃO deve aparecer
4. Apenas corridas futuras aparecem
```

## 📝 Código Implementado

### Import do corridaService
```javascript
import { corridaService } from '@/services/corridaService'
```

### Função de Carregamento
```javascript
const loadUpcomingRaces = async () => {
  loadingRaces.value = true
  
  try {
    const allRaces = await corridaService.getCorridas()
    
    // Filtrar apenas corridas futuras
    const now = new Date()
    const futureRaces = allRaces.filter(race => {
      const raceDate = new Date(race.data)
      return raceDate > now
    })
    
    // Ordenar por data e pegar as 3 próximas
    upcomingRaces.value = futureRaces
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 3)
  } catch (error) {
    console.error('Erro ao carregar corridas:', error)
    upcomingRaces.value = []
  } finally {
    loadingRaces.value = false
  }
}
```

### Template Atualizado
```vue
<div class="widget">
  <h3>🏃‍♀️ Próximas Corridas</h3>
  
  <div v-if="loadingRaces" class="loading-state">
    <div class="spinner"></div>
    <p>Carregando corridas...</p>
  </div>
  
  <div v-else-if="upcomingRaces.length === 0" class="empty-state">
    <div class="empty-icon">📅</div>
    <p>Nenhuma corrida agendada</p>
    <router-link to="/corridas" class="create-race-link">
      Criar corrida →
    </router-link>
  </div>
  
  <div v-else>
    <div v-for="race in upcomingRaces" :key="race.id" class="race-item">
      <div class="race-date">
        <div class="date-day">{{ formatDay(race.data) }}</div>
        <div class="date-month">{{ formatMonth(race.data) }}</div>
      </div>
      <div class="race-info">
        <h4>{{ race.nome }}</h4>
        <p>📍 {{ race.local }}</p>
        <span class="race-distance">{{ race.distancia }}</span>
      </div>
    </div>
    <router-link to="/corridas" class="view-all-btn">
      Ver todas as corridas →
    </router-link>
  </div>
</div>
```

## 🎨 Estilos Adicionados

### Loading State
```css
.widget .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  gap: 0.75rem;
}

.widget .spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
```

### Empty State
```css
.widget .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  text-align: center;
  gap: 0.5rem;
}

.widget .empty-icon {
  font-size: 2.5rem;
  opacity: 0.4;
}
```

## 🐛 Troubleshooting

### Corridas não aparecem

**Verificação 1: Firestore**
- Verifique se há corridas na collection `corridas`
- Verifique se as datas são futuras

**Verificação 2: Campos**
- Verifique se os campos estão corretos:
  - `nome` (não `name`)
  - `local` (não `location`)
  - `distancia` (não `distance`)
  - `data` (não `date`)

**Verificação 3: Console**
```javascript
// Deve aparecer:
🔵 [Home] Carregando próximas corridas
📦 [Home] Corridas recebidas: X
✅ [Home] Próximas corridas carregadas: X
```

### Sempre mostra "Nenhuma corrida"

**Verificação 1: Datas**
- Verifique se as corridas têm datas futuras
- Teste com: `new Date(race.data) > new Date()`

**Verificação 2: Formato de Data**
- Deve ser ISO string: `"2026-01-26T09:00:00.000Z"`
- Ou Timestamp do Firestore

### Link não funciona

**Verificação 1: Router**
- Verifique se a rota `/corridas` existe
- Use `<router-link>` em vez de `<button>`

## 💡 Melhorias Futuras

- [ ] Cache de corridas
- [ ] Atualização em tempo real (onSnapshot)
- [ ] Filtro por distância
- [ ] Mostrar número de participantes
- [ ] Link direto para cada corrida
- [ ] Botão de confirmação de presença
- [ ] Countdown para próxima corrida

## 📊 Comparação

### Antes
```
❌ Dados hardcoded (fixos)
❌ Sempre as mesmas 2 corridas
❌ Não atualiza
❌ Não reflete dados reais
❌ Botão não funcional
```

### Depois
```
✅ Dados do Firestore
✅ Corridas reais do banco
✅ Filtra corridas futuras
✅ Ordena por data
✅ Limita a 3 corridas
✅ Loading state
✅ Empty state
✅ Link funcional
```

---

**Implementado em:** 19/01/2026  
**Status:** ✅ Funcionando  
**Integração:** corridaService + Firestore
