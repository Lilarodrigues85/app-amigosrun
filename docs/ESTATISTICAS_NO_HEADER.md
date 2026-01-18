# 📊 Estatísticas no Header - Implementado

## 🎯 Objetivo Alcançado

Movidas as estatísticas do usuário da sidebar para o header, próximo ao avatar, para melhor visibilidade e aproveitamento do espaço.

## 🔧 Alterações Realizadas

### 1. AppHeader.vue - Adicionadas Estatísticas

**Arquivo:** `src/components/layout/AppHeader.vue`

#### Novos Estados

```javascript
// Estatísticas do usuário
const userStats = ref({
  totalRuns: 0,
  totalDistance: 0,
  averagePace: '',
  friends: 0
})
```

#### Carregamento 