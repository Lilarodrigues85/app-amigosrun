# 📊 Nova Estrutura de Posts - Um Documento por Usuário

## 🎯 Mudança Implementada

### Antes:
- Cada post era um documento separado na collection `posts`
- Muitos documentos na collection
- Difícil gerenciar posts de um usuário específico

### Depois:
- **Um documento por usuário** na collection `posts`
- O ID do documento é o `userId`
- Todos os posts do usuário ficam em um array `posts[]` dentro do documento
- Mais organizado e eficiente

## 📁 Nova Estrutura no Firestore

### Collection: `posts`

```
posts/
  ├── {userId1}/              ← Documento do usuário 1
  │   ├── userId: "userId1"
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   └── posts: [            ← Array de posts
  │       {
  │         id: "1705489200000",
  │         tipo: "text",
  │         conteudo: "Meu primeiro post!",
  │         timestamp: "2025-01-17T10:00:00Z",
  │         likes: 0
  │       },
  │       {
  │         id: "1705489300000",
  │         tipo: "text",
  │         conteudo: "Meu segundo post!",
  │         timestamp: "2025-01-17T10:05:00Z",
  │         likes: 0
  │       }
  │     ]
  │
  ├── {userId2}/              ← Documento do usuário 2
  │   ├── userId: "userId2"
  │   ├── createdAt: timestamp
  │   ├── updatedAt: timestamp
  │   └── posts: [...]
  │
  └── ...
```

## 📋 Estrutura de um Documento

```javascript
{
  userId: "abc123xyz",           // UID do usuário (mesmo que o ID do documento)
  createdAt: "2025-01-17T10:00:00Z",  // Quando o primeiro post foi criado
  updatedAt: "2025-01-17T10:05:00Z",  // Última atualização
  posts: [                       // Array de posts do usuário
    {
      id: "1705489200000",       // ID único do post (timestamp)
      tipo: "text",              // Tipo: text, confirmacao, foto
      conteudo: "Meu post...",   // Conteúdo do post
      timestamp: "2025-01-17T10:00:00Z",  // Data do post
      likes: 0,                  // Número de curtidas
      corridaId: null            // ID da corrida (opcional)
    }
  ]
}
```

## 🔄 Como Funciona

### 1. Criar Primeiro Post
```javascript
// Usuário cria seu primeiro post
await feedService.criarPost(userId, 'text', 'Meu primeiro post!')

// Firestore cria documento:
posts/userId123 = {
  userId: "userId123",
  createdAt: "2025-01-17T10:00:00Z",
  updatedAt: "2025-01-17T10:00:00Z",
  posts: [
    {
      id: "1705489200000",
      tipo: "text",
      conteudo: "Meu primeiro post!",
      timestamp: "2025-01-17T10:00:00Z",
      likes: 0
    }
  ]
}
```

### 2. Criar Segundo Post
```javascript
// Usuário cria outro post
await feedService.criarPost(userId, 'text', 'Meu segundo post!')

// Firestore adiciona ao array existente:
posts/userId123 = {
  userId: "userId123",
  createdAt: "2025-01-17T10:00:00Z",
  updatedAt: "2025-01-17T10:05:00Z",  // ← Atualizado
  posts: [
    {
      id: "1705489200000",
      tipo: "text",
      conteudo: "Meu primeiro post!",
      timestamp: "2025-01-17T10:00:00Z",
      likes: 0
    },
    {
      id: "1705489300000",  // ← Novo post
      tipo: "text",
      conteudo: "Meu segundo post!",
      timestamp: "2025-01-17T10:05:00Z",
      likes: 0
    }
  ]
}
```

### 3. Buscar Todos os Posts
```javascript
// feedService busca todos os documentos
// Extrai posts de cada documento
// Ordena por timestamp (mais recente primeiro)
// Retorna lista unificada de posts
```

## 🔒 Regras de Segurança

```javascript
match /posts/{userId} {
  allow read: if true;  // Qualquer um pode ler
  allow create: if request.auth != null && request.auth.uid == userId;  // Apenas o próprio usuário pode criar
  allow update: if request.auth != null && request.auth.uid == userId;  // Apenas o próprio usuário pode atualizar
  allow delete: if request.auth != null && request.auth.uid == userId;  // Apenas o próprio usuário pode deletar
}
```

## ✅ Vantagens

1. **Organização**: Todos os posts de um usuário em um só lugar
2. **Eficiência**: Menos documentos na collection
3. **Facilidade**: Fácil buscar todos os posts de um usuário específico
4. **Segurança**: Cada usuário só pode modificar seu próprio documento
5. **Escalabilidade**: Melhor performance para queries

## ⚠️ Limitações

1. **Limite de Array**: Firestore tem limite de 1MB por documento
   - Solução: Implementar paginação ou arquivamento de posts antigos
2. **Atomic Updates**: Todos os posts do usuário estão no mesmo documento
   - Solução: Usar `arrayUnion` para adicionar posts atomicamente

## 🧪 Testando

### 1. Criar Post
```javascript
// No console do navegador
await feedService.criarPost(user.uid, 'text', 'Teste de post!')
```

### 2. Verificar no Firebase Console
1. Acesse: https://console.firebase.google.com/project/app-amigosrun/firestore
2. Vá em collection `posts`
3. Procure o documento com seu `userId`
4. Veja o array `posts` com seus posts

### 3. Criar Múltiplos Posts
```javascript
// Criar vários posts
await feedService.criarPost(user.uid, 'text', 'Post 1')
await feedService.criarPost(user.uid, 'text', 'Post 2')
await feedService.criarPost(user.uid, 'text', 'Post 3')

// Todos devem estar no mesmo documento!
```

## 📊 Exemplo Real

### Firebase Console:
```
posts/
  └── abc123xyz/
      {
        "userId": "abc123xyz",
        "createdAt": "2025-01-17T10:00:00Z",
        "updatedAt": "2025-01-17T10:15:00Z",
        "posts": [
          {
            "id": "1705489200000",
            "tipo": "text",
            "conteudo": "Acabei de completar 10K! 🏃‍♀️",
            "timestamp": "2025-01-17T10:00:00Z",
            "likes": 0
          },
          {
            "id": "1705489500000",
            "tipo": "text",
            "conteudo": "Treino matinal no parque ☀️",
            "timestamp": "2025-01-17T10:05:00Z",
            "likes": 0
          },
          {
            "id": "1705489900000",
            "tipo": "confirmacao",
            "conteudo": "Confirmei presença na corrida!",
            "timestamp": "2025-01-17T10:15:00Z",
            "likes": 0,
            "corridaId": "corrida123"
          }
        ]
      }
```

## 🔍 Logs Esperados

### Criar Primeiro Post:
```
🔵 [feedService] Criando post
📦 [feedService] Dados: {userId: "abc123", tipo: "text", conteudo: "..."}
💾 [feedService] Novo post: {id: "1705489200000", ...}
📝 [feedService] Documento não existe, criando novo
✅ [feedService] Post criado com sucesso!
```

### Criar Segundo Post:
```
🔵 [feedService] Criando post
📦 [feedService] Dados: {userId: "abc123", tipo: "text", conteudo: "..."}
💾 [feedService] Novo post: {id: "1705489300000", ...}
📝 [feedService] Documento existe, adicionando post ao array
✅ [feedService] Post criado com sucesso!
```

### Carregar Posts:
```
🔵 [feedService] Iniciando listener de posts
📦 [feedService] Snapshot recebido, docs: 3
📄 [feedService] Documento: abc123 {...}
📄 [feedService] Documento: xyz456 {...}
📄 [feedService] Documento: def789 {...}
📊 [feedService] Total de posts extraídos: 15
✅ [feedService] Posts processados: 15
```

## 🎯 Próximos Passos

1. ✅ Testar criar posts
2. ✅ Verificar no Firebase Console
3. ✅ Testar múltiplos posts do mesmo usuário
4. ✅ Verificar que todos ficam no mesmo documento
5. ✅ Testar visualização na Home

## 📚 Arquivos Modificados

- ✅ `src/services/feedService.js` - Nova lógica de salvar/buscar
- ✅ `src/views/Home.vue` - Ajuste no processamento de posts
- ✅ `firestore.rules` - Novas regras de segurança
- ✅ `firestore.indexes.json` - Índices removidos (não necessários)

## 🚀 Deploy Realizado

✅ Regras deployadas
✅ Índices antigos removidos
✅ Pronto para uso!
