# 🏃 Múltiplas Distâncias em Corridas

## 📋 Implementação

### Problema Anterior
- Corridas permitiam apenas **uma distância** por evento
- Não refletia a realidade onde eventos oferecem múltiplas opções (3K, 5K, 10K, etc.)

### Solução Implementada
- Campo `distancia` (string) → `distancias` (array)
- Checkboxes para seleção múltipla
- Exibição de badges para cada distância

---

## 🎨 Interface do Formulário

### Opções Disponíveis
```javascript
const opcoesDistancia = [
  { value: '3K', label: '3K' },
  { value: '5K', label: '5K' },
  { value: '10K', label: '10K' },
  { value: '15K', label: '15K' },
  { value: '21K', label: 'Meia Maratona (21K)' },
  { value: '42K', label: 'Maratona (42K)' },
  { value: 'Caminhada', label: 'Caminhada' },
  { value: 'Outro', label: 'Outro' }
]
```

### Layout
```
┌─────────────────────────────────────────┐
│ Distâncias Disponíveis *                │
├─────────────────────────────────────────┤
│  ☑ 3K        ☑ 5K        ☑ 10K         │
│  ☐ 15K       ☐ 21K       ☐ 42K         │
│  ☐ Caminhada ☐ Outro                   │
├─────────────────────────────────────────┤
│ Selecione uma ou mais distâncias        │
└─────────────────────────────────────────┘
```

---

## 💾 Estrutura de Dados

### Firestore
```javascript
// Collection: corridas/{corridaId}
{
  titulo: "Corrida do Parque",
  data: "2024-02-15T08:00:00",
  local: "Parque Ibirapuera",
  distancias: ["3K", "5K", "10K"],  // Array de strings
  valor: 50.00,
  vagas: 500,
  descricao: "Corrida beneficente...",
  linkInscricao: "https://...",
  imagem: "https://...",
  organizador: "uid123",
  organizadorNome: "João Silva"
}
```

---

## 🎯 Exibição nos Cards

### Antes
```
┌─────────────────────────┐
│ Corrida do Parque  [5K] │
└─────────────────────────┘
```

### Depois
```
┌─────────────────────────────────┐
│ Corrida do Parque               │
│ [3K] [5K] [10K]                 │
└─────────────────────────────────┘
```

### Estilo dos Badges
- Background: `rgba(59, 130, 246, 0.3)` (azul translúcido)
- Border: `rgba(59, 130, 246, 0.5)`
- Padding: `0.35rem 0.85rem`
- Border-radius: `12px`
- Font-weight: `500`

---

## 🔄 Migração de Dados

### Corridas Antigas (com campo `distancia`)
Se você tem corridas antigas com o campo `distancia` (string), pode migrar assim:

```javascript
// Script de migração (executar no console do Firebase)
const corridasRef = collection(db, 'corridas')
const snapshot = await getDocs(corridasRef)

snapshot.forEach(async (doc) => {
  const data = doc.data()
  
  // Se tem distancia (antigo) e não tem distancias (novo)
  if (data.distancia && !data.distancias) {
    await updateDoc(doc.ref, {
      distancias: [data.distancia],  // Converte string para array
      distancia: deleteField()       // Remove campo antigo
    })
  }
})
```

---

## ✅ Validação

### Frontend
- Pelo menos uma distância deve ser selecionada
- Array não pode estar vazio ao submeter

### Firestore Rules
```javascript
match /corridas/{corridaId} {
  allow create: if request.auth != null 
    && isApproved()
    && request.resource.data.distancias is list
    && request.resource.data.distancias.size() > 0;
    
  allow update: if request.auth != null
    && isApproved()
    && request.resource.data.distancias is list
    && request.resource.data.distancias.size() > 0;
}
```

---

## 📱 Responsividade

### Desktop
- Grid: `repeat(auto-fill, minmax(180px, 1fr))`
- 4 colunas em telas grandes
- Gap: `0.75rem`

### Mobile
- Grid: `repeat(auto-fill, minmax(140px, 1fr))`
- 2 colunas em telas pequenas
- Gap: `0.5rem`
- Padding reduzido nos checkboxes

---

## 🎨 Estados Visuais

### Checkbox Normal
```css
background: rgba(255,255,255,0.05);
border: 2px solid rgba(255,255,255,0.2);
```

### Checkbox Hover
```css
background: rgba(255,255,255,0.1);
border-color: rgba(255,255,255,0.3);
```

### Checkbox Ativo (Selecionado)
```css
background: rgba(59, 130, 246, 0.2);
border-color: rgba(59, 130, 246, 0.5);
```

---

## 🔍 Exemplo de Uso

### Criar Corrida com Múltiplas Distâncias
```javascript
const corridaData = {
  titulo: "Corrida Beneficente 2024",
  data: "2024-03-20T07:00:00",
  local: "Parque Villa-Lobos",
  distancias: ["5K", "10K", "21K"],  // 3 opções
  valor: 80.00,
  vagas: 1000,
  descricao: "Corrida beneficente com 3 percursos",
  linkInscricao: "https://inscricao.com",
  organizador: user.uid,
  organizadorNome: user.displayName
}

await corridaService.createCorrida(corridaData)
```

### Filtrar Corridas por Distância
```javascript
// Buscar corridas que oferecem 5K
const corridas5K = corridas.filter(corrida => 
  corrida.distancias?.includes('5K')
)

// Buscar corridas que oferecem maratona
const maratonas = corridas.filter(corrida => 
  corrida.distancias?.includes('42K')
)
```

---

## 📊 Benefícios

✅ **Realista**: Reflete eventos reais que oferecem múltiplas distâncias
✅ **Flexível**: Organizadores podem adicionar quantas distâncias quiserem
✅ **Visual**: Badges coloridos facilitam identificação rápida
✅ **Filtros**: Permite buscar corridas por distância específica
✅ **UX**: Interface intuitiva com checkboxes visuais

---

## 🚀 Próximas Melhorias Possíveis

1. **Valores por Distância**
   - Permitir preços diferentes para cada distância
   - Ex: 5K = R$ 50, 10K = R$ 70, 21K = R$ 100

2. **Vagas por Distância**
   - Limitar vagas específicas para cada percurso
   - Ex: 5K = 500 vagas, 10K = 300 vagas

3. **Filtros Avançados**
   - Filtrar corridas por distância na página
   - Ordenar por distância disponível

4. **Estatísticas**
   - Mostrar quantos inscritos por distância
   - Gráficos de distribuição

---

## 📝 Arquivos Modificados

- `src/components/corridas/CorridaForm.vue`
  - Adicionado array `opcoesDistancia`
  - Substituído select por checkboxes
  - Campo `distancia` → `distancias`
  - Estilos para checkboxes e badges

- `src/components/corridas/CorridasList.vue`
  - Exibição de múltiplos badges
  - Layout atualizado para badges em linha
  - Estilos dos badges melhorados

---

## ✅ Status

**IMPLEMENTADO** - Sistema de múltiplas distâncias funcionando completamente!
