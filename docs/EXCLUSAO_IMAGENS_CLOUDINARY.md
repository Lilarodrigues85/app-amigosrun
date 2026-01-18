# 🗑️ Exclusão de Imagens no Cloudinary

## 🎯 Objetivo

Quando um post com foto for excluído, a imagem também deve ser deletada do Cloudinary para economizar espaço de armazenamento.

## ⚠️ Limitação Técnica

### Problema

A API de exclusão do Cloudinary (**Admin API**) requer **autenticação com API Secret**, que **não pode ser exposta no frontend** por questões de segurança.

```javascript
// ❌ NÃO FUNCIONA no frontend (requer API Secret)
cloudinary.v2.uploader.destroy(public_id, {
  api_key: 'xxx',
  api_secret: 'xxx' // ⚠️ NUNCA exponha isso no frontend!
})
```

### Por que não podemos fazer no frontend?

1. **Segurança**: API Secret dá acesso total à conta Cloudinary
2. **Risco**: Qualquer pessoa poderia deletar todas as imagens
3. **Boas práticas**: Operações destrutivas devem ser feitas no backend

## ✅ Implementação Atual

### O que foi feito

1. **Função para extrair `public_id`** da URL do Cloudinary
2. **Tentativa de exclusão** quando o post é deletado
3. **Logs detalhados** para rastreamento
4. **Não quebra o fluxo** se a exclusão falhar

### Código Implementado

**cloudinaryService.js:**
```javascript
// Extrai o public_id de uma URL
getPublicIdFromUrl(url) {
  // Exemplo: https://res.cloudinary.com/.../posts/abc123.jpg
  // Retorna: posts/abc123
}

// Tenta deletar (mas não funciona sem backend)
async deleteImage(imageUrl) {
  const publicId = this.getPublicIdFromUrl(imageUrl)
  console.warn('⚠️ Exclusão via frontend não é possível')
  return true // Não quebra o fluxo
}
```

**feedService.js:**
```javascript
async excluirPost(userId, postId) {
  const post = // ... buscar post
  
  // Se tem imagem, tentar deletar
  if (post.imageUrl) {
    await cloudinaryService.deleteImage(post.imageUrl)
  }
  
  // Deletar post do Firestore
  await updateDoc(...)
}
```

## 🔧 Soluções Possíveis

### Solução 1: Backend com Firebase Functions (Recomendado)

Criar uma Cloud Function que deleta a imagem do Cloudinary.

#### Vantagens
- ✅ Seguro (API Secret fica no servidor)
- ✅ Automático
- ✅ Confiável

#### Implementação

**1. Instalar dependências:**
```bash
cd functions
npm install cloudinary
```

**2. Criar função (functions/index.js):**
```javascript
const functions = require('firebase-functions')
const cloudinary = require('cloudinary').v2

// Configurar Cloudinary
cloudinary.config({
  cloud_name: functions.config().cloudinary.cloud_name,
  api_key: functions.config().cloudinary.api_key,
  api_secret: functions.config().cloudinary.api_secret
})

// Função para deletar imagem
exports.deleteCloudinaryImage = functions.https.onCall(async (data, context) => {
  // Verificar autenticação
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Usuário não autenticado')
  }
  
  const { publicId } = data
  
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log('Imagem deletada:', result)
    return { success: true, result }
  } catch (error) {
    console.error('Erro ao deletar:', error)
    throw new functions.https.HttpsError('internal', error.message)
  }
})
```

**3. Configurar variáveis:**
```bash
firebase functions:config:set cloudinary.cloud_name="dyxgdeunz"
firebase functions:config:set cloudinary.api_key="YOUR_API_KEY"
firebase functions:config:set cloudinary.api_secret="YOUR_API_SECRET"
```

**4. Deploy:**
```bash
firebase deploy --only functions
```

**5. Chamar do frontend (cloudinaryService.js):**
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions'

async deleteImage(imageUrl) {
  const publicId = this.getPublicIdFromUrl(imageUrl)
  
  if (!publicId) return false
  
  try {
    const functions = getFunctions()
    const deleteCloudinaryImage = httpsCallable(functions, 'deleteCloudinaryImage')
    
    const result = await deleteCloudinaryImage({ publicId })
    console.log('✅ Imagem deletada:', result)
    return true
  } catch (error) {
    console.error('❌ Erro ao deletar:', error)
    return false
  }
}
```

### Solução 2: Backend Próprio (Node.js/Express)

Se você já tem ou planeja ter um backend próprio.

#### Vantagens
- ✅ Controle total
- ✅ Pode adicionar outras funcionalidades

#### Implementação

**1. Endpoint no backend:**
```javascript
// server.js
const express = require('express')
const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

app.delete('/api/images/:publicId', async (req, res) => {
  try {
    // Verificar autenticação do usuário
    const token = req.headers.authorization
    // ... validar token
    
    const publicId = req.params.publicId.replace(/-/g, '/')
    const result = await cloudinary.uploader.destroy(publicId)
    
    res.json({ success: true, result })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})
```

**2. Chamar do frontend:**
```javascript
async deleteImage(imageUrl) {
  const publicId = this.getPublicIdFromUrl(imageUrl)
  
  try {
    const response = await fetch(`/api/images/${publicId.replace(/\//g, '-')}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    })
    
    const result = await response.json()
    return result.success
  } catch (error) {
    console.error('Erro:', error)
    return false
  }
}
```

### Solução 3: Auto-Moderation do Cloudinary

Configurar o Cloudinary para deletar automaticamente imagens não usadas.

#### Vantagens
- ✅ Sem código adicional
- ✅ Automático

#### Desvantagens
- ⚠️ Disponível apenas em planos pagos
- ⚠️ Delay na exclusão (não é imediato)

#### Como Configurar

1. Acesse: https://cloudinary.com/console
2. Settings → Security → **Auto-moderation**
3. Configure regras para deletar imagens não referenciadas

### Solução 4: Script de Limpeza Manual

Criar um script que roda periodicamente para limpar imagens órfãs.

#### Vantagens
- ✅ Simples de implementar
- ✅ Controle total

#### Desvantagens
- ⚠️ Manual ou precisa de cron job
- ⚠️ Não é em tempo real

#### Implementação

**cleanup-cloudinary.js:**
```javascript
const cloudinary = require('cloudinary').v2
const admin = require('firebase-admin')

cloudinary.config({
  cloud_name: 'dyxgdeunz',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

admin.initializeApp()
const db = admin.firestore()

async function cleanupOrphanImages() {
  // 1. Buscar todas as imagens do Cloudinary na pasta "posts"
  const cloudinaryImages = await cloudinary.api.resources({
    type: 'upload',
    prefix: 'posts/',
    max_results: 500
  })
  
  // 2. Buscar todas as URLs de imagens no Firestore
  const postsSnapshot = await db.collection('posts').get()
  const usedImages = new Set()
  
  postsSnapshot.forEach(doc => {
    const posts = doc.data().posts || []
    posts.forEach(post => {
      if (post.imageUrl) {
        usedImages.add(post.imageUrl)
      }
    })
  })
  
  // 3. Deletar imagens não usadas
  for (const image of cloudinaryImages.resources) {
    const imageUrl = image.secure_url
    
    if (!usedImages.has(imageUrl)) {
      console.log('Deletando imagem órfã:', image.public_id)
      await cloudinary.uploader.destroy(image.public_id)
    }
  }
  
  console.log('Limpeza concluída!')
}

cleanupOrphanImages()
```

**Executar:**
```bash
node cleanup-cloudinary.js
```

## 📊 Comparação das Soluções

| Solução | Custo | Complexidade | Tempo Real | Segurança |
|---------|-------|--------------|------------|-----------|
| **Firebase Functions** | Gratuito* | Média | ✅ Sim | ✅ Alta |
| **Backend Próprio** | Variável | Alta | ✅ Sim | ✅ Alta |
| **Auto-Moderation** | Pago | Baixa | ❌ Não | ✅ Alta |
| **Script Manual** | Gratuito | Baixa | ❌ Não | ✅ Alta |

*Firebase Functions tem plano gratuito com limites

## 🎯 Recomendação

### Para Produção: Firebase Functions

**Por quê?**
- ✅ Integração nativa com Firebase
- ✅ Escalável automaticamente
- ✅ Seguro
- ✅ Plano gratuito generoso
- ✅ Fácil de manter

### Para Desenvolvimento: Aceitar Imagens Órfãs

Durante o desenvolvimento, é aceitável deixar imagens órfãs no Cloudinary e fazer limpeza manual periodicamente.

## 📝 Status Atual

### ✅ Implementado

- [x] Função para extrair `public_id` da URL
- [x] Tentativa de exclusão no feedService
- [x] Logs detalhados
- [x] Não quebra o fluxo se falhar

### ⏳ Pendente (Requer Backend)

- [ ] Exclusão real das imagens do Cloudinary
- [ ] Firebase Function para deletar imagens
- [ ] Configuração de API Secret no backend

## 🚀 Próximos Passos

### Opção A: Implementar Firebase Functions (Recomendado)

1. Inicializar Firebase Functions no projeto
2. Criar função `deleteCloudinaryImage`
3. Configurar variáveis de ambiente
4. Fazer deploy
5. Atualizar `cloudinaryService.js` para chamar a função

### Opção B: Aceitar Limitação Temporária

1. Continuar com implementação atual
2. Fazer limpeza manual periodicamente
3. Implementar backend quando necessário

## 📁 Arquivos Modificados

1. `src/services/cloudinaryService.js` - Funções de extração e exclusão
2. `src/services/feedService.js` - Chama exclusão ao deletar post
3. `docs/EXCLUSAO_IMAGENS_CLOUDINARY.md` - Esta documentação

## 🎉 Conclusão

A funcionalidade está **preparada** para exclusão de imagens, mas **requer backend** para funcionar completamente. A implementação atual:

- ✅ Não quebra o sistema
- ✅ Está pronta para integração com backend
- ✅ Tem logs detalhados para debug
- ⚠️ Imagens ficam no Cloudinary até implementar backend

**Recomendação:** Implementar Firebase Functions quando o projeto estiver mais maduro ou quando o armazenamento do Cloudinary começar a ficar limitado.
