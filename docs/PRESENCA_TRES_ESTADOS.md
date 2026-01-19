# 🎯 Sistema de Presença com 3 Estados

## 📋 Implementação

### Estados Disponíveis
- ✅ **Vou** - Confirmação de participação
- ❌ **Não vou** - Declínio de participação
- ❓ **Talvez** - Indeciso sobre participação

---

## 🎨 Interface

### Layout dos Botões
```
┌─────────────────────────────────────┐
│  [✓ Vou]  [✗ Não vou]  [? Talvez]  │
│                                     │
│     ✓ 15    ✗ 3    ? 8             │
└─────────────────────────────────────┘
```

### Estados Visuais

**Botão Não Selecionado:**
- Background: `rgba(255,255,255,0.1)`
- Cor: `rgba(255,255,255,0.7)`
- Opaco e discreto

**Botão "Vou" Ativo:**
- Background: Gradiente verde (`#10b981` → `#059669`)
- Cor: Branco
- Sombra verde
- Efeito de elevação

**Botão "Não vou" Ativo:**
- Background: Gradiente vermelho (`#ef4444` → `#dc2626`)
- Cor: Branco
- Sombra vermelha
- Efeito de elevação

**Botão "Talvez" Ativo:**
- Background: Gradiente laranja (`#f59e0b` → `#d97706`)
- Cor: Branco
- Sombra laranja
- Efeito de elevação

---

## 💾 Estrutura de Dados

### Firestore Collection: presencas
```javascript
// Document ID: {corridaId}_{userId}
{
  corridaId: "corrida123",
  userId: "user456",
  status: "sim",  // "sim", "nao", "talvez"
  dataAtualizacao: Timestamp
}
```

### Exemplo de Documentos
```javascript
// Usuário confirmou presença
presencas/corrida123_user456 {
  corridaId: "corrida123",
  userId: "user456",
  status: "sim",
  dataAtualizacao: "2024-01-18T10:00:00Z"
}

// Usuário declinou
presencas/corrida123_user789 {
  corridaId: "corrida123",
  userId: "user789",
  status: "nao",
  dataAtualizacao: "2024-01-18T11:00:00Z"
}

// Usuário indeciso
presencas/corrida123_user101 {
  corridaId: "corrida123",
  userId: "user101",
  status: "talvez",
  dataAtualizacao: "2024-01-18T12:00:00Z"
}
```

---

## 🔧 Serviço (presencaService.js)

### Métodos Principais

**setPresenca(corridaId, userId, status)**
```javascript
// Define o status de presença
await presencaService.setPresenca('corrida123', 'user456', 'sim')
await presencaService.setPresenca('corrida123', 'user789', 'nao')
await presencaService.setPresenca('corrida123', 'user101', 'talvez')
```

**getPresencaStatus(corridaId, userId)**
```javascript
// Retorna: 'sim', 'nao', 'talvez', ou null
const status = await presencaService.getPresencaStatus('corrida123', 'user456')
console.log(status) // 'sim'
```

**cancelarPresenca(corridaId, userId)**
```javascript
// Remove completamente a presença
await presencaService.cancelarPresenca('corrida123', 'user456')
```

**contarPresencasPorStatus(corridaId)**
```javascript
// Retorna contadores de cada status
const contadores = await presencaService.contarPresencasPorStatus('corrida123')
console.log(contadores)
// { sim: 15, nao: 3, talvez: 8 }
```

**onPresencasChange(corridaId, callback)**
```javascript
// Listener em tempo real
const unsubscribe = presencaService.onPresencasChange('corrida123', (snapshot) => {
  const counts = { sim: 0, nao: 0, talvez: 0 }
  snapshot.forEach(doc => {
    const data = doc.data()
    if (data.status) counts[data.status]++
  })
  console.log('Contadores atualizados:', counts)
})

// Cancelar listener
unsubscribe()
```

---

## 🎯 Componente (PresencaButton.vue)

### Props
```javascript
defineProps({
  corridaId: {
    type: String,
    required: true
  }
})
```

### Estado Interno
```javascript
const status = ref(null) // null, 'sim', 'nao', 'talvez'
const contadores = ref({
  sim: 0,
  nao: 0,
  talvez: 0
})
```

### Lógica de Toggle
```javascript
async function setPresenca(novoStatus) {
  if (status.value === novoStatus) {
    // Clicar no mesmo botão remove a presença
    await presencaService.cancelarPresenca(corridaId, userId)
    status.value = null
  } else {
    // Define novo status
    await presencaService.setPresenca(corridaId, userId, novoStatus)
    status.value = novoStatus
  }
}
```

---

## 🔄 Fluxo de Uso

### 1. Usuário Sem Resposta
```
Estado: status = null
Visual: Todos os botões opacos
Ação: Clicar em qualquer botão define o status
```

### 2. Usuário Confirma "Vou"
```
Estado: status = 'sim'
Visual: Botão "Vou" destacado em verde
Ação: 
  - Clicar em "Vou" novamente → Remove presença
  - Clicar em "Não vou" → Muda para 'nao'
  - Clicar em "Talvez" → Muda para 'talvez'
```

### 3. Usuário Muda de Ideia
```
Estado: status = 'sim'
Ação: Clica em "Não vou"
Resultado: status = 'nao'
Visual: Botão "Não vou" destacado em vermelho
```

### 4. Usuário Remove Resposta
```
Estado: status = 'sim'
Ação: Clica em "Vou" novamente
Resultado: status = null
Visual: Todos os botões voltam ao estado opaco
```

---

## 📊 Contadores em Tempo Real

### Atualização Automática
```javascript
onMounted(() => {
  // Listener que atualiza contadores automaticamente
  unsubscribe = presencaService.onPresencasChange(corridaId, (snapshot) => {
    const counts = { sim: 0, nao: 0, talvez: 0 }
    snapshot.forEach(doc => {
      const data = doc.data()
      if (data.status && counts.hasOwnProperty(data.status)) {
        counts[data.status]++
      }
    })
    contadores.value = counts
  })
})
```

### Exibição
```html
<div class="presenca-contador">
  <span class="contador-item">
    <span class="contador-icon">✓</span>
    <span class="contador-num">15</span>
  </span>
  <span class="contador-item">
    <span class="contador-icon">✗</span>
    <span class="contador-num">3</span>
  </span>
  <span class="contador-item">
    <span class="contador-icon">?</span>
    <span class="contador-num">8</span>
  </span>
</div>
```

---

## 🎨 Responsividade

### Desktop
- 3 botões em linha
- Tamanho: `0.8rem`
- Padding: `0.4rem 0.8rem`
- Min-width: `70px`

### Mobile
- 3 botões em linha (flex-wrap)
- Tamanho: `0.75rem`
- Padding: `0.35rem 0.6rem`
- Min-width: `60px`

---

## 🔔 Notificações e Feed

### Apenas para Confirmação ("Vou")
```javascript
if (status === 'sim') {
  // Criar post no feed
  await feedService.criarPost(
    userId, 
    'confirmacao', 
    'confirmou presença em uma corrida', 
    corridaId
  )
  
  // Notificar outros usuários
  await notificacaoService.criarNotificacao(
    userId, 
    'confirmacao', 
    'Alguém confirmou presença na corrida que você tem interesse'
  )
}
```

**Nota:** Apenas confirmações geram posts e notificações. "Não vou" e "Talvez" são silenciosos.

---

## 🔐 Firestore Rules

```javascript
match /presencas/{presencaId} {
  // Formato: {corridaId}_{userId}
  allow read: if request.auth != null;
  
  allow create: if request.auth != null 
    && isApproved()
    && presencaId == request.resource.data.corridaId + '_' + request.auth.uid
    && request.resource.data.status in ['sim', 'nao', 'talvez'];
  
  allow update: if request.auth != null 
    && isApproved()
    && resource.data.userId == request.auth.uid
    && request.resource.data.status in ['sim', 'nao', 'talvez'];
  
  allow delete: if request.auth != null 
    && resource.data.userId == request.auth.uid;
}
```

---

## 📈 Estatísticas

### Consultar Totais
```javascript
const contadores = await presencaService.contarPresencasPorStatus('corrida123')

console.log(`Confirmados: ${contadores.sim}`)
console.log(`Não vão: ${contadores.nao}`)
console.log(`Talvez: ${contadores.talvez}`)
console.log(`Total de respostas: ${contadores.sim + contadores.nao + contadores.talvez}`)
```

### Calcular Percentuais
```javascript
const total = contadores.sim + contadores.nao + contadores.talvez
const percentualConfirmados = (contadores.sim / total * 100).toFixed(1)
const percentualDeclinados = (contadores.nao / total * 100).toFixed(1)
const percentualIndecisos = (contadores.talvez / total * 100).toFixed(1)

console.log(`${percentualConfirmados}% confirmados`)
console.log(`${percentualDeclinados}% não vão`)
console.log(`${percentualIndecisos}% indecisos`)
```

---

## 🧪 Testando

### 1. Testar Confirmação
```javascript
// No console do navegador
await presencaService.setPresenca('corrida123', 'user456', 'sim')
const status = await presencaService.getPresencaStatus('corrida123', 'user456')
console.log(status) // 'sim'
```

### 2. Testar Mudança de Status
```javascript
await presencaService.setPresenca('corrida123', 'user456', 'nao')
const status = await presencaService.getPresencaStatus('corrida123', 'user456')
console.log(status) // 'nao'
```

### 3. Testar Remoção
```javascript
await presencaService.cancelarPresenca('corrida123', 'user456')
const status = await presencaService.getPresencaStatus('corrida123', 'user456')
console.log(status) // null
```

### 4. Testar Contadores
```javascript
const contadores = await presencaService.contarPresencasPorStatus('corrida123')
console.log(contadores) // { sim: 15, nao: 3, talvez: 8 }
```

---

## 💡 Casos de Uso

### Organizador Vê Interesse Real
- **Confirmados (Vou)**: Pessoas que definitivamente vão
- **Indecisos (Talvez)**: Potenciais participantes
- **Declinados (Não vou)**: Pessoas que não têm interesse

### Planejamento de Vagas
```javascript
const contadores = await presencaService.contarPresencasPorStatus(corridaId)
const vagasNecessarias = contadores.sim + Math.ceil(contadores.talvez * 0.5)
console.log(`Vagas necessárias (estimativa): ${vagasNecessarias}`)
```

### Engajamento
```javascript
const total = contadores.sim + contadores.nao + contadores.talvez
const taxaEngajamento = (total / totalUsuarios * 100).toFixed(1)
console.log(`Taxa de engajamento: ${taxaEngajamento}%`)
```

---

## ✅ Benefícios

✅ **Transparência**: Usuários podem expressar claramente sua intenção
✅ **Planejamento**: Organizadores têm dados mais precisos
✅ **Flexibilidade**: Fácil mudar de ideia
✅ **Engajamento**: Mais opções = mais interação
✅ **Tempo Real**: Contadores atualizam automaticamente
✅ **UX**: Interface intuitiva com feedback visual claro

---

## 📝 Arquivos Modificados

- `src/components/social/PresencaButton.vue`
  - 3 botões em vez de 1
  - Contadores separados por status
  - Lógica de toggle melhorada

- `src/services/presencaService.js`
  - Método `setPresenca(corridaId, userId, status)`
  - Método `getPresencaStatus(corridaId, userId)`
  - Método `contarPresencasPorStatus(corridaId)`
  - Suporte a 3 estados

---

## ✅ Status

**IMPLEMENTADO** - Sistema de presença com 3 estados funcionando completamente!
