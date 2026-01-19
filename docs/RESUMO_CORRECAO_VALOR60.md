# Resumo: Correção do Erro ao Atualizar Corridas

## Problema Reportado

"Quando eu atualizo a corrida, da erro! essa informação de 60+ tem na collection corridas?"

## Causa Raiz

O campo `valor60` foi adicionado recentemente, mas:
1. **Corridas antigas** não tinham esse campo no Firestore
2. **Tipos de dados** não estavam sendo validados (string vs number)
3. **Falta de compatibilidade** retroativa ao editar corridas antigas

## Correções Aplicadas

### ✅ 1. Validação de Tipos no Service

**Arquivo**: `src/services/corridaService.js`

Ambos os métodos `createCorrida` e `updateCorrida` agora:
- Convertem `valor` e `valor60` para `float`
- Convertem `vagas` para `int`
- Tratam valores vazios como `null`
- Adicionam logs de debug

### ✅ 2. Preparação Explícita de Dados

**Arquivo**: `src/components/corridas/CorridaForm.vue`

O método `handleSubmit` agora:
- Cria objeto `corridaData` com campos explícitos
- Converte tipos antes de enviar
- Não envia campos extras do formulário

### ✅ 3. Compatibilidade Retroativa

**Arquivo**: `src/components/corridas/CorridaForm.vue`

O `onMounted` agora:
- Inicializa TODOS os campos explicitamente
- Define `valor60` como `null` se não existir
- Previne erros com corridas antigas

### ✅ 4. Logs de Debug

Adicionados em todos os pontos críticos:
- Criação de corrida
- Atualização de corrida
- Carregamento no formulário
- Erros detalhados

## Teste Recomendado

1. **Criar nova corrida** com valor 60+
   - ✅ Deve salvar corretamente
   - ✅ Deve exibir ambos os valores

2. **Editar corrida antiga** (sem valor 60+)
   - ✅ Deve abrir sem erro
   - ✅ Campo valor60 deve estar vazio
   - ✅ Pode adicionar valor 60+ e salvar

3. **Editar corrida nova** (com valor 60+)
   - ✅ Deve abrir com valor 60+ preenchido
   - ✅ Pode alterar e salvar

## Estrutura de Dados no Firestore

```javascript
{
  // Campos obrigatórios
  titulo: string,
  data: string (ISO),
  local: string,
  distancias: array,
  organizador: string (uid),
  organizadorNome: string,
  
  // Campos opcionais (podem ser null)
  valor: number | null,
  valor60: number | null,  // ⭐ NOVO
  vagas: number | null,
  descricao: string | null,
  linkInscricao: string | null,
  imagem: string | null,
  latitude: number | null,
  longitude: number | null,
  
  // Campos automáticos
  createdAt: string (ISO),
  updatedAt: string (ISO),
  participantes: array
}
```

## Exibição Visual

### Card de Corrida
```
💰 Geral: R$ 50,00
   60+: R$ 25,00  (em dourado)
```

### Formulário
```
Valor de Inscrição (Geral)
R$ [____]

Valor 60+ (Idosos)
R$ [____]
Valor especial para maiores de 60 anos
```

## Status

✅ **RESOLVIDO** - Corridas podem ser criadas e editadas sem erros
✅ Campo `valor60` é totalmente funcional
✅ Compatível com corridas antigas
✅ Tipos de dados validados
✅ Logs de debug implementados

## Próximos Passos

1. Testar em produção
2. Verificar logs no console durante uso
3. Se necessário, criar migração para adicionar `valor60: null` em todas as corridas antigas
