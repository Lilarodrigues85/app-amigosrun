# Layout Melhorado dos Botões de Presença

## Mudanças Implementadas

### 1. Botões Centralizados em Colunas

**Antes**: Botões em linha horizontal com contadores separados embaixo

**Depois**: Cada botão em uma coluna com seu contador logo abaixo

```
┌─────────────────────────────────┐
│        Vou    Não vou   Talvez  │
│        ✓0       ✗0       ?0     │
└─────────────────────────────────┘
```

### 2. Estrutura do Componente

#### Template
```vue
<div class="presenca-options">
  <div class="presenca-col">
    <button>Vou</button>
    <span>✓0</span>
  </div>
  
  <div class="presenca-col">
    <button>Não vou</button>
    <span>✗0</span>
  </div>
  
  <div class="presenca-col">
    <button>Talvez</button>
    <span>?0</span>
  </div>
</div>
```

### 3. Estilo dos Contadores

- **Background**: `rgba(0,0,0,0.2)` - Fundo escuro translúcido
- **Padding**: Compacto para não ocupar muito espaço
- **Border-radius**: `4px` - Cantos arredondados
- **Font-weight**: `600` - Negrito para destaque
- **Centralizado**: Alinhado ao centro de cada coluna

### 4. Layout dos Cards de Corrida

**Estrutura Atualizada**:
```
┌─────────────────────────────────┐
│ Imagem da Corrida               │
├─────────────────────────────────┤
│ Título                          │
│ Badges de Distância             │
│ 📅 Data                         │
│ 📍 Local                        │
│ 💰 Valores                      │
│ 👥 Vagas                        │
│ Descrição                       │
├─────────────────────────────────┤
│   [Vou] [Não vou] [Talvez]     │ ← Centralizado
│    ✓0      ✗0       ?0          │ ← Embaixo de cada
├─────────────────────────────────┤
│ [Inscrever-se]  [Editar]       │ ← Linha separada
├─────────────────────────────────┤
│ Por Nome do Organizador         │
└─────────────────────────────────┘
```

### 5. Responsividade

#### Desktop
- Largura máxima de cada coluna: `100px`
- Gap entre colunas: `0.5rem`
- Botões com padding confortável

#### Mobile
- Largura máxima de cada coluna: `85px`
- Gap reduzido: `0.375rem`
- Fonte menor para caber melhor
- Contadores compactos

## Arquivos Modificados

### 1. `src/components/social/PresencaButton.vue`

**Template**:
- ✅ Removidos ícones dos botões (✓, ✗, ?)
- ✅ Adicionada estrutura de colunas `.presenca-col`
- ✅ Contadores movidos para baixo de cada botão
- ✅ Formato compacto: `✓0`, `✗0`, `?0`

**CSS**:
- ✅ `.presenca-options` - Centralizado com `justify-content: center`
- ✅ `.presenca-col` - Flex column para empilhar botão e contador
- ✅ `.contador-item` - Background escuro, compacto, centralizado
- ✅ Responsividade melhorada para mobile

### 2. `src/components/corridas/CorridasList.vue`

**Template**:
- ✅ Botões de ação agrupados em `.corrida-actions-buttons`
- ✅ Presença em linha separada (width: 100%)

**CSS**:
- ✅ `.corrida-actions` - Flex column para empilhar presença e ações
- ✅ `.corrida-actions-buttons` - Flex row para botões de inscrição/editar
- ✅ Melhor espaçamento entre seções

## Benefícios

### 1. Visual Mais Limpo
- Contadores diretamente relacionados aos botões
- Menos confusão sobre qual número pertence a qual opção

### 2. Melhor Usabilidade
- Fácil de entender a relação botão → contador
- Layout mais intuitivo

### 3. Espaço Otimizado
- Contadores compactos economizam espaço vertical
- Cards ficam mais organizados

### 4. Consistência
- Mesmo padrão em todos os cards
- Alinhamento centralizado profissional

## Exemplo Visual

### Botão Inativo
```
┌──────────┐
│   Vou    │
└──────────┘
    ✓0
```

### Botão Ativo (Verde)
```
┌──────────┐
│   Vou    │ ← Gradiente verde
└──────────┘
    ✓5      ← Número atualizado
```

### Três Botões Juntos
```
┌────────┐  ┌────────┐  ┌────────┐
│  Vou   │  │Não vou │  │ Talvez │
└────────┘  └────────┘  └────────┘
   ✓12         ✗3          ?5
```

## Estados dos Botões

### Normal (Não Selecionado)
- Background: `rgba(255,255,255,0.1)`
- Cor do texto: `rgba(255,255,255,0.7)`
- Sem borda colorida

### Ativo - Vou (Verde)
- Background: Gradiente verde `#10b981` → `#059669`
- Cor do texto: Branco
- Sombra verde

### Ativo - Não Vou (Vermelho)
- Background: Gradiente vermelho `#ef4444` → `#dc2626`
- Cor do texto: Branco
- Sombra vermelha

### Ativo - Talvez (Laranja)
- Background: Gradiente laranja `#f59e0b` → `#d97706`
- Cor do texto: Branco
- Sombra laranja

### Hover
- Elevação: `translateY(-2px)`
- Sombra aumentada
- Transição suave

## Acessibilidade

- ✅ Botões com tamanho mínimo adequado para toque
- ✅ Contraste de cores adequado
- ✅ Estados visuais claros (ativo/inativo)
- ✅ Feedback visual no hover
- ✅ Disabled state com opacidade reduzida

## Testes Recomendados

1. **Desktop**:
   - Verificar alinhamento centralizado
   - Testar hover effects
   - Confirmar que contadores aparecem embaixo

2. **Mobile**:
   - Verificar que botões são tocáveis
   - Confirmar que texto não quebra
   - Testar em telas pequenas (320px)

3. **Funcionalidade**:
   - Clicar em cada botão
   - Verificar que contador atualiza
   - Confirmar que pode desmarcar clicando novamente

## Status

✅ Layout centralizado implementado
✅ Contadores embaixo de cada botão
✅ Formato compacto (✓0, ✗0, ?0)
✅ Responsividade ajustada
✅ Sem erros de sintaxe
✅ Pronto para uso
