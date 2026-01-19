# 🧪 Roteiro de Testes - Sistema de Aprovação

## ⚙️ Preparação

### 1. Configurar Admin
```powershell
# Execute o script
.\setup-admin.ps1

# OU adicione manualmente no Firebase Console:
# Collection: admins
# Document ID: seu-email@exemplo.com
# Campos:
#   - email: "seu-email@exemplo.com"
#   - role: "admin"
#   - name: "Seu Nome"
#   - createdAt: [timestamp atual]
```

### 2. Deploy das Rules
```bash
firebase deploy --only firestore:rules
```

### 3. Iniciar Aplicação
```bash
npm run dev
```

## 🧪 Cenário 1: Novo Cadastro (Status Pending)

### Passos:
1. Abra o navegador em modo anônimo
2. Acesse `http://localhost:5173/login`
3. Clique em "Criar conta"
4. Preencha o formulário:
   - Nome: "Teste Usuário"
   - Email: "teste@email.com"
   - Senha: "123456"
   - Confirmar senha: "123456"
5. Clique em "Cadastrar"

### Resultado Esperado:
- ✅ Redirecionamento para `/pending-approval`
- ✅ Mensagem: "Aguardando Aprovação"
- ✅ Exibe email e data de solicitação
- ✅ Botões "Sair" e "Verificar Status"

### Verificar no Firestore:
```
Collection: users
Document: [userId]
Campos:
  - status: "pending"
  - email: "teste@email.com"
  - name: "Teste Usuário"
  - requestedAt: [timestamp]
```

## 🧪 Cenário 2: Tentativa de Acesso (Bloqueado)

### Passos:
1. Com o usuário "teste@email.com" logado
2. Tente acessar manualmente:
   - `http://localhost:5173/`
   - `http://localhost:5173/corridas`
   - `http://localhost:5173/mapa`

### Resultado Esperado:
- ✅ Todas as rotas redirecionam para `/pending-approval`
- ✅ Usuário não consegue acessar o app

## 🧪 Cenário 3: Acesso ao Painel Admin

### Passos:
1. Faça logout do usuário teste
2. Faça login com o email cadastrado como admin
3. Acesse `http://localhost:5173/admin/users`

### Resultado Esperado:
- ✅ Painel administrativo carrega
- ✅ Estatísticas exibem:
  - Pendentes: 1
  - Aprovados: X
  - Rejeitados: 0
  - Total: X+1
- ✅ Lista mostra "Teste Usuário" com status "Pendente"
- ✅ Botões "Aprovar" e "Rejeitar" visíveis

## 🧪 Cenário 4: Aprovação de Usuário

### Passos:
1. No painel admin, localize "Teste Usuário"
2. Clique em "✅ Aprovar"
3. Confirme a ação

### Resultado Esperado:
- ✅ Confirmação de aprovação
- ✅ Status muda para "Aprovado"
- ✅ Card some da lista de pendentes
- ✅ Estatísticas atualizam

### Verificar no Firestore:
```
Collection: users
Document: [userId]
Campos atualizados:
  - status: "approved"
  - approvedAt: [timestamp]
  - approvedBy: "admin@email.com"
```

## 🧪 Cenário 5: Acesso Após Aprovação

### Passos:
1. Faça logout do admin
2. Faça login com "teste@email.com"

### Resultado Esperado:
- ✅ Login bem-sucedido
- ✅ Redirecionamento para `/perfil` (se perfil incompleto)
- ✅ OU redirecionamento para `/` (se perfil completo)
- ✅ Usuário consegue navegar livremente
- ✅ Pode acessar todas as rotas

## 🧪 Cenário 6: Novo Cadastro para Rejeição

### Passos:
1. Faça logout
2. Registre novo usuário:
   - Nome: "Teste Rejeição"
   - Email: "rejeitar@email.com"
   - Senha: "123456"

### Resultado Esperado:
- ✅ Redirecionamento para `/pending-approval`

## 🧪 Cenário 7: Rejeição de Usuário

### Passos:
1. Faça logout
2. Login como admin
3. Acesse `/admin/users`
4. Localize "Teste Rejeição"
5. Clique em "❌ Rejeitar"
6. No modal, digite motivo:
   - "Email não autorizado para teste"
7. Clique em "Confirmar Rejeição"

### Resultado Esperado:
- ✅ Modal abre
- ✅ Campo de motivo disponível
- ✅ Após confirmar, status muda para "Rejeitado"
- ✅ Card some da lista de pendentes
- ✅ Estatísticas atualizam

### Verificar no Firestore:
```
Collection: users
Document: [userId]
Campos atualizados:
  - status: "rejected"
  - rejectedAt: [timestamp]
  - rejectedBy: "admin@email.com"
  - rejectionReason: "Email não autorizado para teste"
```

## 🧪 Cenário 8: Acesso Após Rejeição

### Passos:
1. Faça logout do admin
2. Tente fazer login com "rejeitar@email.com"

### Resultado Esperado:
- ✅ Login bem-sucedido (Firebase Auth)
- ✅ Redirecionamento para `/registration-rejected`
- ✅ Mensagem: "Cadastro Não Aprovado"
- ✅ Exibe motivo da rejeição
- ✅ Exibe email de contato
- ✅ Botão "Voltar" disponível

## 🧪 Cenário 9: Filtros no Painel Admin

### Passos:
1. Login como admin
2. Acesse `/admin/users`
3. Teste cada filtro:
   - Clique em "Todos"
   - Clique em "Pendentes"
   - Clique em "Aprovados"
   - Clique em "Rejeitados"

### Resultado Esperado:
- ✅ "Todos": Mostra todos os usuários
- ✅ "Pendentes": Mostra apenas pendentes
- ✅ "Aprovados": Mostra apenas aprovados
- ✅ "Rejeitados": Mostra apenas rejeitados
- ✅ Filtro ativo fica destacado

## 🧪 Cenário 10: Verificação de Status

### Passos:
1. Faça logout
2. Login com usuário pendente
3. Na página `/pending-approval`
4. Clique em "🔄 Verificar Status"

### Resultado Esperado:
- ✅ Botão mostra "Verificando..."
- ✅ Se ainda pendente: permanece na página
- ✅ Se aprovado: redireciona para `/perfil`
- ✅ Se rejeitado: redireciona para `/registration-rejected`

## 🧪 Cenário 11: Proteção de Rota Admin

### Passos:
1. Faça logout
2. Login com usuário comum (não admin)
3. Tente acessar `http://localhost:5173/admin/users`

### Resultado Esperado:
- ✅ Redirecionamento para `/`
- ✅ Usuário comum não acessa painel admin

## 🧪 Cenário 12: Firestore Rules

### Teste 1: Usuário Pendente Tenta Criar Post
```javascript
// No console do navegador (com usuário pendente logado)
const { db } = await import('./src/firebase/config.js')
const { collection, addDoc } = await import('firebase/firestore')

try {
  await addDoc(collection(db, 'posts'), {
    userId: 'teste',
    content: 'teste'
  })
  console.log('❌ ERRO: Deveria ter bloqueado!')
} catch (error) {
  console.log('✅ CORRETO: Bloqueado', error.message)
}
```

### Teste 2: Usuário Aprovado Cria Post
```javascript
// Com usuário aprovado logado
try {
  await addDoc(collection(db, 'posts'), {
    userId: auth.currentUser.uid,
    content: 'Meu primeiro post!'
  })
  console.log('✅ CORRETO: Post criado')
} catch (error) {
  console.log('❌ ERRO: Deveria ter permitido!', error.message)
}
```

### Teste 3: Usuário Tenta Alterar Próprio Status
```javascript
// Com usuário comum logado
const { doc, updateDoc } = await import('firebase/firestore')

try {
  await updateDoc(doc(db, 'users', auth.currentUser.uid), {
    status: 'approved'
  })
  console.log('❌ ERRO: Deveria ter bloqueado!')
} catch (error) {
  console.log('✅ CORRETO: Bloqueado', error.message)
}
```

## 📊 Checklist de Testes

### Configuração
- [ ] Admin adicionado no Firestore
- [ ] Firestore Rules deployadas
- [ ] Aplicação rodando localmente

### Fluxo de Cadastro
- [ ] Novo usuário registra
- [ ] Redireciona para pending-approval
- [ ] Status "pending" no Firestore
- [ ] Não consegue acessar app

### Fluxo de Aprovação
- [ ] Admin acessa painel
- [ ] Vê usuário pendente
- [ ] Aprova usuário
- [ ] Status muda para "approved"
- [ ] Usuário consegue acessar app

### Fluxo de Rejeição
- [ ] Admin rejeita usuário
- [ ] Adiciona motivo
- [ ] Status muda para "rejected"
- [ ] Usuário vê página de rejeição
- [ ] Motivo é exibido

### Segurança
- [ ] Usuário comum não acessa painel admin
- [ ] Usuário pendente não cria posts
- [ ] Usuário não altera próprio status
- [ ] Firestore Rules funcionando

### Interface
- [ ] Estatísticas corretas
- [ ] Filtros funcionando
- [ ] Botões responsivos
- [ ] Modais funcionando
- [ ] Mensagens claras

## 🐛 Problemas Comuns e Soluções

### "Não consigo acessar /admin/users"
```
Solução:
1. Verifique se seu email está na collection 'admins'
2. Faça logout e login novamente
3. Limpe cache do navegador (Ctrl+Shift+Delete)
4. Verifique console do navegador para erros
```

### "Firestore Rules bloqueando operações"
```
Solução:
1. Execute: firebase deploy --only firestore:rules
2. Aguarde 30 segundos para propagar
3. Faça logout e login novamente
4. Teste novamente
```

### "Usuário aprovado não consegue acessar"
```
Solução:
1. Verifique no Firestore se status é "approved"
2. Faça logout e login novamente
3. Limpe localStorage: localStorage.clear()
4. Recarregue a página (F5)
```

### "Estatísticas não atualizam"
```
Solução:
1. Recarregue a página do admin
2. Verifique console para erros
3. Verifique se Firestore está acessível
```

## ✅ Resultado Final Esperado

Após todos os testes:

- ✅ Sistema de aprovação funcionando
- ✅ Usuários pendentes bloqueados
- ✅ Usuários aprovados com acesso
- ✅ Usuários rejeitados informados
- ✅ Painel admin funcional
- ✅ Firestore Rules protegendo dados
- ✅ Interface responsiva e clara

---

**Parabéns!** Se todos os testes passaram, o sistema está pronto! 🎉
