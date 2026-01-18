# 🚀 DEPLOY RÁPIDO - Feed de Posts

## ⚡ Comandos Rápidos

### Opção 1: Script PowerShell (Mais Fácil)
```powershell
.\deploy-firestore.ps1
```
Escolha a opção **3** (Deploy Completo)

### Opção 2: Comando Direto
```bash
firebase deploy --only firestore
```

## ✅ Checklist Antes do Deploy

- [ ] Firebase CLI instalado? (`firebase --version`)
- [ ] Logado no Firebase? (`firebase login`)
- [ ] Projeto selecionado? (`firebase use --add`)

## 🧪 Testar Após Deploy

1. Abra o app e faça login
2. Vá para Home
3. Digite algo no campo de post
4. Clique em "Publicar"
5. Post deve aparecer imediatamente

## 📊 Verificar no Firebase

1. https://console.firebase.google.com
2. Firestore Database
3. Collection `posts`
4. Veja seus posts lá!

## ❌ Problemas?

### Firebase CLI não encontrado
```bash
npm install -g firebase-tools
```

### Não está logado
```bash
firebase login
```

### Erro de permissão
```bash
firebase deploy --only firestore:rules
```

### Erro de índice
```bash
firebase deploy --only firestore:indexes
```
Aguarde 5-10 minutos para índices serem criados.

## 📚 Documentação Completa

- `docs/RESUMO_FEED_POSTS.md` - Resumo geral
- `docs/FEED_POSTS_IMPLEMENTADO.md` - Documentação técnica
- `docs/COMO_FAZER_DEPLOY_FIRESTORE.md` - Guia detalhado

## 🎯 O que foi implementado?

✅ Posts salvos no Firestore (collection `posts`)
✅ Atualização em tempo real
✅ Persistência de dados
✅ Logs completos para debug
✅ Regras de segurança
✅ Índices otimizados

## 🎉 Pronto!

Após o deploy, o feed estará 100% funcional!
