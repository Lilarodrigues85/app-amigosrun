# 👤 Adicionar Admin: dalila.analistadesistema@gmail.com

## ⚠️ Importante

As Firestore Rules bloqueiam a escrita na collection `admins` por segurança. 
Você precisa adicionar o admin **manualmente via Firebase Console**.

## 🚀 Passo a Passo (5 minutos)

### 1. Acesse o Firebase Console

Abra no navegador:
```
https://console.firebase.google.com
```

### 2. Selecione o Projeto

- Clique no projeto **Amigos Run**
- Ou o projeto que você está usando

### 3. Acesse o Firestore Database

- No menu lateral, clique em **Firestore Database**
- Se aparecer "Criar banco de dados", clique e siga as instruções

### 4. Criar Collection "admins"

**Se a collection já existe:**
- Clique na collection `admins`
- Pule para o passo 5

**Se a collection NÃO existe:**
- Clique em **Iniciar coleção**
- ID da coleção: `admins`
- Clique em **Próximo**

### 5. Adicionar Documento

**ID do documento:**
```
dalila.analistadesistema@gmail.com
```

**Campos a adicionar:**

| Campo | Tipo | Valor |
|-------|------|-------|
| email | string | `dalila.analistadesistema@gmail.com` |
| role | string | `admin` |
| name | string | `Dalila` |
| createdAt | timestamp | [Clique no relógio e use data/hora atual] |

### 6. Salvar

- Clique em **Salvar**
- Pronto! Admin adicionado ✅

## 📸 Guia Visual

```
┌─────────────────────────────────────────────┐
│  Firebase Console                           │
├─────────────────────────────────────────────┤
│                                             │
│  Firestore Database                         │
│  ├── admins (collection)                    │
│  │   └── dalila.analistadesistema@gmail.com│
│  │       ├── email: "dalila.analistadesist…"│
│  │       ├── role: "admin"                  │
│  │       ├── name: "Dalila"                 │
│  │       └── createdAt: [timestamp]         │
│  │                                           │
│  └── users (collection)                     │
│      └── ...                                 │
└─────────────────────────────────────────────┘
```

## ✅ Verificar se Funcionou

### 1. Acesse a aplicação

```
http://localhost:5173/login
```

### 2. Faça login

- Email: `dalila.analistadesistema@gmail.com`
- Senha: [sua senha cadastrada]

### 3. Acesse o painel admin

```
http://localhost:5173/admin/users
```

Se conseguir acessar, está funcionando! 🎉

## 🐛 Problemas?

### "Não consigo acessar /admin/users"

**Solução 1: Verifique o documento**
- Volte ao Firebase Console
- Verifique se o documento existe
- Verifique se o ID é exatamente: `dalila.analistadesistema@gmail.com`
- Verifique se o campo `role` é `admin`

**Solução 2: Limpe o cache**
- Faça logout
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Faça login novamente

**Solução 3: Verifique as Rules**
- Execute: `firebase deploy --only firestore:rules`
- Aguarde 30 segundos
- Tente novamente

### "Firestore Rules bloqueando"

As rules estão corretas. A collection `admins` só pode ser escrita via Console por segurança.

## 📋 Dados para Copiar

Se preferir copiar e colar:

**Document ID:**
```
dalila.analistadesistema@gmail.com
```

**Campo email:**
```
dalila.analistadesistema@gmail.com
```

**Campo role:**
```
admin
```

**Campo name:**
```
Dalila
```

**Campo createdAt:**
```
[Use o seletor de timestamp do Firebase Console]
```

## 🎯 Após Adicionar

1. ✅ Faça login com o email
2. ✅ Acesse `/admin/users`
3. ✅ Gerencie usuários pendentes
4. ✅ Aprove ou rejeite cadastros

## 📞 Precisa de Ajuda?

Se tiver dúvidas:
1. Verifique se está no projeto correto
2. Verifique se o Firestore está ativo
3. Verifique se as Rules foram deployadas
4. Consulte a documentação em `docs/`

---

**Pronto!** Após adicionar no Firebase Console, você terá acesso total ao painel administrativo! 🚀
