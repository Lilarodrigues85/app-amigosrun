# 🔧 Correção: Pasta "posts" no Cloudinary

## ❌ Problemas Identificados

### 1. Erro 400 na URL da Imagem
```
GET https://res.cloudinary.com/.../w_800,h_600,c_limit,f_auto,q_auto,g_auto/...png 400 (Bad Request)
```

**Causa:** O parâmetro `g_auto` (gravity: auto) não é válido para todos os tipos de transformação.

**Solução:** Removido `g_auto` das transformações de posts. Gravity só é usado em avatares com `g_face`.

### 2. Imagem Vai para Pasta "profiles" ao Invés de "posts"

**Causa Provável:** O Upload Preset `amigos-run` no Cloudinary pode ter uma pasta padrão configurada.

## ✅ Correções Aplicadas

### 1. Removido `gravity` das Transformações de Posts

**Antes:**
```javascript
getPostImageUrl(url, width = 800, height = 600) {
  return this.getOptimizedUrl(url, width, height, {
    crop: 'limit',
    quality: 'auto',
    format: 'auto',
    gravity: 'auto' // ❌ Causava erro 400
  })
}
```

**Depois:**
```javascript
getPostImageUrl(url, width = 800, height = 600) {
  return this.getOptimizedUrl(url, width, height, {
    crop: 'limit',
    quality: 'auto',
    format: 'auto'
    // ✅ SEM gravity
  })
}
```

### 2. Gravity Opcional na Função Base

```javascript
getOptimizedUrl(url, width = 400, height = 400, options = {}) {
  const {
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = null // ✅ Opcional
  } = options
  
  let transformation = `w_${width},h_${height},c_${crop},f_${format},q_${quality}`
  
  // Adiciona gravity apenas se fornecido
  if (gravity) {
    transformation += `,g_${gravity}`
  }
  
  return url.replace('/upload/', `/upload/${transformation}/`)
}
```

### 3. Logs Detalhados para Debug

Adicionados logs para verificar qual pasta está sendo usada:

```javascript
console.log('✅ [Cloudinary] Upload bem-sucedido:', {
  url: data.secure_url,
  public_id: data.public_id,
  folder: data.folder, // ✅ Mostra a pasta real
  format: data.format,
  width: data.width,
  height: data.height,
  bytes: data.bytes
})

// Verificar se a pasta está correta
if (data.folder !== folder) {
  console.warn('⚠️ [Cloudinary] ATENÇÃO: Pasta diferente da solicitada!', {
    solicitada: folder,
    recebida: data.folder
  })
}
```

## 🔍 Como Verificar o Problema da Pasta

### Teste o Upload Novamente

1. Abra o console do navegador (F12)
2. Faça upload de uma foto no post
3. Procure por este log:

```javascript
✅ [Cloudinary] Upload bem-sucedido: {
  url: "...",
  public_id: "...",
  folder: "???", // ← Qual pasta aparece aqui?
  ...
}
```

### Cenários Possíveis

**Cenário 1: Pasta Correta**
```javascript
folder: "posts" // ✅ Funcionou!
```

**Cenário 2: Pasta Errada**
```javascript
folder: "profiles" // ❌ Upload Preset tem pasta padrão
```

**Cenário 3: Sem Pasta**
```javascript
folder: undefined // ❌ Parâmetro folder não foi aceito
```

## 🛠️ Solução para Problema da Pasta

### Opção 1: Verificar Upload Preset no Cloudinary (Recomendado)

1. Acesse: https://cloudinary.com/console
2. Vá em **Settings** → **Upload**
3. Encontre o preset: `amigos-run`
4. Verifique se há uma **Folder** configurada
5. Se houver, **remova** ou deixe em branco

**Configuração Correta:**
```
Upload Preset: amigos-run
Folder: [deixar vazio]
```

### Opção 2: Criar Novo Upload Preset para Posts

Se não conseguir modificar o preset existente:

1. Acesse: https://cloudinary.com/console
2. Settings → Upload → **Add upload preset**
3. Configure:
   ```
   Preset name: amigos-run-posts
   Signing Mode: Unsigned
   Folder: [deixar vazio]
   ```
4. Salve

5. Atualize o código para usar preset diferente para posts:

```javascript
// No .env
VITE_CLOUDINARY_UPLOAD_PRESET=amigos-run
VITE_CLOUDINARY_UPLOAD_PRESET_POSTS=amigos-run-posts

// No cloudinaryService.js
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'amigos-run'
const CLOUDINARY_UPLOAD_PRESET_POSTS = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_POSTS || 'amigos-run-posts'

async uploadImage(file, folder = 'profiles') {
  const formData = new FormData()
  formData.append('file', file)
  
  // Usar preset diferente para posts
  const preset = folder === 'posts' ? CLOUDINARY_UPLOAD_PRESET_POSTS : CLOUDINARY_UPLOAD_PRESET
  formData.append('upload_preset', preset)
  formData.append('folder', folder)
  
  // ...
}
```

### Opção 3: Usar `public_id` com Prefixo

Se o parâmetro `folder` não funcionar, use `public_id` com prefixo:

```javascript
async uploadImage(file, folder = 'profiles') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  
  // Usar public_id ao invés de folder
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).substring(7)
  formData.append('public_id', `${folder}/${timestamp}_${randomStr}`)
  
  // ...
}
```

## 📊 Comparação das Opções

| Opção | Vantagens | Desvantagens |
|-------|-----------|--------------|
| **1. Limpar Folder do Preset** | ✅ Mais simples<br>✅ Usa mesmo preset | ⚠️ Precisa acesso ao Cloudinary |
| **2. Criar Novo Preset** | ✅ Não afeta preset existente<br>✅ Mais controle | ⚠️ Precisa configurar .env<br>⚠️ Mais complexo |
| **3. Usar public_id** | ✅ Funciona sempre<br>✅ Não precisa mudar preset | ⚠️ Estrutura diferente no Cloudinary |

## 🎯 Recomendação

**Melhor solução:** Opção 1 - Limpar a pasta padrão do Upload Preset

1. Acesse o Cloudinary
2. Vá em Settings → Upload
3. Edite o preset `amigos-run`
4. Remova qualquer pasta configurada
5. Salve

Isso permitirá que o parâmetro `folder` funcione corretamente.

## ✅ Teste Final

Após aplicar a solução, teste:

1. Faça upload de uma foto de perfil
   - Deve ir para: `profiles/`
   
2. Faça upload de uma foto no post
   - Deve ir para: `posts/`

3. Verifique no console:
   ```javascript
   ✅ [Cloudinary] Upload bem-sucedido: {
     folder: "posts" // ✅ Correto!
   }
   ```

4. Verifique no Cloudinary Console:
   - Media Library → Deve ver pastas `profiles` e `posts`

## 📁 Estrutura Esperada no Cloudinary

```
Media Library
├── profiles/
│   ├── user1_avatar.jpg
│   ├── user2_avatar.jpg
│   └── ...
└── posts/
    ├── post1_image.jpg
    ├── post2_image.jpg
    └── ...
```

## 🎉 Resultado

Após as correções:

1. ✅ Erro 400 resolvido (removido `g_auto`)
2. ✅ Logs detalhados para debug
3. ✅ Instruções para corrigir problema da pasta
4. ✅ Múltiplas opções de solução

**Próximo passo:** Verificar o Upload Preset no Cloudinary e aplicar a solução recomendada.

## 📁 Arquivos Modificados

1. `src/services/cloudinaryService.js` - Removido gravity, adicionados logs
2. `docs/CLOUDINARY_PASTA_POSTS_FIX.md` - Esta documentação
