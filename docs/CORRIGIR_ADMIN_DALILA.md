# 🔧 Corrigir Admin - Dalila

## ❌ Problema Identificado

Você adicionou `role: "admin"` na collection **users**, mas o sistema verifica a collection **admins** (separada).

## ✅ Solução

Você precisa criar um documento na collection **admins** com seu email como ID.

## 🚀 Passo a Passo no Firebase Console

### 1. Acesse o Firebase Console
```
https://console.firebase.google.com
```

### 2. Vá em Firestore Database

No menu lateral → **Firestore Database**

### 3. Criar Collection "admins"

**Se a collection "admins" NÃO existe:**
- Clique em **Iniciar coleção**
- ID da coleção: `admins`
- Clique em **Próximo**

**Se a collection "admins" já existe:**
- Clique nela
- Clique em **Adicionar documento**

### 4. Adicionar Documento

**⚠️ IMPORTANTE: O ID do documento DEVE ser seu email completo!**

```
ID do documento: dalila.analistadesistema@gmail.com
```

**Campos a adicionar:**

| Campo | Tipo | Valor |
|-------|------|-------|
| email | string | `dalila.analistadesistema@gmail.com` |
| role | string | `admin` |
| name | string | `Dalila Rodrigues` |
| createdAt | timestamp | [Use o seletor de timestamp - data atual] |

### 5. Salvar

Clique em **Salvar**

## 📊 Estrutura Final no Firestore

Você terá:

```
firestore/
├── admins/                                    ← Collection separada
│   └── dalila.analistadesistema@gmail.com   ← Documento com seu email
│       ├── email: "dalila.analistadesistema@gmail.com"
│       ├── role: "admin"
│       ├── name: "Dalila Rodrigues"
│       └── createdAt: [timestamp]
│
└── users/                                     ← Collection de usuários
    └── [seu-user-id]                         ← Seu perfil de usuário
        ├── email: "dalila.analistadesistema@gmail.com"
        ├── name: "Dalila Rodrigues"
        ├── role: "admin"                     ← Pode manter, mas não é usado
        ├── status: "approved"
        └── ... (outros campos)
```

## ✅ Verificar se Funcionou

### 1. Faça Logout
- Clique em sair da aplicação

### 2. Limpe o Cache
- Pressione `Ctrl + Shift + Delete`
- Marque "Cookies e dados de sites"
- Clique em "Limpar dados"

### 3. Faça Login Novamente
- Email: `dalila.analistadesistema@gmail.com`
- Senha: [sua senha]

### 4. Acesse o Painel Admin
```
http://localhost:5173/admin/users
```

Se conseguir acessar, está funcionando! 🎉

## 🐛 Se Ainda Não Funcionar

### Verificação 1: Documento na Collection Correta

No Firebase Console, verifique:
- ✅ Collection: `admins` (não `users`)
- ✅ Document ID: `dalila.analistadesistema@gmail.com` (exatamente igual)
- ✅ Campo `email` existe
- ✅ Campo `role` = `admin`

### Verificação 2: Firestore Rules

Execute no terminal:
```bash
firebase deploy --only firestore:rules
```

Aguarde 30 segundos e tente novamente.

### Verificação 3: Console do Navegador

1. Abra o DevTools (F12)
2. Vá na aba **Console**
3. Tente acessar `/admin/users`
4. Veja se há erros

### Verificação 4: Teste Manual

No console do navegador, execute:

```javascript
// Importar o adminService
const { adminService } = await import('./src/services/adminService.js')

// Verificar se você é admin
const isAdmin = await adminService.isAdmin('dalila.analistadesistema@gmail.com')
console.log('É admin?', isAdmin)
```

Se retornar `false`, o documento não está correto.

## 📸 Exemplo Visual

```
Firebase Console → Firestore Database

┌─────────────────────────────────────────────┐
│  Collections                                │
├─────────────────────────────────────────────┤
│                                             │
│  📁 admins                                  │ ← Clique aqui
│     └── 📄 dalila.analistadesistema@gmail…│ ← Seu documento
│          ├── email: "dalila.analistadesist…"│
│          ├── role: "admin"                  │
│          ├── name: "Dalila Rodrigues"       │
│          └── createdAt: [timestamp]         │
│                                             │
│  📁 users                                   │
│     └── 📄 [seu-user-id]                   │
│          └── ... (seu perfil)               │
└─────────────────────────────────────────────┘
```

## 🎯 Checklist

- [ ] Collection `admins` criada
- [ ] Documento com ID = `dalila.analistadesistema@gmail.com`
- [ ] Campo `email` preenchido
- [ ] Campo `role` = `admin`
- [ ] Campo `name` preenchido
- [ ] Campo `createdAt` preenchido
- [ ] Documento salvo
- [ ] Logout feito
- [ ] Cache limpo
- [ ] Login feito novamente
- [ ] Tentou acessar `/admin/users`

## 💡 Dica

O sistema verifica se existe um documento na collection `admins` com o ID igual ao seu email. É por isso que o ID do documento é tão importante!

---

**Após seguir estes passos, você terá acesso ao painel administrativo!** 🚀
