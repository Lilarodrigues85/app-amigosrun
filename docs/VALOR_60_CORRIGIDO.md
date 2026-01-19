# Correção do Campo Valor 60+ em Corridas

## Problema Identificado

Ao tentar atualizar corridas existentes após adicionar o campo `valor60`, ocorria erro porque:
1. Corridas antigas não tinham o campo `valor60` no Firestore
2. Tipos de dados não estavam sendo validados antes de salvar
3. Faltava tratamento de compatibilidade retroativa

## Solução Implementada

### 1. Validação de Tipos no Service (`corridaService.js`)

Adicionada conversão explícita de tipos numéricos:

```javascript
// Em createCorrida e updateCorrida
valor: corridaData.valor ? parseFloat(corridaData.valor) : null,
valor60: corridaData.valor60 ? parseFloat(corridaData.valor60) : null,
vagas: corridaData.vagas ? parseInt(corridaData.vagas) : null
```

### 2. Preparação de Dados no Formulário (`CorridaForm.vue`)

Dados são explicitamente formatados antes do envio:

```javascript
const corridaData = {
  titulo: form.value.titulo,
  data: form.value.data,
  local: form.value.local,
  // ... outros campos
  valor: form.value.valor ? parseFloat(form.value.valor) : null,
  valor60: form.value.valor60 ? parseFloat(form.value.valor60) : null,
  vagas: form.value.vagas ? parseInt(form.value.vagas) : null,
  // ...
}
```

### 3. Compatibilidade Retroativa no onMounted

Ao editar corridas antigas, todos os campos são inicializados com valores padrão:

```javascript
form.value = { 
  titulo: props.corrida.titulo || '',
  data: props.corrida.data || '',
  // ... outros campos
  valor: props.corrida.valor || null,
  valor60: props.corrida.valor60 || null, // ✅ Compatível com corridas antigas
  vagas: props.corrida.vagas || null,
  // ...
}
```

### 4. Logs de Debug

Adicionados logs para facilitar troubleshooting:
- `console.log('📝 Dados da corrida a serem salvos:', corridaData)`
- `console.log('📝 Editando corrida:', props.corrida)`
- `console.log('📝 Formulário preenchido com:', form.value)`
- `console.error('❌ Erro detalhado ao criar/atualizar:', error)`

## Exibição do Valor 60+

### No Card de Corrida (`CorridasList.vue`)

```vue
<div v-if="corrida.valor || corrida.valor60" class="info-item valores">
  <span class="icon">💰</span>
  <div class="valores-container">
    <span v-if="corrida.valor" class="valor-item">
      Geral: R$ {{ formatPrice(corrida.valor) }}
    </span>
    <span v-if="corrida.valor60" class="valor-item valor-60">
      60+: R$ {{ formatPrice(corrida.valor60) }}
    </span>
  </div>
</div>
```

Estilo do valor 60+:
```css
.valor-60 {
  color: rgba(251, 191, 36, 1); /* Dourado */
  font-weight: 600;
}
```

### Na Home (`Home.vue`)

Mesma estrutura de exibição com destaque dourado para o valor 60+.

## Resultado

✅ Corridas antigas podem ser editadas sem erro
✅ Campo `valor60` é opcional e compatível com registros antigos
✅ Tipos de dados são validados antes de salvar no Firestore
✅ Valor 60+ é exibido em dourado nos cards
✅ Logs facilitam debug de problemas futuros

## Como Testar

1. Criar uma nova corrida com valor 60+
2. Editar uma corrida antiga (sem valor 60+)
3. Editar uma corrida nova (com valor 60+)
4. Verificar que ambos os valores aparecem corretamente nos cards
5. Verificar logs no console durante criação/edição

## Estrutura no Firestore

```javascript
{
  titulo: "Corrida do Parque",
  data: "2024-03-15T08:00",
  local: "Parque Ibirapuera",
  distancias: ["5K", "10K"],
  valor: 50.00,        // Valor geral (number)
  valor60: 25.00,      // Valor 60+ (number ou null)
  vagas: 100,          // Number
  descricao: "...",
  linkInscricao: "...",
  imagem: "...",
  organizador: "uid",
  organizadorNome: "Nome",
  createdAt: "2024-01-18T...",
  updatedAt: "2024-01-18T...",
  participantes: []
}
```

## Arquivos Modificados

- `src/services/corridaService.js` - Validação de tipos
- `src/components/corridas/CorridaForm.vue` - Preparação de dados e compatibilidade
- `src/components/corridas/CorridasList.vue` - Exibição dos valores
- `src/views/Home.vue` - Exibição dos valores no widget
