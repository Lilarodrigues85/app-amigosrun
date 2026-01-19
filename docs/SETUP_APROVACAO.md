# 🚀 Setup Rápido - Sistema de Aprovação

## ✅ O que foi implementado

Sistema completo de aprovação manual de usuários com:

- ✅ Cadastro com status "pending"
- ✅ Página de aguardo de aprovação
- ✅ Página de cadastro rejeitado
- ✅ Painel administrativo completo
- ✅ Proteção de rotas
- ✅ Firestore Rules atualizadas

## 🔧 Configuração Inicial (IMPORTANTE!)

### 1. Adicionar Primeiro Administrador

**Opção A: Via Firebase Console (Recomendado)**

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto
3. Vá em **Firestore Database**
4. Clique em **Iniciar coleção**
5. ID da coleção: `admins`
6. ID do documento: **seu-email@exemplo.com** (use seu email real)
7. Adicione os campos:
   - `email` (string): seu-email@exemplo.com
   - `role` (string): admin
   - `name` (string): Seu Nome
   - `createdAt` (timestamp): clique em "timestamp" e use a data atual

**Opção B: Via Script PowerShell**

```powershell
.\setup-admin.ps1
```

### 2. Deploy das Firestore Rules

```bash
firebase deploy --only firestore:rules
```

### 3. Atualizar Usuários Existentes (se houver)

Se já tem usuários cadastrados, adicione o campo `status` manualmente:

1. Acesse Firestore Console
2. Vá na collection `users`
3. Para cada usuário, adicione:
   - `status` (string): "approved"
   - `role` (string): "user"
   - `requestedAt` (timestamp): data atual
   - `approvedAt` (timestamp): data atual
   - `approvedBy` (string): seu-email@exemplo.com

## 🎯 Como Usar

### Como Administrador

1. Faça login com o email cadastrado como admin
2. Acesse: `http://localhost:5173/admin/users`
3. Veja lista de usuários pendentes
4. Clique em "Aprovar" ou "Rejeitar"

### Como Novo Usuário

1. Registre-se normalmente
2. Será redirecionado para página de aguardo
3. Aguarde aprovação do admin
4. Após aprovação, faça login novamente

## 📋 Rotas Disponíveis

- `/` - Home (requer aprovação)
- `/login` - Login
- `/pending-approval` - Aguardando aprovação
- `/registration-rejected` - Cadastro rejeitado
- `/admin/users` - Painel administrativo (apenas admins)
- `/perfil` - Perfil do usuário
- `/corridas` - Lista de corridas
- `/mapa` - Mapa interativo

## 🔐 Segurança

- Apenas admins podem alterar status de usuários
- Apenas usuários aprovados podem criar posts/corridas
- Firestore Rules protegem todas as operações
- Verificação em múltiplas camadas (frontend + backend)

## 🧪 Testando

### Teste 1: Novo Cadastro

```
1. Registre novo usuário
2. Deve redirecionar para /pending-approval
3. Tente acessar / (deve bloquear)
4. Tente acessar /corridas (deve bloquear)
```

### Teste 2: Aprovação

```
1. Login como admin
2. Acesse /admin/users
3. Aprove o usuário pendente
4. Faça login com o usuário aprovado
5. Deve acessar o app normalmente
```

### Teste 3: Rejeição

```
1. Login como admin
2. Rejeite um usuário com motivo
3. Faça login com o usuário rejeitado
4. Deve redirecionar para /registration-rejected
```

## 📊 Estrutura de Status

- `pending` - Aguardando aprovação (padrão)
- `approved` - Aprovado, pode acessar o app
- `rejected` - Rejeitado, não pode acessar

## 🐛 Problemas Comuns

### "Não consigo acessar /admin/users"

- Verifique se seu email está na collection `admins`
- Faça logout e login novamente
- Limpe cache do navegador

### "Usuário aprovado não consegue acessar"

- Verifique se o status está `approved` no Firestore
- Faça logout e login novamente
- Verifique console do navegador para erros

### "Firestore Rules bloqueando operações"

- Execute: `firebase deploy --only firestore:rules`
- Aguarde alguns segundos para propagar
- Teste novamente

## 📚 Documentação Completa

Veja `docs/SISTEMA_APROVACAO_USUARIOS.md` para documentação detalhada.

## 🚀 Deploy em Produção

```bash
# 1. Build
npm run build

# 2. Deploy Rules
firebase deploy --only firestore:rules

# 3. Deploy App
firebase deploy --only hosting

# 4. Adicione admin via Firebase Console
```

## ✨ Próximos Passos (Opcional)

- [ ] Notificações por email (Firebase Functions)
- [ ] Histórico de aprovações
- [ ] Filtros avançados no painel admin
- [ ] Estatísticas detalhadas
- [ ] Exportar lista de usuários

---

**Pronto!** O sistema está implementado e pronto para uso. 🎉

Comece adicionando seu email como admin no Firestore Console!
