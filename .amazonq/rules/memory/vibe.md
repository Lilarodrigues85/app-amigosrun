# DATAMETRIA Standards - Cultura da Equipe

**Versão:** 1.0
**Data:** 19/10/2025
**Autor:** Vander Loto - CTO DATAMETRIA

---

## 🎭 Estilo de Colaboração

### AI-First Mindset

**Filosofia**: Humanos focam em estratégia, IA executa implementação.

- **90% Amazon Q Developer**: Geração de código, testes, documentação
- **10% Supervisão Humana**: Análise crítica, decisões arquiteturais, code review estratégico
- **Colaboração**: IA como parceiro, não ferramenta

### Comunicação

**Princípios**:

- **Assíncrona por padrão**: Documentação > reuniões
- **Contexto rico**: Sempre incluir "porquê" nas decisões
- **Feedback construtivo**: Foco em melhorias, não críticas
- **Transparência total**: Decisões documentadas publicamente

**Canais**:

- **Slack**: Comunicação rápida e informal
- **GitHub**: Discussões técnicas e code review
- **Confluence**: Documentação de longo prazo
- **Zoom**: Apenas para discussões complexas

---

## 💬 Tom e Linguagem

### Documentação

- **Clara e direta**: Sem jargões desnecessários
- **Exemplos práticos**: Sempre mostrar código
- **Mensurável**: Dados e métricas sempre que possível
- **Acionável**: Foco em "como fazer"

### Code Review

- **Construtivo**: "Sugiro X porque Y"
- **Educativo**: Explicar o "porquê"
- **Respeitoso**: Criticar código, não pessoas
- **Objetivo**: Baseado em rules, não opiniões

### Comunicação Interna

- **Informal mas profissional**: Emojis permitidos 😊
- **Inclusiva**: Evitar termos técnicos sem explicação
- **Positiva**: Celebrar conquistas
- **Honesta**: Admitir erros e aprender

---

## 🤝 Valores da Equipe

### 1. Excelência Técnica

**O que significa**:

- Código limpo e testado
- Arquitetura bem pensada
- Performance otimizada
- Segurança by design

**Como praticamos**:

- Coverage mínimo 80%
- Code review obrigatório
- Conformidade com rules 95%
- Refatoração contínua

### 2. Aprendizado Contínuo

**O que significa**:

- Sempre há algo novo para aprender
- Erros são oportunidades
- Compartilhar conhecimento
- Experimentar novas tecnologias

**Como praticamos**:

- Tech talks semanais
- Pair programming com IA
- Contribuições open source
- Budget para cursos/livros

### 3. Colaboração

**O que significa**:

- Sucesso do time > sucesso individual
- Ajudar colegas proativamente
- Compartilhar contexto
- Feedback constante

**Como praticamos**:

- Code review em 24h
- Documentação de decisões
- Mentoria júnior-sênior
- Retrospectivas quinzenais

### 4. Pragmatismo

**O que significa**:

- Entregar valor > perfeição
- Simplicidade > complexidade
- Resultados > processos
- Flexibilidade > dogmatismo

**Como praticamos**:

- MVP antes de otimização
- Refatoração incremental
- Rules com exceções documentadas
- Decisões baseadas em dados

### 5. Inovação

**O que significa**:

- Questionar status quo
- Experimentar novas abordagens
- AI-First Development
- Automação máxima

**Como praticamos**:

- 20% time para experimentos
- Hackathons trimestrais
- POCs de novas tecnologias
- Contribuições para framework

---

## 🎯 Workflow de Desenvolvimento

### 1. Planejamento

**Responsável**: Product Owner + Tech Lead
**Duração**: 2h/sprint
**Artefatos**: User stories, acceptance criteria

**Processo**:

1. Revisar backlog
2. Priorizar features
3. Estimar com Planning Poker
4. Definir sprint goal

### 2. Desenvolvimento

**Responsável**: Desenvolvedor + Amazon Q
**Duração**: 80% do sprint
**Artefatos**: Código, testes, documentação

**Processo**:

1. Criar branch feature/TICKET-123
2. Desenvolver com Amazon Q (90%)
3. Revisar e ajustar (10%)
4. Executar testes localmente
5. Criar Pull Request

### 3. Code Review

**Responsável**: Tech Lead ou Sênior
**Duração**: < 24h
**Artefatos**: Comentários, aprovação

**Processo**:

1. Verificar conformidade com rules
2. Validar lógica de negócio
3. Sugerir melhorias
4. Aprovar ou solicitar mudanças

### 4. Deploy

**Responsável**: DevOps + CI/CD
**Duração**: Automático
**Artefatos**: Release notes, logs

**Processo**:

1. Merge para main
2. CI/CD executa testes
3. Deploy automático para staging
4. Validação manual
5. Deploy para produção

### 5. Monitoramento

**Responsável**: Toda equipe
**Duração**: Contínuo
**Artefatos**: Métricas, alertas

**Processo**:

1. Monitorar dashboards
2. Responder a alertas
3. Analisar métricas
4. Iterar melhorias

---

## 🏆 Reconhecimento

### Contribuições Valorizadas

- **Código de Qualidade**: Conformidade 95%+
- **Documentação**: ADRs, READMEs completos
- **Mentoria**: Ajudar colegas
- **Inovação**: Novas rules, melhorias
- **Bugs Encontrados**: Prevenção proativa

### Celebrações

- **Sprint Review**: Demonstrar conquistas
- **Tech Talks**: Compartilhar aprendizados
- **Slack Kudos**: Reconhecimento público
- **Quarterly Awards**: Prêmios por categoria

---

## 🚫 Anti-Patterns Culturais

### O que NÃO fazemos

❌ **Hero Culture**: Ninguém é indispensável
✅ **Team Culture**: Sucesso coletivo

❌ **Blame Game**: Culpar pessoas por erros
✅ **Blameless Postmortems**: Aprender com falhas

❌ **Silos**: Conhecimento concentrado
✅ **Knowledge Sharing**: Documentação e pair programming

❌ **Perfeccionismo**: Paralisia por análise
✅ **Iteração**: MVP e melhoria contínua

❌ **Reunionite**: Reuniões desnecessárias
✅ **Async First**: Documentação e comunicação assíncrona

---

## 📅 Rituais da Equipe

### Diários

- **Daily Standup** (15min): O que fiz, farei, bloqueios
- **Code Review** (contínuo): Feedback em 24h

### Semanais

- **Tech Talk** (1h): Apresentação técnica por membro
- **Office Hours** (2h): Suporte técnico aberto

### Quinzenais

- **Sprint Planning** (2h): Planejar próximo sprint
- **Sprint Review** (1h): Demonstrar entregas
- **Retrospectiva** (1h): Melhorias de processo

### Mensais

- **All Hands** (1h): Alinhamento geral
- **1:1s** (30min): Feedback individual

### Trimestrais

- **Hackathon** (2 dias): Inovação e experimentos
- **OKR Review** (2h): Avaliar objetivos

---

## 🎓 Onboarding

### Semana 1: Fundamentos

- **Dia 1**: Setup ambiente, acesso a ferramentas
- **Dia 2**: Leitura de DATAMETRIA Standards
- **Dia 3**: Primeiro PR com Amazon Q
- **Dia 4**: Code review de PRs existentes
- **Dia 5**: Pair programming com sênior

### Semana 2: Autonomia

- **Dia 1-2**: Feature pequena solo
- **Dia 3-4**: Bug fix e testes
- **Dia 5**: Apresentação de aprendizados

### Semana 3: Integração

- **Dia 1-3**: Feature média com mentoria
- **Dia 4**: Participar de code review
- **Dia 5**: Contribuir para documentação

### Semana 4: Produtividade

- **Dia 1-5**: Feature completa solo
- **Feedback**: Avaliação de onboarding

---

## 🔧 Ferramentas e Preferências

### Desenvolvimento

- **IDE**: VS Code (preferência) ou JetBrains
- **AI**: Amazon Q Developer (obrigatório)
- **Git**: GitHub (obrigatório)
- **Terminal**: Oh My Zsh ou PowerShell

### Comunicação

- **Chat**: Slack
- **Video**: Zoom ou Google Meet
- **Docs**: Confluence ou Notion
- **Tasks**: Jira ou Linear

### Qualidade

- **Linting**: ESLint, Flake8, Prettier
- **Testing**: Jest, Pytest, Detox
- **CI/CD**: GitHub Actions
- **Monitoring**: Datadog ou New Relic

---

## 💡 Tomada de Decisão

### Decisões Técnicas

**Processo**:

1. **Proposta**: Criar ADR com contexto
2. **Discussão**: GitHub Discussion (3 dias)
3. **Decisão**: Tech Lead decide baseado em consenso
4. **Documentação**: ADR finalizado e publicado

**Critérios**:

- Alinhamento com rules
- Impacto em performance
- Complexidade de manutenção
- Custo de implementação

### Decisões de Produto

**Processo**:

1. **Proposta**: Product Owner cria RFC
2. **Validação**: Feedback de stakeholders
3. **Decisão**: CTO aprova
4. **Execução**: Priorizado no backlog

**Critérios**:

- Valor para usuário
- Alinhamento com roadmap
- Viabilidade técnica
- ROI estimado

---

## 🌱 Crescimento Profissional

### Níveis de Carreira

**Júnior** (0-2 anos):

- Executa tarefas com supervisão
- Aprende padrões e ferramentas
- Contribui com código simples

**Pleno** (2-5 anos):

- Executa tarefas autonomamente
- Domina stack tecnológico
- Contribui com features completas

**Sênior** (5+ anos):

- Lidera tecnicamente
- Mentora júniors/plenos
- Define arquitetura

**Staff** (8+ anos):

- Define direção técnica
- Influencia múltiplos times
- Contribui para framework

### Plano de Desenvolvimento

**Trimestral**:

- Definir 3 objetivos técnicos
- 1 objetivo de soft skills
- Budget para aprendizado

**Anual**:

- Revisão de carreira
- Promoção (se aplicável)
- Ajuste de compensação

---

## 🎉 Celebrações

### Conquistas Técnicas

- **First PR Merged**: Emoji especial no Slack
- **100 PRs**: Certificado digital
- **Rule Criada**: Reconhecimento em All Hands
- **Bug Crítico Resolvido**: Kudos público

### Marcos do Projeto

- **MVP Lançado**: Team lunch
- **1000 Usuários**: Comemoração virtual
- **Zero Bugs Sprint**: Troféu digital
- **95% Coverage**: Badge especial

---

**Mantido por:** Vander Loto - CTO DATAMETRIA
**Próxima revisão:** 19/01/2026
