# 🚀 Como Fazer Deploy do Firestore

## Pré-requisitos

1. **Firebase CLI instalado**
   ```bash
   npm install -g firebase-tools
   ```

2. **Autenticado no Firebase**
   ```bash
   firebase login
   ```

3. **Projeto configurado**
   ```bash
   firebase use --add
   ```

## Opção 1: Usando o Script PowerShell (Recomendado)

### Windows:

```powershell
.\deploy-firestore.ps1
```

O script vai mostrar um menu interativo:
```
🔥 Deploy do Firestore - Amigos Run
=====================================

Escolha o que deseja fazer:
1. Deploy apenas das Regras (firestore.rules)
2. Deploy apenas dos Índices (firestore.indexes.json)
3. Deploy Completo (Regras + Índices)
4. Cancelar

Digite sua escolha (1-4):
```

**Escolha a opção 3** para fazer o deploy completo.

## Opção 2: Comandos Manuais

### Deploy Completo (Regras + Índices):

```bash
firebase deploy --only firestore
```

### Deploy apenas das Regras:

```bash
firebase deploy --only firestore:rules
```

### Deploy apenas dos Índices:

```bash
firebase deploy --only firestore:indexes
```

## ✅ Verificando o Deploy

### 1. No Terminal

Você deve ver algo como:

```
=== Deploying to 'seu-projeto'...

i  deploying firestore
i  firestore: checking firestore.rules for compilation errors...
✔  firestore: rules file firestore.rules compiled successfully
i  firestore: uploading rules firestore.rules...
i  firestore: checking firestore.indexes.json for compilation errors...
✔  firestore: indexes file firestore.indexes.json compiled successfully
i  firestore: uploading indexes firestore.indexes.json...
✔  firestore: released rules firestore.rules to cloud.firestore
✔  firestore: released indexes in firestore.indexes.json successfully

✔  Deploy complete!
```

### 2. No Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Clique na aba **Regras**
   - Verifique se as regras para `posts` estão lá
5. Clique na aba **Índices**
   - Verifique se os 3 índices para `posts` estão sendo criados
   - Status pode ser "Criando..." por alguns minutos

## 🧪 Testando Após o Deploy

### 1. Teste Criar Post

1. Abra o app e faça login
2. Vá para a Home
3. Digite algo no campo de post
4. Clique em "Publicar"
5. Verifique no console do navegador:
   ```
   ✅ [feedService] Post criado com ID: xyz123
   ✅ [Home] Post criado com sucesso!
   ```

### 2. Verificar no Firestore

1. No Firebase Console, vá em **Firestore Database**
2. Procure a collection `posts`
3. Você deve ver o documento criado com:
   - userId
   - tipo: "text"
   - conteudo: "seu texto"
   - timestamp
   - likes: 0

### 3. Teste Tempo Real

1. Abra o app em duas abas
2. Crie um post em uma aba
3. O post deve aparecer automaticamente na outra aba

## ❌ Problemas Comuns

### Erro: "Firebase CLI not found"

**Solução:**
```bash
npm install -g firebase-tools
```

### Erro: "Not logged in"

**Solução:**
```bash
firebase login
```

### Erro: "No project active"

**Solução:**
```bash
firebase use --add
# Selecione seu projeto da lista
```

### Erro: "Permission denied"

**Causa:** Você não tem permissão no projeto Firebase

**Solução:**
- Verifique se está usando o projeto correto: `firebase projects:list`
- Peça ao dono do projeto para adicionar você como colaborador

### Índices demorando muito

**Normal:** Índices podem levar 5-10 minutos para serem criados

**Verificar status:**
1. Firebase Console > Firestore Database > Índices
2. Status deve mudar de "Criando..." para "Ativado"

### Posts não aparecem após deploy

**Verificar:**
1. Regras foram deployadas? (Firebase Console > Regras)
2. Índices foram criados? (Firebase Console > Índices)
3. Há erros no console do navegador?
4. Usuário está autenticado?

## 📊 Estrutura Deployada

### Regras (firestore.rules):

```javascript
match /posts/{postId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow update, delete: if request.auth != null && 
    request.auth.uid == resource.data.userId;
}
```

### Índices (firestore.indexes.json):

1. **timestamp (desc)** - Para buscar posts recentes
2. **userId + timestamp (desc)** - Para posts de um usuário
3. **tipo + timestamp (desc)** - Para filtrar por tipo

## 🎯 Próximos Passos

Após o deploy bem-sucedido:

1. ✅ Teste criar posts
2. ✅ Teste visualizar posts
3. ✅ Teste tempo real (múltiplas abas)
4. ✅ Verifique no Firebase Console
5. ✅ Monitore erros no console do navegador

## 📚 Documentação Adicional

- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firestore Indexes](https://firebase.google.com/docs/firestore/query-data/indexing)

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Verifique os logs no console do navegador
2. Verifique os logs do Firebase CLI
3. Consulte a documentação: `docs/FEED_POSTS_IMPLEMENTADO.md`
4. Verifique o Firebase Console para erros
