# 🔍 Logs de Debug - Página de Perfil

## Objetivo
Identificar a causa do erro ao salvar perfil através de logs completos em todo o fluxo.

## Logs Adicionados

### 1. Firebase Config (`src/firebase/config.js`)
- ✅ Verificação de todas as variáveis de ambiente
- ✅ Log de inicialização do App, Auth e Firestore
- ✅ Confirmação de Project ID e Auth Domain

### 2. User Service (`src/services/userService.js`)

#### `getProfile(userId)`
- 🔵 Início da função
- 👤 userId recebido
- 📄 Caminho do documento
- 📦 Resultado do snapshot (exists, id)
- ✅ Dados retornados (se existir)
- ⚠️ Perfil não existe
- ❌ Erros com code, message e stack trace

#### `createProfile(userId, profileData)`
- 🔵 Início da função
- 👤 userId recebido
- 📦 profileData completo
- 📄 Caminho do documento
- 💾 Dados a serem salvos
- 🔄 Execução do setDoc
- ✅ Sucesso
- ❌ Erros com code, message e stack trace

#### `updateProfile(userId, profileData)`
- 🔵 Início da função
- 👤 userId recebido
- 📦 profileData completo
- 📄 Caminho do documento
- 💾 Dados a serem atualizados
- 🔄 Execução do updateDoc
- ✅ Sucesso
- ❌ Erros com code, message e stack trace
- ⚠️ Fallback para createProfile se documento não existir

### 3. Profile Form (`src/components/profile/ProfileForm.vue`)

#### `onAuthStateChanged`
- 🔵 Evento disparado
- 👤 Dados do usuário (uid, email, displayName, photoURL)
- ✅ Usuário autenticado
- ⚠️ Nenhum usuário autenticado

#### `onMounted`
- 🔵 Componente montado
- 👤 Estado do currentUser

#### `loadProfile()`
- 🔵 Início da função
- ⚠️ Nenhum usuário autenticado
- 👤 Dados do usuário
- 🔄 Chamada ao userService.getProfile
- 📦 Perfil retornado
- ✅ Perfil carregado no formulário
- ⚠️ Perfil não existe, criando padrão
- 📦 Perfil padrão criado
- 📋 Estado final do formulário
- ❌ Erros com stack trace

#### `handleSubmit()`
- 🔵 Início da função
- 📋 Dados do formulário completo
- ❌ Validação falhou (nome vazio)
- ✅ Validação passou
- 👤 Dados do currentUser
- 📦 Dados preparados para salvar
- 🔄 Chamada ao userService.updateProfile
- ✅ Perfil salvo com sucesso
- 🔄 Redirecionamento iniciado
- ➡️ Executando redirecionamento
- ❌ Erros com stack trace, name e message
- 🏁 Função finalizada

#### `handleCropComplete(croppedBlob)`
- 🔵 Início da função
- 📦 Dados do blob (size, type)
- 📁 Arquivo criado (name, size, type)
- 🔄 Upload para Cloudinary
- ✅ Upload concluído com URL
- ❌ Erros com stack trace
- 🏁 Função finalizada

## Como Usar os Logs

### 1. Abra o Console do Navegador
- Pressione F12 ou Ctrl+Shift+I
- Vá para a aba "Console"

### 2. Limpe o Console
- Clique no ícone 🚫 para limpar logs antigos

### 3. Tente Salvar o Perfil
- Preencha os dados do formulário
- Clique em "Salvar Perfil"

### 4. Analise os Logs
Os logs seguem um padrão de cores/emojis:
- 🔵 = Início de função/processo
- ✅ = Sucesso
- ❌ = Erro
- ⚠️ = Aviso/Situação especial
- 📦 = Dados/Payload
- 👤 = Informações do usuário
- 🔄 = Processamento/Execução
- 📄 = Documento/Referência
- 💾 = Salvamento
- 🏁 = Finalização

### 5. Identifique o Erro
Procure por:
- ❌ Logs de erro
- Última operação antes do erro
- Error code (ex: 'permission-denied', 'not-found')
- Stack trace completo

## Possíveis Erros e Soluções

### Error: permission-denied
**Causa:** Regras do Firestore bloqueando a operação
**Solução:** Verificar `firestore.rules`

### Error: not-found
**Causa:** Documento não existe
**Solução:** O código já tenta criar automaticamente

### Error: invalid-argument
**Causa:** Dados inválidos sendo enviados
**Solução:** Verificar estrutura dos dados nos logs

### Error: unauthenticated
**Causa:** Usuário não está autenticado
**Solução:** Verificar se currentUser.value existe

## Próximos Passos

1. Execute o app e tente salvar o perfil
2. Copie TODOS os logs do console
3. Identifique onde o erro ocorre
4. Verifique o error code e message
5. Aplique a correção apropriada

## Exemplo de Log Esperado (Sucesso)

```
🔵 [Firebase] Iniciando configuração do Firebase
📦 [Firebase] Configuração carregada: {...}
✅ [Firebase] App inicializado
✅ [Firebase] Auth inicializado
✅ [Firebase] Firestore inicializado
🔵 [ProfileForm] onAuthStateChanged disparado
👤 [ProfileForm] User: {uid: "...", email: "..."}
✅ [ProfileForm] Usuário autenticado, carregando perfil...
🔵 [ProfileForm] Iniciando loadProfile
🔵 [userService] Iniciando getProfile
✅ [userService] Perfil encontrado
✅ [ProfileForm] Perfil carregado no formulário
🔵 [ProfileForm] Iniciando handleSubmit
✅ [ProfileForm] Validação passou
🔵 [userService] Iniciando updateProfile
✅ [userService] Perfil atualizado com sucesso!
✅ [ProfileForm] Perfil salvo com sucesso!
🔄 [ProfileForm] Redirecionando para Home em 1.5s...
```

## Exemplo de Log com Erro

```
🔵 [ProfileForm] Iniciando handleSubmit
✅ [ProfileForm] Validação passou
🔵 [userService] Iniciando updateProfile
❌ [userService] Erro ao atualizar perfil: [Error object]
❌ [userService] Error code: permission-denied
❌ [userService] Error message: Missing or insufficient permissions
❌ [ProfileForm] Erro ao salvar perfil: Erro ao atualizar perfil: Missing or insufficient permissions
```
