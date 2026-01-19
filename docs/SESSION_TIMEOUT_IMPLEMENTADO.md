# ⏰ Sistema de Timeout de Sessão Implementado

## 🎯 Objetivo

Implementar logout automático após 1 hora de inatividade do usuário, melhorando a segurança da aplicação.

## ✅ Funcionalidades Implementadas

### 1. Detecção de Inatividade

O sistema monitora as seguintes atividades do usuário:
- 🖱️ Movimento do mouse
- ⌨️ Teclas pressionadas
- 📜 Scroll da página
- 👆 Toques na tela (mobile)
- 🖱️ Cliques

### 2. Timer de Sessão

- **Duração total**: 60 minutos (1 hora)
- **Aviso prévio**: 5 minutos antes de expirar
- **Reset automático**: A cada atividade detectada

### 3. Aviso Visual

Modal aparece 5 minutos antes da sessão expirar com opções:
- ✅ **Continuar Conectado**: Reseta o timer
- 🚪 **Sair Agora**: Faz logout imediatamente

### 4. Persistência Entre Abas

Usa `localStorage` para sincronizar o estado entre múltiplas abas/janelas do navegador.

## 📁 Arquivos Criados

### 1. src/composables/useSessionTimeout.js

Composable que gerencia toda a lógica do timeout:

```javascript
import { useSessionTimeout } from '@/composables/useSessionTimeout'

// Usar no componente
const { showWarning, extendSession, logout } = useSessionTimeout(60) // 60 minutos
```

**Parâmetros:**
- `timeoutMinutes`: Tempo em minutos até o logout (padrão: 60)

**Retorna:**
- `showWarning`: Boolean indicando se deve mostrar o aviso
- `extendSession`: Função para estender a sessão
- `logout`: Função para fazer logout manual

**Funcionalidades:**
- ✅ Monitora eventos de atividade
- ✅ Gerencia timers de aviso e logout
- ✅ Salva timestamp da última atividade
- ✅ Verifica sessão ao carregar página
- ✅ Limpa listeners ao desmontar

### 2. src/components/common/SessionTimeoutWarning.vue

Componente visual do modal de aviso:

```vue
<SessionTimeoutWarning 
  :show="showWarning" 
  @extend="extendSession"
  @logout="logout"
/>
```

**Props:**
- `show`: Boolean para mostrar/ocultar o modal

**Eventos:**
- `@extend`: Emitido quando usuário clica em "Continuar Conectado"
- `@logout`: Emitido quando usuário clica em "Sair Agora"

**Design:**
- 🎨 Modal centralizado com overlay
- ⏰ Ícone animado de relógio
- 📱 Responsivo para mobile
- ✨ Animações suaves

### 3. Integração no AppLayout.vue

O sistema é ativado automaticamente em todas as páginas protegidas:

```vue
<script setup>
import { useSessionTimeout } from '@/composables/useSessionTimeout'

const { showWarning, extendSession, logout } = useSessionTimeout(60)
</script>
```

### 4. Atualização no authService.js

Limpeza do localStorage ao fazer logout:

```javascript
async logout() {
  localStorage.removeItem('lastActivity')
  await signOut(auth)
}
```

## 🔧 Como Funciona

### Fluxo Normal

```
Usuário faz login
  ↓
Timer de 60 minutos inicia
  ↓
Usuário interage (move mouse, clica, etc)
  ↓
Timer reseta para 60 minutos
  ↓
[Ciclo continua enquanto houver atividade]
```

### Fluxo de Inatividade

```
Usuário para de interagir
  ↓
Após 55 minutos (60 - 5)
  ↓
Modal de aviso aparece
  ↓
Usuário tem 2 opções:
  ├─ Continuar Conectado → Timer reseta
  └─ Sair Agora → Logout imediato
  ↓
Se não interagir em 5 minutos
  ↓
Logout automático
  ↓
Redirecionado para /login
```

### Verificação ao Carregar

```
Usuário abre/recarrega página
  ↓
Sistema verifica localStorage
  ↓
Calcula tempo desde última atividade
  ↓
Se > 60 minutos
  ├─ Logout automático
  └─ Redirecionado para /login
Se < 60 minutos
  └─ Continua sessão normalmente
```

## 🎨 Interface do Modal

### Desktop

```
┌─────────────────────────────────────┐
│                                     │
│              ⏰                      │
│                                     │
│      Sessão Expirando               │
│                                     │
│  Sua sessão expirará em 5 minutos  │
│  por inatividade.                   │
│                                     │
│  Deseja continuar conectado?        │
│                                     │
│  ┌──────────┐  ┌──────────────┐   │
│  │Sair Agora│  │Continuar     │   │
│  │          │  │Conectado     │   │
│  └──────────┘  └──────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

### Mobile

```
┌───────────────────┐
│                   │
│        ⏰         │
│                   │
│ Sessão Expirando  │
│                   │
│ Sua sessão        │
│ expirará em       │
│ 5 minutos por     │
│ inatividade.      │
│                   │
│ Deseja continuar  │
│ conectado?        │
│                   │
│ ┌───────────────┐ │
│ │  Sair Agora   │ │
│ └───────────────┘ │
│ ┌───────────────┐ │
│ │  Continuar    │ │
│ │  Conectado    │ │
│ └───────────────┘ │
│                   │
└───────────────────┘
```

## 🔒 Segurança

### Benefícios

1. **Proteção de Dados**: Previne acesso não autorizado em dispositivos compartilhados
2. **Conformidade**: Atende requisitos de segurança de aplicações web
3. **Experiência do Usuário**: Aviso prévio evita perda de trabalho

### Considerações

- ✅ Timer reseta com qualquer atividade
- ✅ Funciona em múltiplas abas
- ✅ Persiste entre recarregamentos
- ✅ Limpa dados ao fazer logout

## ⚙️ Configuração

### Alterar Tempo de Timeout

No `AppLayout.vue`:

```javascript
// 30 minutos
const { showWarning, extendSession, logout } = useSessionTimeout(30)

// 2 horas
const { showWarning, extendSession, logout } = useSessionTimeout(120)
```

### Alterar Tempo de Aviso

No `useSessionTimeout.js`:

```javascript
// Aviso 10 minutos antes
const WARNING_DURATION = (timeoutMinutes - 10) * 60 * 1000

// Aviso 2 minutos antes
const WARNING_DURATION = (timeoutMinutes - 2) * 60 * 1000
```

### Adicionar/Remover Eventos de Atividade

No `useSessionTimeout.js`:

```javascript
const activityEvents = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click',
  'wheel',      // Adicionar scroll do mouse
  'touchmove'   // Adicionar movimento de toque
]
```

## 📊 Eventos Monitorados

| Evento | Descrição | Dispositivo |
|--------|-----------|-------------|
| `mousedown` | Botão do mouse pressionado | Desktop |
| `mousemove` | Mouse movido | Desktop |
| `keypress` | Tecla pressionada | Desktop/Mobile |
| `scroll` | Página rolada | Desktop/Mobile |
| `touchstart` | Toque iniciado | Mobile |
| `click` | Clique/toque | Desktop/Mobile |

## 🧪 Testando

### Teste 1: Timeout Normal

1. Faça login
2. Aguarde 55 minutos sem interagir
3. Modal de aviso deve aparecer
4. Aguarde mais 5 minutos
5. Logout automático deve ocorrer

### Teste 2: Extensão de Sessão

1. Faça login
2. Aguarde 55 minutos
3. Modal aparece
4. Clique em "Continuar Conectado"
5. Timer deve resetar para 60 minutos

### Teste 3: Atividade Contínua

1. Faça login
2. Continue usando a aplicação normalmente
3. Modal não deve aparecer
4. Sessão deve permanecer ativa

### Teste 4: Múltiplas Abas

1. Abra a aplicação em 2 abas
2. Interaja apenas em uma aba
3. Ambas as abas devem manter a sessão ativa

### Teste 5: Recarregamento

1. Faça login
2. Aguarde 30 minutos
3. Recarregue a página
4. Sessão deve continuar (ainda tem 30 minutos)

### Teste 6: Sessão Expirada

1. Faça login
2. Aguarde 65 minutos (ou altere manualmente o localStorage)
3. Recarregue a página
4. Deve fazer logout automático

## 🐛 Troubleshooting

### Modal não aparece

**Causa**: Timer não está sendo iniciado
**Solução**: Verificar se `useSessionTimeout` está sendo chamado no componente

### Logout não acontece

**Causa**: Eventos de atividade estão resetando o timer
**Solução**: Verificar se há algum evento sendo disparado automaticamente

### Múltiplas abas não sincronizam

**Causa**: localStorage não está sendo atualizado
**Solução**: Verificar se `localStorage.setItem('lastActivity', ...)` está sendo chamado

### Timer reseta muito rápido

**Causa**: Muitos eventos sendo disparados
**Solução**: Adicionar debounce ou throttle nos eventos

## 🎯 Melhorias Futuras

### Opcionais

1. **Countdown Visual**: Mostrar tempo restante no modal
2. **Notificação Sonora**: Alerta sonoro quando modal aparecer
3. **Configuração por Usuário**: Permitir usuário escolher tempo
4. **Histórico de Sessões**: Registrar logins/logouts
5. **Modo "Lembrar-me"**: Sessão mais longa se usuário escolher

### Exemplo de Countdown

```vue
<template>
  <p>Sessão expirará em <strong>{{ timeRemaining }}</strong></p>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const timeRemaining = ref('5:00')
let countdownInterval = null

onMounted(() => {
  let seconds = 300 // 5 minutos
  
  countdownInterval = setInterval(() => {
    seconds--
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    timeRemaining.value = `${mins}:${secs.toString().padStart(2, '0')}`
    
    if (seconds <= 0) {
      clearInterval(countdownInterval)
    }
  }, 1000)
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>
```

## ✅ Checklist de Implementação

- [x] Criar composable `useSessionTimeout`
- [x] Criar componente `SessionTimeoutWarning`
- [x] Integrar no `AppLayout`
- [x] Atualizar `authService` para limpar localStorage
- [x] Adicionar listeners de eventos
- [x] Implementar timer de aviso
- [x] Implementar timer de logout
- [x] Verificar sessão ao carregar
- [x] Sincronizar entre abas via localStorage
- [x] Design responsivo do modal
- [x] Animações e transições
- [x] Documentação completa

## 🎉 Resultado

O sistema de timeout de sessão está **100% funcional**:

- ✅ Logout automático após 1 hora de inatividade
- ✅ Aviso 5 minutos antes de expirar
- ✅ Opção de estender sessão
- ✅ Sincronização entre abas
- ✅ Interface amigável e responsiva
- ✅ Segurança aprimorada

**Pronto para produção!** 🚀

## 📁 Arquivos Modificados/Criados

1. `src/composables/useSessionTimeout.js` - Lógica do timeout (NOVO)
2. `src/components/common/SessionTimeoutWarning.vue` - Modal de aviso (NOVO)
3. `src/components/layout/AppLayout.vue` - Integração do sistema
4. `src/services/authService.js` - Limpeza do localStorage
5. `docs/SESSION_TIMEOUT_IMPLEMENTADO.md` - Esta documentação (NOVO)
