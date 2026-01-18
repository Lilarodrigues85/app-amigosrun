# 🔧 Configuração do Cloudinary

## ❌ **Problema Identificado**
```
POST https://api.cloudinary.com/v1_1/dqcpkpgte/image/upload 401 (Unauthorized)
Cloudinary error: {"error":{"message":"Unknown API key "}}
```

## ✅ **Solução Implementada**

### **1. Cloud Name Corrigido**
```env
# .env - ATUALIZADO
VITE_CLOUDINARY_CLOUD_NAME=dyxgdeunz
```

### **2. Configuração Necessária no Dashboard Cloudinary**

Para que o upload funcione, você precisa configurar um **Upload Preset** no seu dashboard do Cloudinary:

#### **Passos para Configurar:**

1. **Acesse o Dashboard**: https://cloudinary.com/console
2. **Vá em Settings** → **Upload**
3. **Clique em "Add upload preset"**
4. **Configure o preset:**
   ```
   Preset name: amigos_run
   Signing Mode: Unsigned
   ```
5. **Salve a configuração**

### **3. Configuração Alternativa (Se não quiser criar preset)**

Se preferir não criar um upload preset, posso modificar o código para usar upload signed, mas precisará das credenciais completas:

```env
VITE_CLOUDINARY_CLOUD_NAME=dyxgdeunz
VITE_CLOUDINARY_API_KEY=sua_api_key_aqui
VITE_CLOUDINARY_API_SECRET=seu_api_secret_aqui
```

## 🔍 **Verificação da Configuração**

### **Teste Rápido:**
1. Abra o console do navegador (F12)
2. Tente fazer upload de uma imagem
3. Verifique os logs:
   ```javascript
   Uploading to Cloudinary: {
     cloudName: "dyxgdeunz",
     uploadPreset: "amigos_run",
     url: "https://api.cloudinary.com/v1_1/dyxgdeunz/image/upload"
   }
   ```

### **Possíveis Erros e Soluções:**

| Erro | Causa | Solução |
|------|-------|---------|
| `Unknown API key` | Cloud name incorreto | Verificar se `dyxgdeunz` está correto |
| `Invalid upload preset` | Preset não configurado | Criar preset "amigos_run" no dashboard |
| `401 Unauthorized` | Configuração de segurança | Verificar se preset é "Unsigned" |

## 🚀 **Próximos Passos**

1. **Configure o upload preset** no dashboard Cloudinary
2. **Reinicie o servidor** de desenvolvimento (`npm run dev`)
3. **Teste o upload** de uma imagem no perfil
4. **Verifique os logs** no console para confirmar sucesso

## 📝 **Configuração Atual**

```javascript
// src/services/cloudinaryService.js
const CLOUDINARY_CLOUD_NAME = 'dyxgdeunz'
const CLOUDINARY_UPLOAD_PRESET = 'amigos_run'
```

## ✅ **Status**
- ✅ Cloud name corrigido para `dyxgdeunz`
- ✅ Logs melhorados para debug
- ✅ Tratamento de erros específicos
- ⏳ **PENDENTE**: Configurar upload preset no dashboard

**Após configurar o upload preset "amigos_run" no dashboard do Cloudinary, o upload de imagens funcionará perfeitamente!** 📸✨