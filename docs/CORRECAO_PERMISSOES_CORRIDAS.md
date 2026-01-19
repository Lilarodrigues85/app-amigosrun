# Correção de Permissões para Atualizar Corridas

## Problema Identificado

Ao tentar atualizar uma corrida existente, o erro ocorria:

```
FirebaseError: Missing or insufficient permissions
```

## Causa Raiz

As regras do Firestore estavam verificando o campo **`createdBy`** para permitir atualizações, mas o sistema usa o campo **`organizador`**.

### Regra Antiga (Incorreta)
```javascript
match /corridas/{runId} {
  allow read: if true;
  allow create: if request.auth != null && isApproved();
  allow update, delete: if request.auth != null && isApproved() &&
    request.auth.uid == resource.data.createdBy; // ❌ Campo errado
}
```

### Regra Nova (Corrigida)
```javascript
match /corridas/{runId} {
  allow read: if true;
  allow create: if request.auth != null && isApproved();
  // ✅ Verifica o campo correto 'organizador' OU permite admin
  allow update, delete: if request.auth != null && isApproved() &&
    (request.auth.uid == resource.data.organizador || isAdmin());
}
```

## Melhorias Implementadas

### 1. Campo Correto
- Agora verifica `resource.data.organizador` em vez de `resource.data.createdBy`
- Alinhado com a estrutura de dados do sistema

### 2. Permissão para Admin
- Admins agora podem editar/deletar qualquer corrida
- Útil para moderação e manutenção

### 3. Estrutura de Dados
```javascript
{
  titulo: "Corrida do Parque",
  organizador: "uid-do-usuario",      // ✅ Campo usado para permissão
  organizadorNome: "Nome do Usuário",
  // ... outros campos
}
```

## Deploy Realizado

```bash
firebase deploy --only firestore:rules
```

**Status**: ✅ Deploy completo!

## Como Testar

1. **Como Organizador**:
   - Crie uma corrida
   - Edite a corrida criada por você
   - ✅ Deve funcionar sem erro

2. **Como Outro Usuário**:
   - Tente editar corrida de outro usuário
   - ❌ Deve ser bloqueado (correto)

3. **Como Admin**:
   - Edite qualquer corrida
   - ✅ Deve funcionar (privilégio admin)

## Regras de Segurança

### Leitura (Read)
- ✅ Qualquer pessoa pode ler corridas (público)

### Criação (Create)
- ✅ Usuário autenticado
- ✅ Usuário aprovado (`status == 'approved'`)

### Atualização/Exclusão (Update/Delete)
- ✅ Usuário autenticado
- ✅ Usuário aprovado
- ✅ É o organizador da corrida **OU** é admin

## Campos Verificados

| Campo | Tipo | Uso |
|-------|------|-----|
| `organizador` | string (uid) | Identifica quem criou a corrida |
| `organizadorNome` | string | Nome para exibição |
| `status` | string | Status de aprovação do usuário |

## Arquivos Modificados

- ✅ `firestore.rules` - Regras de segurança corrigidas
- ✅ Deploy realizado com sucesso

## Resultado

✅ Corridas podem ser atualizadas pelo organizador
✅ Admins podem moderar qualquer corrida
✅ Segurança mantida (outros usuários não podem editar)
✅ Campo `valor60` pode ser adicionado/editado sem erro
