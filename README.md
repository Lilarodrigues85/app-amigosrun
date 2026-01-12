# Amigos Run

> Plataforma web social para corredores - Conecte-se, descubra corridas e compartilhe experiências

[![Firebase](https://img.shields.io/badge/Firebase-Free%20Tier-orange)](https://firebase.google.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3.3+-green)](https://vuejs.org)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🚀 Como Usar

```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Deploy no Firebase
npm run deploy
```

## 🎯 Funcionalidades

- ✅ **Autenticação** - Login/cadastro com email
- ✅ **Perfil** - Avatar gerado + dados pessoais
- 🔄 **Corridas** - Cadastro e listagem de eventos
- 🔄 **Feed Social** - Interação entre corredores
- 🔄 **Mapa** - Localização em tempo real
- 🔄 **Clima** - Previsão do tempo para corridas

## 🛠️ Stack

- **Frontend**: Vue.js 3 + Vite
- **Backend**: Firebase (Auth + Firestore)
- **Deploy**: Firebase Hosting
- **Mapas**: OpenStreetMap + Leaflet
- **Clima**: OpenWeatherMap API

## 📁 Estrutura

```
src/
├── components/     # Componentes Vue
├── services/       # Lógica de negócio
├── composables/    # Hooks reutilizáveis
├── stores/         # Estado global (Pinia)
├── views/          # Páginas
└── firebase/       # Configuração Firebase
```

## 🔧 Configuração

1. Configure Firebase:
   ```bash
   firebase init
   ```

2. Configure variáveis de ambiente:
   ```bash
   cp .env.example .env
   # Edite .env com suas credenciais
   ```

3. Execute o projeto:
   ```bash
   npm run dev
   ```

## 📚 Documentação

- [Especificação Técnica](docs/app-corrida-firebase.md)
- [Product Backlog](docs/product-backlog.md)
- [Concepção do Projeto](docs/project-conception.md)

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua feature branch
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT © [Dalila Rodrigues](https://github.com/dalila)