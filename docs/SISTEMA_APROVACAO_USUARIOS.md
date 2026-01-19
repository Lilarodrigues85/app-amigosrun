# 🎯 Sistema de Aprovação de Usuários

## Visão Geral

Sistema completo de aprovação manual de usuários implementado no Amigos Run. Todos os novos cadastros ficam pendentes até que um administrador aprove ou rejeite.

## 📊 Estrutura de Dados

### Collection: `users`

```javascript
{
  userId: "abc123",
  email: "usuario@email.com",
  name: "João Silva",
  status: "pending", // pending, approved, rejected
  role: "user", // user, admin
  requestedAt: Timestamp,
  approvedAt: Timestamp | null,
  approvedBy: "admin@email.com" | null,
  rejectedAt: Timestamp | null,
  rejectedBy: "admin@email.com" | null,
  rejectionReason: "motivo" | null,
  createdAt: Timestamp
}
```

### Collection: `admins`

```javascript
{
  email: "admin@amigosrun.com", // ID do documento
  role: "admin",
  name: "Nome do Admin",
  createdAt: Timestamp
}
```

## 🔄 Fluxo Completo

### 1. Cadastro

1. Usuário preenche formulário de registro
2. Firebase Auth cria conta
3. Firestore cria documento com `status: "pending"`
4. Usuário é redirecionado para `/pending-approval`
5. Não consegue acessar o app até aprovação

### 2. Aprovação (Admin)

1. Admin acessa `/admin/users`
2. Vê lista de usuários pendentes
3. Clica em "Aprovar" ou "Rejeitar"
4. Status muda para `approved` ou `rejected`
5. Usuário pode acessar o app (se aprovado)

### 3. Acesso

1. Usuário faz login
2. Sistema verifica status no Firestore
3. Redireciona baseado no status:
   - `approved` → Acessa app normalmente
   - `pending` → Página de aguardo
   - `rejected` → Página de rejeição

## 🛡️ Proteção de Rotas

Todas as rotas principais verificam:

1. **Autenticação**: Usuário está logado?
2. **Aprovação**: Status é `approved`?
3. **Perfil**: Perfil está completo?

```javascript
// Exemplo de rota protegida
{
  path: '/',
  meta: { 
    requiresAuth: true,
    requiresApproval: true,
    requiresProfile: true 
  }
}
```

## 📱 Páginas

### `/pending-approval`

- Exibe mensagem de aguardo
- Mostra email e data de solicitação
- Botão para verificar status
- Botão para sair

### `/registration-rejected`

- Exibe mensagem de rejeição
- Mostra motivo (se fornecido)
- Informações de contato
- Botão para voltar

### `/admin/users`

- Estatísticas de usuários
- Filtros (Todos, Pendentes, Aprovados, Rejeitados)
- Lista de usuários com ações
- Modal para rejeição com motivo

## 🔐 Firestore Rules

```javascript
// Funções auxiliares
function isAdmin() {
  return exists(/databases/$(database)/documents/admins/$(request.auth.token.email));
}

function isApproved() {
  return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.status == 'approved';
}

// Users - apenas admins podem alterar status
match /users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
  allow create: if request.auth != null && request.auth.uid == userId;
  allow update: if isAdmin() || 
    (request.auth.uid == userId && !('status' in request.resource.data.diff(resource.data).affectedKeys()));
}

// Admins - apenas leitura
match /admins/{email} {
  allow read: if request.auth != null;
  allow write: if false; // Apenas via console
}

// Outras collections - apenas usuários aprovados
match /posts/{postId} {
  allow read: if true;
  allow write: if request.auth != null && isApproved();
}
```

## 🔧 Configuração Inicial

### 1. Adicionar Primeiro Admin

Execute o script PowerShell:

```powershell
.\setup-admin.ps1
```

Ou adicione manualmente no Firebase Console:

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Crie collection `admins`
5. Adicione documento com ID = email do admin
6. Campos:
   ```json
   {
     "email": "seu@email.com",
     "role": "admin",
     "name": "Seu Nome",
     "createdAt": "2024-01-18T10:00:00Z"
   }
   ```

### 2. Deploy das Regras

```powershell
firebase deploy --only firestore:rules
```

### 3. Atualizar Usuários Existentes

Se já tem usuários cadastrados, adicione o campo `status`:

```javascript
// No Firebase Console ou via script
{
  status: "approved", // ou "pending"
  role: "user",
  requestedAt: Timestamp.now(),
  approvedAt: Timestamp.now(),
  approvedBy: "admin@email.com"
}
```

## 📊 Serviços

### `adminService.js`

- `isAdmin(email)` - Verifica se é admin
- `getPendingUsers()` - Lista usuários pendentes
- `getAllUsers(filter)` - Lista todos com filtro
- `approveUser(userId, adminEmail)` - Aprova usuário
- `rejectUser(userId, adminEmail, reason)` - Rejeita usuário
- `getUserStats()` - Estatísticas

### `authService.js`

- `checkUserStatus(userId)` - Verifica status de aprovação
- `register()` - Atualizado para criar com status pending

## 🎨 Componentes

- `PendingApproval.vue` - Página de aguardo
- `RegistrationRejected.vue` - Página de rejeição
- `AdminDashboard.vue` - Painel administrativo

## 🚀 Deploy

1. **Atualizar código:**
   ```bash
   npm run build
   ```

2. **Deploy Firestore Rules:**
   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Deploy aplicação:**
   ```bash
   firebase deploy --only hosting
   ```

## ✅ Checklist de Implementação

- [x] Estrutura de dados no Firestore
- [x] Serviço de administração (`adminService.js`)
- [x] Atualização do `authService.js`
- [x] Página de aguardo (`PendingApproval.vue`)
- [x] Página de rejeição (`RegistrationRejected.vue`)
- [x] Painel admin (`AdminDashboard.vue`)
- [x] Proteção de rotas no router
- [x] Firestore Rules atualizadas
- [x] Script de configuração de admin
- [x] Documentação

## 🔍 Testando

### Fluxo de Cadastro

1. Registre novo usuário
2. Verifique redirecionamento para `/pending-approval`
3. Tente acessar outras páginas (deve bloquear)

### Fluxo de Aprovação

1. Faça login como admin
2. Acesse `/admin/users`
3. Aprove um usuário pendente
4. Faça login com o usuário aprovado
5. Verifique acesso ao app

### Fluxo de Rejeição

1. Como admin, rejeite um usuário
2. Adicione motivo da rejeição
3. Faça login com o usuário rejeitado
4. Verifique redirecionamento para `/registration-rejected`

## 📧 Notificações (Futuro)

Para implementar notificações por email:

1. Configure Firebase Functions
2. Crie trigger em `users/{userId}` onUpdate
3. Envie email quando status mudar para `approved`

```javascript
exports.notifyUserApproval = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data()
    const after = change.after.data()
    
    if (before.status !== 'approved' && after.status === 'approved') {
      await sendEmail({
        to: after.email,
        subject: 'Cadastro Aprovado - Amigos Run',
        body: 'Seu cadastro foi aprovado!'
      })
    }
  })
```

## 🐛 Troubleshooting

### Usuário não consegue acessar após aprovação

- Verifique se o status está realmente `approved` no Firestore
- Limpe cache do navegador
- Faça logout e login novamente

### Admin não consegue acessar painel

- Verifique se o email está na collection `admins`
- Verifique se as Firestore Rules foram deployadas
- Verifique console do navegador para erros

### Firestore Rules bloqueando operações

- Verifique se as funções `isAdmin()` e `isApproved()` estão corretas
- Teste as rules no Firebase Console (Rules Playground)
- Verifique se o campo `status` existe nos documentos

## 📝 Notas

- Admins são definidos manualmente no Firestore
- Não há auto-registro de admins por segurança
- Status padrão de novos usuários é `pending`
- Usuários rejeitados não podem acessar o app
- Histórico de aprovações/rejeições é mantido

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com)
- [Firestore Rules Reference](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Firebase Auth](https://firebase.google.com/docs/auth)
