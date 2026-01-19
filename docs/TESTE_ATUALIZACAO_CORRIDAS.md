# Guia de Teste: Atualização de Corridas com Valor 60+

## ✅ Problema Resolvido

O erro "Missing or insufficient permissions" foi corrigido. Agora você pode atualizar corridas normalmente.

## O que foi corrigido:

1. **Regras do Firestore** - Campo `organizador` agora é verificado corretamente
2. **Validação de tipos** - Valores numéricos são convertidos antes de salvar
3. **Compatibilidade** - Corridas antigas funcionam sem o campo `valor60`
4. **Permissões Admin** - Admins podem editar qualquer corrida

## Como Testar Agora

### Teste 1: Atualizar Corrida Antiga (sem valor60)

1. Acesse a página de Corridas
2. Clique em **Editar** em uma corrida antiga
3. Adicione um valor no campo **Valor 60+ (Idosos)**
   - Exemplo: `25.00`
4. Clique em **💾 Atualizar Corrida**
5. ✅ Deve salvar sem erro
6. Verifique que o valor 60+ aparece em dourado no card

### Teste 2: Criar Nova Corrida com Valor 60+

1. Clique em **➕ Nova Corrida**
2. Preencha todos os campos obrigatórios:
   - Título
   - Data e Hora
   - Local
   - Selecione pelo menos uma distância
3. Preencha os valores:
   - **Valor de Inscrição (Geral)**: `50.00`
   - **Valor 60+ (Idosos)**: `25.00`
4. Clique em **✨ Criar Corrida**
5. ✅ Deve criar sem erro
6. Verifique que ambos os valores aparecem no card

### Teste 3: Editar Corrida Nova

1. Edite a corrida que você acabou de criar
2. Altere o valor 60+ para outro valor
   - Exemplo: `30.00`
3. Clique em **💾 Atualizar Corrida**
4. ✅ Deve atualizar sem erro
5. Verifique que o novo valor aparece

### Teste 4: Remover Valor 60+

1. Edite uma corrida que tem valor 60+
2. Limpe o campo **Valor 60+ (Idosos)** (deixe vazio)
3. Clique em **💾 Atualizar Corrida**
4. ✅ Deve salvar sem erro
5. Verifique que apenas o valor geral aparece no card

## Verificação Visual

### Card com Ambos os Valores
```
💰 Geral: R$ 50,00
   60+: R$ 25,00  ← Em dourado
```

### Card com Apenas Valor Geral
```
💰 R$ 50,00
```

### Card sem Valores
```
(Ícone 💰 não aparece)
```

## Logs no Console

Abra o Console do Navegador (F12) e verifique os logs:

### Ao Criar/Editar:
```
📝 Dados da corrida a serem salvos: {
  titulo: "...",
  valor: 50,
  valor60: 25,
  organizador: "uid...",
  ...
}
```

### Ao Salvar no Service:
```
📝 Criando corrida com dados: {...}
ou
📝 Atualizando corrida com dados: {...}
```

### Se houver erro:
```
❌ Erro detalhado ao criar/atualizar: [detalhes do erro]
```

## Possíveis Problemas

### ❌ Ainda dá erro de permissão

**Solução**: 
1. Verifique se você está logado
2. Verifique se seu usuário está aprovado (status: 'approved')
3. Verifique se você é o organizador da corrida
4. Limpe o cache do navegador (Ctrl+Shift+Delete)
5. Faça logout e login novamente

### ❌ Valor não aparece no card

**Solução**:
1. Recarregue a página (F5)
2. Verifique os logs no console
3. Verifique se o valor foi salvo no Firestore (Firebase Console)

### ❌ Valor aparece errado (ex: "50" em vez de "50,00")

**Solução**:
- Isso é normal, a função `formatPrice()` formata automaticamente
- Verifique se tem 2 casas decimais

## Estrutura no Firestore

Após salvar, verifique no Firebase Console que o documento tem:

```javascript
{
  titulo: "Corrida do Parque",
  data: "2024-03-15T08:00",
  local: "Parque Ibirapuera",
  distancias: ["5K", "10K"],
  valor: 50,              // ✅ Number
  valor60: 25,            // ✅ Number (ou null se não preenchido)
  vagas: 100,             // ✅ Number
  organizador: "uid...",  // ✅ String (UID do usuário)
  organizadorNome: "...", // ✅ String
  createdAt: "...",
  updatedAt: "...",
  participantes: []
}
```

## Status Final

✅ Regras do Firestore corrigidas e deployed
✅ Validação de tipos implementada
✅ Compatibilidade retroativa garantida
✅ Logs de debug adicionados
✅ Documentação completa

## Próximos Passos

Se tudo funcionar:
1. Teste em produção com usuários reais
2. Monitore os logs para identificar problemas
3. Considere adicionar mais validações se necessário

Se ainda houver problemas:
1. Compartilhe os logs do console
2. Verifique o status do usuário no Firestore
3. Verifique as permissões no Firebase Console
