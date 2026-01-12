# 🔥 Firebase Setup - Amigos Run

Scripts automatizados para configurar Firebase no plano gratuito para o projeto Amigos Run.

## 🚀 Uso Rápido

### Windows (PowerShell)
```powershell
# Executar script completo
.\setup-firebase.ps1

# Pular instalação do Firebase CLI
.\setup-firebase.ps1 -SkipInstall

# Usar ID de projeto customizado
.\setup-firebase.ps1 -ProjectId "meu-projeto"
```

### Linux/Mac (Node.js)
```bash
# Executar script
node setup-firebase.js

# Ou dar permissão e executar
chmod +x setup-firebase.js
./setup-firebase.js
```

## 📋 O que os scripts fazem

### ✅ Configuração Automática

1. **Estrutura de pastas**
   - `src/firebase/` - Configuração do Firebase
   - `src/services/` - Serviços da aplicação
   - `src/components/` - Componentes Vue
   - `src/stores/` - Pinia stores

2. **Arquivos de configuração**
   - `firebase.json` - Configuração do projeto
   - `firestore.rules` - Regras de segurança do Firestore
   - `storage.rules` - Regras de segurança do Storage
   - `firestore.indexes.json` - Índices otimizados

3. **Código base**
   - `src/firebase/config.js` - Configuração do Firebase
   - `.env` - Variáveis de ambiente
   - `.gitignore` - Arquivos ignorados pelo Git

4. **Scripts NPM**
   - `firebase:login` - Login no Firebase
   - `firebase:deploy` - Deploy da aplicação
   - `firebase:serve` - Servidor local
   - `firebase:emulators` - Emuladores locais

### 🔒 Security Rules Incluídas

#### Firestore Rules
- **Users**: Usuário só edita próprio perfil
- **Corridas**: Qualquer um lê, só criador edita
- **Presenças**: Só próprio usuário altera
- **Feed**: Qualquer um lê/cria, só autor edita
- **Locations**: Só próprio usuário altera

#### Storage Rules
- **Fotos de perfil**: Só próprio usuário, máx 5MB

### 📊 Índices Otimizados

- **Corridas**: Por data + createdAt
- **Feed**: Por createdAt (timeline)
- **Locations**: Por isActive + updatedAt

## 🛠️ Configuração Manual

Se preferir configurar manualmente:

### 1. Instalar Firebase CLI
```bash
npm install -g firebase-tools
```

### 2. Login
```bash
firebase login
```

### 3. Criar projeto no console
- Acesse: https://console.firebase.google.com
- Criar projeto: `amigos-run`
- Plano: Spark (gratuito)

### 4. Habilitar serviços
- **Authentication**: Email/Password
- **Firestore**: Modo produção, região `southamerica-east1`
- **Storage**: Região `southamerica-east1`
- **Hosting**: Domínio padrão

### 5. Inicializar projeto local
```bash
firebase init
```
Selecionar: Firestore, Hosting, Storage

### 6. Configurar .env
```bash
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=amigos-run.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=amigos-run
VITE_FIREBASE_STORAGE_BUCKET=amigos-run.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
VITE_OPENWEATHER_API_KEY=sua_chave_openweather
```

## 📊 Limites do Plano Gratuito

| Serviço | Limite | Suficiente para |
|---------|--------|-----------------|
| **Firestore** | 50k reads/dia | ~500 usuários ativos |
| **Storage** | 5GB | ~10k fotos de perfil |
| **Hosting** | 10GB/mês | ~100k pageviews |
| **Auth** | Ilimitado | ∞ usuários |

## 🔧 Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Deploy
npm run firebase:deploy

# Servir localmente
firebase serve

# Emuladores (desenvolvimento)
firebase emulators:start

# Ver logs
firebase functions:log

# Ver uso
firebase projects:list
```

## 🚨 Troubleshooting

### Erro: "Firebase CLI not found"
```bash
npm install -g firebase-tools
```

### Erro: "Permission denied"
```bash
# Linux/Mac
sudo npm install -g firebase-tools

# Windows (PowerShell como Admin)
npm install -g firebase-tools
```

### Erro: "Project not found"
1. Verificar se projeto existe no console
2. Fazer login: `firebase login`
3. Selecionar projeto: `firebase use amigos-run`

### Erro: "Rules compilation failed"
1. Verificar sintaxe em `firestore.rules`
2. Testar regras: `firebase firestore:rules:test`

## 📚 Próximos Passos

Após configurar o Firebase:

1. **Instalar dependências Vue**
   ```bash
   npm install vue@latest vue-router@latest pinia@latest
   npm install @vueuse/firebase @vueuse/core leaflet
   ```

2. **Configurar OpenWeatherMap**
   - Cadastrar em: https://openweathermap.org/api
   - Obter API key gratuita (1000 calls/dia)
   - Adicionar no `.env`

3. **Iniciar desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Seguir Product Backlog**
   - Sprint 1: Autenticação + Perfil
   - Sprint 2: Corridas + Clima
   - Sprint 3: Social + Feed
   - Sprint 4: Mapa + Localização

## 🔗 Links Úteis

- [Firebase Console](https://console.firebase.google.com)
- [Firebase Docs](https://firebase.google.com/docs)
- [OpenWeatherMap API](https://openweathermap.org/api)
- [Vue.js Docs](https://vuejs.org)
- [Leaflet Docs](https://leafletjs.com)

---

**Desenvolvido por**: Dalila Rodrigues  
**Projeto**: Amigos Run  
**Data**: 19/10/2025