# 🔍 Debug: Posts Não Aparecem

## ✅ Correção Aplicada

Mudei `post.content` para `post.conteudo` no template, pois o campo no Firestore é `conteudo`.

## 🧪 Como Verificar

### 1. Abra o Console do Navegador (F12)

### 2. Limpe o Console

### 3. Recarregue a Página

### 4. Procure pelos Logs:

#### Ao Carregar a Página:
```
🔵 [Home] Iniciando listener de posts
🔵 [feedService] Iniciando listener de posts, limite: 50
📦 [feedService] Snapshot recebido, docs: X
📄 [feedService] Documento: {userId} {...}
📊 [feedService] Total de posts extraídos: X
✅ [feedService] Posts processados: X
📦 [Home] Posts recebidos: X
📋 [Home] Posts brutos: [...]
```

#### Ao Criar um Post:
```
🔵 [Home] Criando post
📦 [Home] Dados do post: {userId: "...", content: "..."}
🔵 [feedService] Criando post
💾 [feedService] Novo post: {...}
📝 [feedService] Documento existe/não existe...
✅ [feedService] Post criado com sucesso!
✅ [Home] Post criado com sucesso!
```

## 🔍 Verificações

### 1. Verificar se o Post Foi Salvo

**No Console do Navegador:**
```javascript
// Cole isso no console
console.log('Posts atuais:', posts.value)
```

**Ou vá no Firebase Console:**
1. https://console.firebase.google.com/project/app-amigosrun/firestore
2. Collection `posts`
3. Procure seu documento (userId)
4. Veja o array `posts`

### 2. Verificar Estrutura do Post

**No console, procure por:**
```
📋 [Home] Posts brutos: [
  {
    "id": "1705489200000",
    "tipo": "text",
    "conteudo": "SEU TEXTO AQUI",  ← Deve ter o texto
    "timestamp": "2025-01-17...",
    "likes": 0,
    "userId": "...",
    "docId": "..."
  }
]
```

### 3. Verificar Posts Enriquecidos

**No console, procure por:**
```
📋 [Home] Posts finais: [
  {
    "id": "1705489200000",
    "tipo": "text",
    "conteudo": "SEU TEXTO AQUI",  ← Deve ter o texto
    "timestamp": "2025-01-17...",
    "likes": 0,
    "userId": "...",
    "docId": "...",
    "user": {
      "name": "Seu Nome",
      "photoURL": "..."
    },
    "createdAt": "..."
  }
]
```

## ❌ Problemas Comuns

### Problema 1: Post Criado Mas Não Aparece

**Sintomas:**
- Mensagem "Post publicado! ✅"
- Mas não aparece na lista

**Verificar:**
1. Abra o console e procure por erros
2. Verifique se o listener está ativo:
   ```
   🔵 [feedService] Iniciando listener de posts
   ```
3. Verifique se o snapshot foi recebido:
   ```
   📦 [feedService] Snapshot recebido, docs: X
   ```

**Solução:**
- Recarregue a página (F5)
- Verifique se há erros de permissão

### Problema 2: Elemento Vazio (Sem Texto)

**Sintomas:**
- Card do post aparece
- Mas sem texto dentro

**Causa:**
- Campo `conteudo` está vazio ou undefined

**Verificar no console:**
```
📋 [Home] Posts finais: [
  {
    "conteudo": undefined  ← PROBLEMA!
  }
]
```

**Solução:**
- Verifique se o post foi salvo corretamente no Firestore
- Vá no Firebase Console e veja o documento

### Problema 3: Nenhum Post Aparece

**Sintomas:**
- Mensagem "Nenhum post ainda"
- Mas você já criou posts

**Verificar:**
1. Console do navegador:
   ```
   📦 [Home] Posts recebidos: 0  ← PROBLEMA!
   ```

2. Firebase Console:
   - Collection `posts` existe?
   - Tem documentos?
   - Documentos têm array `posts`?

**Solução:**
- Verifique regras do Firestore
- Verifique se fez deploy: `firebase deploy --only firestore:rules`

## 🧪 Teste Completo

### Passo 1: Limpar Tudo
```javascript
// No console do navegador
localStorage.clear()
location.reload()
```

### Passo 2: Fazer Login

### Passo 3: Ir para Home

### Passo 4: Criar Post
1. Digite: "Teste de post 123"
2. Clique em "Publicar"
3. Aguarde mensagem de sucesso

### Passo 5: Verificar Logs
Procure no console:
```
✅ [feedService] Post criado com sucesso!
📦 [feedService] Posts atualizados: 1
📋 [Home] Posts finais: [
  {
    "conteudo": "Teste de post 123"  ← DEVE APARECER!
  }
]
```

### Passo 6: Verificar na Tela
- Card do post deve aparecer
- Com o texto "Teste de post 123"
- Com seu nome
- Com sua foto

## 🔧 Comandos Úteis no Console

### Ver posts atuais:
```javascript
console.log('Posts:', posts.value)
```

### Ver usuário atual:
```javascript
console.log('User:', user.value)
```

### Forçar reload dos posts:
```javascript
location.reload()
```

## 📊 Estrutura Esperada no Firestore

```javascript
// Collection: posts
// Document ID: {seu-userId}
{
  "userId": "abc123xyz",
  "createdAt": "2025-01-17T10:00:00Z",
  "updatedAt": "2025-01-17T10:00:00Z",
  "posts": [
    {
      "id": "1705489200000",
      "tipo": "text",
      "conteudo": "Teste de post 123",  ← SEU TEXTO
      "timestamp": "2025-01-17T10:00:00Z",
      "likes": 0
    }
  ]
}
```

## 🆘 Se Nada Funcionar

1. **Copie TODOS os logs do console**
2. **Tire screenshot do Firebase Console** (collection posts)
3. **Verifique se fez deploy das regras:**
   ```bash
   firebase deploy --only firestore:rules
   ```
4. **Tente criar um post e copie os logs**

## ✅ Checklist

- [ ] Console aberto (F12)
- [ ] Logs aparecem ao criar post
- [ ] Post salvo no Firebase Console
- [ ] Campo `conteudo` tem o texto
- [ ] Regras deployadas
- [ ] Página recarregada após correção
- [ ] Nenhum erro no console
