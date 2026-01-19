# 🏃 Cloudinary Preset para Corridas

## 📋 Configuração Implementada

### Preset Específico
- **Nome do Preset**: `corridas-run`
- **Pasta no Cloudinary**: `corridas/`
- **Uso**: Upload de imagens de eventos de corrida

---

## 🔧 Configuração no Cloudinary

### 1. Criar Unsigned Upload Preset

Acesse: https://console.cloudinary.com/settings/upload

1. **Clique em "Add upload preset"**
2. **Configure:**
   ```
   Preset name: corridas-run
   Signing Mode: Unsigned
   Folder: corridas
   ```

3. **Transformações Recomendadas:**
   ```
   Format: Auto (f_auto)
   Quality: Auto (q_auto)
   Max Width: 1920px
   Max Height: 1080px
   Crop: limit
   ```

4. **Configurações Adicionais:**
   - ✅ Unique filename: true
   - ✅ Overwrite: false
   - ✅ Auto tagging: true (opcional)
   - ✅ Backup: true (opcional)

5. **Clique em "Save"**

---

## 📁 Estrutura de Pastas no Cloudinary

```
dyxgdeunz/
├── profiles/          (preset: amigos-run)
│   └── avatares dos usuários
├── posts/             (preset: amigos-run-posts)
│   └── imagens dos posts sociais
└── corridas/          (preset: corridas-run)
    └── imagens dos eventos de corrida
```

---

## 💻 Implementação no Código

### Variável de Ambiente (.env)
```env
VITE_CLOUDINARY_UPLOAD_PRESET_CORRIDAS=corridas-run
```

### Serviço (cloudinaryService.js)
```javascript
const CLOUDINARY_UPLOAD_PRESET_CORRIDAS = 
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_CORRIDAS || 'corridas-run'

// Método específico para upload de corridas
async uploadCorridaImage(file) {
  return this.uploadImage(file, 'corridas')
}

// Método para otimizar imagens de corridas
getCorridaImageUrl(url, width = 1200, height = 600) {
  return this.getOptimizedUrl(url, width, height, {
    crop: 'fill',
    quality: 'auto',
    format: 'auto'
  })
}
```

### Uso no Componente (CorridaForm.vue)
```javascript
import { cloudinaryService } from '@/services/cloudinaryService'

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    uploading.value = true
    // Usa o método específico para corridas
    const imageUrl = await cloudinaryService.uploadCorridaImage(file)
    form.value.imagem = imageUrl
    showMessage('Imagem enviada com sucesso!')
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    uploading.value = false
  }
}
```

---

## 🎨 Otimizações de Imagem

### Tamanhos Recomendados

**Card de Corrida (Lista)**
```javascript
// 350x200px - Thumbnail
cloudinaryService.getCorridaImageUrl(url, 350, 200)
```

**Modal/Detalhes**
```javascript
// 1200x600px - Full size
cloudinaryService.getCorridaImageUrl(url, 1200, 600)
```

**Preview no Formulário**
```javascript
// 800x400px - Preview
cloudinaryService.getCorridaImageUrl(url, 800, 400)
```

### URLs Geradas

**Original:**
```
https://res.cloudinary.com/dyxgdeunz/image/upload/v1234567890/corridas/abc123.jpg
```

**Otimizada (350x200):**
```
https://res.cloudinary.com/dyxgdeunz/image/upload/w_350,h_200,c_fill,f_auto,q_auto/v1234567890/corridas/abc123.jpg
```

---

## 📊 Validações

### Frontend (cloudinaryService.js)
```javascript
validateFile(file) {
  const maxSize = 5 * 1024 * 1024 // 5MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  
  if (!file) {
    throw new Error('Nenhum arquivo selecionado')
  }
  
  if (file.size > maxSize) {
    throw new Error(`Arquivo muito grande. Máximo 5MB`)
  }
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Tipo de arquivo não suportado. Use JPG, PNG ou WebP')
  }
}
```

### Cloudinary (Preset Settings)
- Max file size: 10MB
- Allowed formats: jpg, png, webp
- Max dimensions: 1920x1080

---

## 🔐 Segurança

### Unsigned Upload
- ✅ Não expõe API Secret no frontend
- ✅ Preset configurado no Cloudinary Dashboard
- ✅ Restrições aplicadas no servidor Cloudinary

### Boas Práticas
- ✅ Validação de tipo de arquivo no frontend
- ✅ Validação de tamanho no frontend
- ✅ Pasta específica para organização
- ✅ Nomes únicos para evitar sobrescrita

---

## 📈 Benefícios

### Organização
- ✅ Imagens de corridas separadas em pasta própria
- ✅ Fácil gerenciamento no Cloudinary Dashboard
- ✅ Backup e versionamento automático

### Performance
- ✅ Otimização automática de formato (WebP quando suportado)
- ✅ Compressão inteligente (quality: auto)
- ✅ CDN global para carregamento rápido
- ✅ Lazy loading e progressive loading

### Custos
- ✅ Transformações on-the-fly (não armazena múltiplas versões)
- ✅ Cache eficiente
- ✅ Plano gratuito: 25 GB storage, 25 GB bandwidth/mês

---

## 🧪 Testando

### 1. Upload de Imagem
```javascript
// No console do navegador
const file = document.querySelector('input[type="file"]').files[0]
const url = await cloudinaryService.uploadCorridaImage(file)
console.log('URL:', url)
// Deve retornar: https://res.cloudinary.com/dyxgdeunz/image/upload/.../corridas/...
```

### 2. Verificar Pasta
- Acesse: https://console.cloudinary.com/console/media_library
- Navegue até a pasta `corridas/`
- Verifique se as imagens estão sendo salvas lá

### 3. Testar Otimização
```javascript
const originalUrl = 'https://res.cloudinary.com/dyxgdeunz/image/upload/v123/corridas/test.jpg'
const optimizedUrl = cloudinaryService.getCorridaImageUrl(originalUrl, 350, 200)
console.log('Otimizada:', optimizedUrl)
// Deve incluir: w_350,h_200,c_fill,f_auto,q_auto
```

---

## 🚨 Troubleshooting

### Erro: "Upload preset not found"
**Solução:** Verifique se o preset `corridas-run` foi criado no Cloudinary Dashboard

### Erro: "Invalid signature"
**Solução:** Certifique-se que o preset está configurado como "Unsigned"

### Imagens não aparecem na pasta corridas
**Solução:** Verifique se o campo "Folder" está configurado como `corridas` no preset

### Upload muito lento
**Solução:** 
- Reduza o tamanho da imagem antes do upload
- Verifique a conexão de internet
- Considere implementar compressão no frontend

---

## 📝 Resumo

✅ **Preset criado**: `corridas-run`
✅ **Pasta configurada**: `corridas/`
✅ **Variável de ambiente**: `VITE_CLOUDINARY_UPLOAD_PRESET_CORRIDAS`
✅ **Método específico**: `uploadCorridaImage(file)`
✅ **Otimização**: `getCorridaImageUrl(url, width, height)`
✅ **Validações**: Tipo, tamanho, formato
✅ **Segurança**: Unsigned upload, sem exposição de secrets

---

## 🔗 Links Úteis

- [Cloudinary Console](https://console.cloudinary.com/)
- [Upload Presets](https://console.cloudinary.com/settings/upload)
- [Media Library](https://console.cloudinary.com/console/media_library)
- [Documentação Upload](https://cloudinary.com/documentation/upload_images)
- [Transformações](https://cloudinary.com/documentation/image_transformations)

---

## ✅ Status

**IMPLEMENTADO** - Sistema de upload de imagens de corridas com preset dedicado funcionando!
