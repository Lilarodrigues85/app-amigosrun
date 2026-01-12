# Firestore Database Schema - Amigos Run

## Collections Structure

### 📁 users/{userId}
**Descrição**: Perfis dos usuários da plataforma

**Campos**:
```javascript
{
  name: string,              // Nome completo (obrigatório)
  email: string,             // Email do usuário
  photoUrl: string | null,   // URL da foto de perfil
  weight: number | null,     // Peso em kg
  height: number | null,     // Altura em cm
  goal: string,              // Meta de corrida (iniciante, 5k, 10k, etc.)
  bio: string,               // Biografia do usuário
  showPersonalInfo: boolean, // Mostrar peso/altura publicamente
  createdAt: timestamp,      // Data de criação
  updatedAt: timestamp       // Última atualização
}
```

**Regras de Segurança**:
- ✅ Leitura: Pública (qualquer um pode ver perfis)
- ✅ Escrita: Apenas o próprio usuário

**Exemplo**:
```javascript
{
  name: "João Silva",
  email: "joao@email.com",
  photoUrl: "https://ui-avatars.com/api/?name=João+Silva",
  weight: 75,
  height: 180,
  goal: "10k",
  bio: "Corredor iniciante, meta de correr 10K em 2025",
  showPersonalInfo: true,
  createdAt: "2025-10-27T10:00:00Z",
  updatedAt: "2025-10-27T15:30:00Z"
}
```

---

### 📁 corridas/{runId}
**Descrição**: Eventos de corrida cadastrados na plataforma

**Campos**:
```javascript
{
  title: string,           // Título da corrida
  description: string,     // Descrição detalhada
  date: timestamp,         // Data e hora da corrida
  location: {              // Localização
    name: string,          // Nome do local
    address: string,       // Endereço completo
    lat: number,           // Latitude
    lng: number            // Longitude
  },
  price: number,           // Valor da inscrição
  registrationUrl: string, // Link para inscrição
  imageUrl: string | null, // Imagem do evento
  createdBy: string,       // UID do criador
  createdAt: timestamp,    // Data de criação
  updatedAt: timestamp     // Última atualização
}
```

**Regras de Segurança**:
- ✅ Leitura: Pública
- ✅ Criação: Usuários autenticados
- ✅ Edição/Exclusão: Apenas o criador

---

### 📁 corridas/{runId}/presencas/{userId}
**Descrição**: Sistema "Vou/Não Vou" para cada corrida

**Campos**:
```javascript
{
  userId: string,          // UID do usuário
  userName: string,        // Nome do usuário
  userPhoto: string,       // Foto do usuário
  status: string,          // "going" | "not_going" | "maybe"
  createdAt: timestamp,    // Data da confirmação
  updatedAt: timestamp     // Última atualização
}
```

**Regras de Segurança**:
- ✅ Leitura: Pública
- ✅ Escrita: Apenas o próprio usuário

---

### 📁 feed/{postId}
**Descrição**: Feed social da plataforma

**Campos**:
```javascript
{
  userId: string,          // UID do autor
  userName: string,        // Nome do autor
  userPhoto: string,       // Foto do autor
  content: string,         // Conteúdo do post
  type: string,            // "text" | "run_completed" | "run_registered"
  runId: string | null,    // ID da corrida (se aplicável)
  imageUrl: string | null, // Imagem do post
  likes: number,           // Número de curtidas
  comments: number,        // Número de comentários
  createdAt: timestamp,    // Data de criação
  updatedAt: timestamp     // Última atualização
}
```

**Regras de Segurança**:
- ✅ Leitura: Pública
- ✅ Criação: Usuários autenticados
- ✅ Edição/Exclusão: Apenas o autor

---

### 📁 locations/{userId}
**Descrição**: Localização em tempo real dos usuários

**Campos**:
```javascript
{
  userId: string,          // UID do usuário
  userName: string,        // Nome do usuário
  lat: number,             // Latitude atual
  lng: number,             // Longitude atual
  isRunning: boolean,      // Se está correndo
  speed: number | null,    // Velocidade atual (km/h)
  distance: number | null, // Distância percorrida (km)
  startTime: timestamp | null, // Início da corrida
  lastUpdate: timestamp    // Última atualização
}
```

**Regras de Segurança**:
- ✅ Leitura: Pública
- ✅ Escrita: Apenas o próprio usuário

---

## Índices Recomendados

### users
- `email` (único)
- `createdAt` (descendente)

### corridas
- `date` (ascendente)
- `createdBy`
- `location.lat, location.lng` (geográfico)

### feed
- `createdAt` (descendente)
- `userId`
- `type`

### locations
- `lastUpdate` (descendente)
- `isRunning`

---

## Comandos Firebase CLI

### Criar índices
```bash
firebase firestore:indexes
```

### Deploy das regras
```bash
firebase deploy --only firestore:rules
```

### Deploy dos índices
```bash
firebase deploy --only firestore:indexes
```

---

## Exemplo de Uso

### Criar perfil de usuário
```javascript
import { userService } from '@/services/userService'

await userService.createUser(user.uid, {
  name: "João Silva",
  email: user.email,
  photoUrl: null,
  weight: 75,
  height: 180,
  goal: "10k",
  bio: "Corredor iniciante",
  showPersonalInfo: true
})
```

### Buscar perfil público
```javascript
const profile = await userService.getPublicProfile(userId)
console.log(profile.name) // "João Silva"
```

### Atualizar perfil
```javascript
await userService.updateProfile(user.uid, {
  weight: 73,
  goal: "21k",
  bio: "Evoluindo para meia maratona!"
})
```