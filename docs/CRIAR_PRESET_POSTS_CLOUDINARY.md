# 📝 Como Criar Upload Preset para Posts no Cloudinary

## 🎯 Objetivo

Criar um segundo Upload Preset chamado `amigos-run-posts` para que as imagens dos posts sejam salvas na pasta `posts/` sem afetar o preset existente `amigos-run` que salva em `profiles/`.

## 📋 Passo a Passo

### 1. Acessar o Cloudinary Console

1. Acesse: https://cloudinary.com/console
2. Faça login com sua conta

### 2. Ir para Upload Settings

1. No menu lateral, clique em **⚙️ Settings** (Configurações)
2. Clique na aba **Upload**
3. Role até a seção **Upload presets**

### 3. Adicionar Novo Preset

1. Clique no botão **Add upload preset** (ou **+ Add preset**)
2. Uma janela de configuração será aberta

### 4. Configurar o Novo Preset

Preencha os campos conforme abaixo:

#### Configurações Básicas

**Preset name (Nome do preset):**
```
amigos-run-posts
```

**Signing Mode (Modo de assinatura):**
```
Unsigned (Não assinado)
```
⚠️ **IMPORTANTE:** Deve ser "Unsigned" para funcionar do frontend!

#### Configurações de Pasta

**Folder (Pasta):**
```
[DEIXAR VAZIO]
```
⚠️ **IMPORTANTE:** NÃO preencha este campo! Deixe em branco para que o código possa definir a pasta dinamicamente.

#### Outras Configurações (Opcional)

Você pode deixar as outras configurações padrão ou ajustar conforme necessário:

- **Unique filename:** ✅ Ativado (recomendado)
- **Overwrite:** ❌ Desativado (recomendado)
- **Use filename:** ❌ Desativado (recomendado)
- **Auto tagging:** Opcional
- **Allowed formats:** Deixe vazio (aceita todos) ou especifique: `jpg,png,webp`

### 5. Salvar o Preset

1. Role até o final da página
2. Clique em **Save** (Salvar)
3. Aguarde a confirmação

### 6. Verificar se Foi Criado

1. Na lista de Upload presets, você deve ver:
   - ✅ `amigos-run` (existente - para profiles)
   - ✅ `amigos-run-posts` (novo - para posts)

## 🔧 Configuração no Código

O código já está configurado! Apenas certifique-se de que o arquivo `.env` tem:

```env
VITE_CLOUDINARY_CLOUD_NAME=dyxgdeunz
VITE_CLOUDINARY_UPLOAD_PRESET=amigos-run
VITE_CLOUDINARY_UPLOAD_PRESET_POSTS=amigos-run-posts
```

## 🎨 Como Funciona

### Upload de Avatar (Perfil)

```javascript
// Usa preset: amigos-run
// Vai para pasta: profiles/
await cloudinaryService.uploadImage(file, 'profiles')
```

### Upload de Foto do Post

```javascript
// Usa preset: amigos-run-posts
// Vai para pasta: posts/
await cloudinaryService.uploadPostImage(file)
```

### Lógica no Código

```javascript
// No cloudinaryService.js
const preset = folder === 'posts' 
  ? CLOUDINARY_UPLOAD_PRESET_POSTS  // amigos-run-posts
  : CLOUDINARY_UPLOAD_PRESET         // amigos-run

formData.append('upload_preset', preset)
formData.append('folder', folder)
```

## 📊 Estrutura Final no Cloudinary

```
Media Library
├── profiles/
│   ├── avatar1.jpg  ← Upload com preset "amigos-run"
│   ├── avatar2.jpg
│   └── ...
└── posts/
    ├── post1.jpg    ← Upload com preset "amigos-run-posts"
    ├── post2.jpg
    └── ...
```

## ✅ Teste

Após criar o preset:

### 1. Reiniciar o Servidor de Desenvolvimento

```bash
# Parar o servidor (Ctrl+C)
# Iniciar novamente
npm run dev
```

⚠️ **IMPORTANTE:** Reiniciar é necessário para carregar a nova variável do `.env`!

### 2. Testar Upload de Foto no Post

1. Abra a aplicação
2. Vá para a página Home
3. Clique em 📷 Foto
4. Selecione uma imagem
5. Escreva algo (opcional)
6. Clique em Publicar

### 3. Verificar no Console

Você deve ver:

```javascript
🔄 [Cloudinary] Enviando para: {
  uploadPreset: "amigos-run-posts", // ✅ Preset correto
  folder: "posts"
}

✅ [Cloudinary] Upload bem-sucedido: {
  folder: "posts", // ✅ Pasta correta!
  url: "https://res.cloudinary.com/.../posts/..."
}
```

### 4. Verificar no Cloudinary

1. Acesse: https://cloudinary.com/console/media_library
2. Você deve ver a pasta **posts** com a imagem
3. A pasta **profiles** continua com os avatares

## ❌ Troubleshooting

### Erro: "Invalid upload preset"

**Causa:** O preset `amigos-run-posts` não foi criado ou o nome está errado.

**Solução:**
1. Verifique se criou o preset no Cloudinary
2. Verifique se o nome está exatamente: `amigos-run-posts`
3. Verifique se está como "Unsigned"

### Imagem Ainda Vai para "profiles"

**Causa:** O servidor não foi reiniciado após adicionar a variável no `.env`.

**Solução:**
1. Pare o servidor (Ctrl+C)
2. Inicie novamente: `npm run dev`

### Erro: "Folder parameter not allowed"

**Causa:** O preset tem uma pasta padrão configurada.

**Solução:**
1. Edite o preset `amigos-run-posts` no Cloudinary
2. Certifique-se de que o campo **Folder** está vazio
3. Salve novamente

## 🎉 Resultado Final

Após seguir todos os passos:

- ✅ Fotos de perfil vão para `profiles/`
- ✅ Fotos de posts vão para `posts/`
- ✅ Cada tipo usa seu próprio preset
- ✅ Não afeta uploads existentes
- ✅ Organização perfeita no Cloudinary

## 📸 Capturas de Tela (Referência)

### Tela de Criar Preset

```
┌─────────────────────────────────────┐
│ Add upload preset                   │
├─────────────────────────────────────┤
│ Preset name: amigos-run-posts       │
│ Signing Mode: ⚪ Unsigned            │
│ Folder: [deixar vazio]              │
│ Unique filename: ☑️                  │
│ Overwrite: ☐                        │
│                                     │
│           [Cancel]  [Save]          │
└─────────────────────────────────────┘
```

### Lista de Presets

```
Upload presets
┌────────────────────────────────────┐
│ ✅ amigos-run (Unsigned)           │
│    Folder: profiles                │
├────────────────────────────────────┤
│ ✅ amigos-run-posts (Unsigned)     │
│    Folder: (none)                  │
└────────────────────────────────────┘
```

## 📁 Arquivos Modificados

1. `src/services/cloudinaryService.js` - Lógica para usar preset diferente
2. `.env` - Adicionada variável `VITE_CLOUDINARY_UPLOAD_PRESET_POSTS`
3. `docs/CRIAR_PRESET_POSTS_CLOUDINARY.md` - Este guia

## 🚀 Próximos Passos

1. ✅ Criar o preset `amigos-run-posts` no Cloudinary
2. ✅ Reiniciar o servidor de desenvolvimento
3. ✅ Testar upload de foto no post
4. ✅ Verificar se foi para a pasta `posts/`
5. 🎉 Pronto para usar!
