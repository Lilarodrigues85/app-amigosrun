# Instruções para Amazon Q Developer - Memory Banking

**Versão:** 1.0
**Data:** 19/10/2025
**Autor:** Vander Loto - CTO DATAMETRIA

---

## 🎯 Propósito deste Documento

Este arquivo contém **instruções específicas** para o Amazon Q Developer sobre como usar o Memory Bank do DATAMETRIA Standards. Leia este documento SEMPRE que iniciar uma nova sessão ou quando solicitado a consultar o contexto do projeto.

---

## 📚 Estrutura do Memory Bank

O Memory Bank consiste em 5 arquivos que fornecem contexto persistente:

### 1. idea.md - Visão do Produto

**Quando consultar:**

- Início de nova sessão
- Dúvidas sobre objetivos do projeto
- Decisões sobre prioridades
- Planejamento de features

**O que contém:**

- Visão e objetivos do DATAMETRIA Standards
- Problema que resolve
- Critérios de sucesso
- Personas e proposta de valor
- Roadmap e KPIs

**Como usar:**

- Alinhar sugestões com objetivos
- Priorizar features baseado em KPIs
- Considerar personas ao sugerir soluções

### 2. vibe.md - Cultura da Equipe

**Quando consultar:**

- Dúvidas sobre estilo de código
- Decisões sobre comunicação
- Sugestões de workflow
- Onboarding de novos membros

**O que contém:**

- Estilo de colaboração (AI-First)
- Tom e linguagem
- Valores da equipe
- Workflow de desenvolvimento
- Rituais e ferramentas

**Como usar:**

- Seguir tom de documentação
- Respeitar valores da equipe
- Sugerir melhorias alinhadas com cultura

### 3. state.md - Estado Técnico Atual

**Quando consultar:**

- Início de nova sessão
- Dúvidas sobre stack tecnológico
- Decisões sobre dependências
- Análise de métricas

**O que contém:**

- Arquitetura do framework
- Stack tecnológico completo
- Métricas atuais
- Projetos ativos
- Configurações padrão
- Issues conhecidos

**Como usar:**

- Usar tecnologias do stack
- Considerar métricas ao sugerir melhorias
- Respeitar configurações padrão

### 4. decisions.md - Decisões Arquiteturais

**Quando consultar:**

- Dúvidas sobre "porquê" de decisões
- Sugestões de mudanças arquiteturais
- Análise de alternativas
- Documentação de novas decisões

**O que contém:**

- ADRs (Architecture Decision Records)
- Contexto de cada decisão
- Consequências e trade-offs
- Alternativas consideradas

**Como usar:**

- Respeitar decisões aceitas
- Sugerir mudanças apenas com justificativa forte
- Documentar novas decisões no formato ADR

### 5. q-vibes-memory-banking.md - Este Arquivo

**Quando consultar:**

- Início de TODA nova sessão
- Dúvidas sobre como usar Memory Bank
- Atualização de instruções

**O que contém:**

- Instruções de uso do Memory Bank
- Fluxos de trabalho
- Boas práticas
- Anti-patterns

---

## 🔄 Fluxo de Trabalho com Memory Bank

### Início de Nova Sessão

**SEMPRE execute estes passos:**

1. **Ler q-vibes-memory-banking.md** (este arquivo)
2. **Ler idea.md** para contexto de produto
3. **Ler state.md** para contexto técnico
4. **Consultar decisions.md** se necessário
5. **Consultar vibe.md** para estilo

### Durante Desenvolvimento

**Consulte conforme necessário:**

- **Dúvida sobre objetivo?** → idea.md
- **Dúvida sobre tecnologia?** → state.md
- **Dúvida sobre decisão?** → decisions.md
- **Dúvida sobre estilo?** → vibe.md

### Ao Sugerir Mudanças

**Sempre considere:**

1. Alinhamento com **idea.md** (objetivos)
2. Compatibilidade com **state.md** (stack)
3. Consistência com **decisions.md** (ADRs)
4. Adequação a **vibe.md** (cultura)

### Ao Documentar Decisões

**Formato ADR em decisions.md:**

```markdown
## [YYYY-MM-DD] Título da Decisão

**Status**: Aceita | Rejeitada | Superseded

**Contexto**: Por que precisamos decidir?

**Decisão**: O que decidimos?

**Consequências**:
- ✅ Benefícios
- ⚠️ Trade-offs
- ❌ Riscos

**Alternativas Consideradas**:
1. Opção A - Por que não
2. Opção B - Por que não
```

---

## ✅ Boas Práticas

### 1. Sempre Consultar Memory Bank

**Faça:**

- ✅ Ler q-vibes-memory-banking.md no início da sessão
- ✅ Consultar idea.md para contexto de produto
- ✅ Consultar state.md para contexto técnico
- ✅ Respeitar decisões em decisions.md

**Não faça:**

- ❌ Ignorar Memory Bank
- ❌ Sugerir mudanças sem consultar decisions.md
- ❌ Usar tecnologias fora do stack em state.md

### 2. Alinhar com Objetivos

**Faça:**

- ✅ Priorizar features baseado em KPIs (idea.md)
- ✅ Considerar personas ao sugerir soluções
- ✅ Focar em métricas mensuráveis

**Não faça:**

- ❌ Sugerir features sem valor claro
- ❌ Ignorar critérios de sucesso
- ❌ Desviar do roadmap sem justificativa

### 3. Respeitar Cultura

**Faça:**

- ✅ Seguir tom de documentação (vibe.md)
- ✅ Respeitar valores da equipe
- ✅ Sugerir melhorias alinhadas com cultura

**Não faça:**

- ❌ Usar tom inadequado
- ❌ Sugerir processos contrários aos valores
- ❌ Ignorar workflow estabelecido

### 4. Manter Contexto Atualizado

**Faça:**

- ✅ Sugerir atualizações quando necessário
- ✅ Documentar novas decisões
- ✅ Atualizar métricas em state.md

**Não faça:**

- ❌ Deixar informações desatualizadas
- ❌ Tomar decisões sem documentar
- ❌ Ignorar mudanças no stack

---

## 🚫 Anti-Patterns

### 1. Ignorar Memory Bank

**Problema:**
Sugestões desalinhadas com objetivos, stack ou cultura.

**Solução:**
SEMPRE consultar Memory Bank no início da sessão.

### 2. Sugerir Mudanças Sem Contexto

**Problema:**
Mudanças que contradizem decisões anteriores.

**Solução:**
Consultar decisions.md antes de sugerir mudanças arquiteturais.

### 3. Usar Tecnologias Fora do Stack

**Problema:**
Sugerir tecnologias não aprovadas ou incompatíveis.

**Solução:**
Consultar state.md para stack tecnológico aprovado.

### 4. Não Documentar Decisões

**Problema:**
Decisões importantes perdidas entre sessões.

**Solução:**
Documentar TODAS as decisões arquiteturais em decisions.md.

---

## 📋 Checklist de Início de Sessão

Use este checklist SEMPRE que iniciar nova sessão:

- [ ] Li q-vibes-memory-banking.md (este arquivo)
- [ ] Li idea.md (visão do produto)
- [ ] Li state.md (estado técnico)
- [ ] Entendi objetivos e KPIs
- [ ] Conheço stack tecnológico
- [ ] Estou ciente de decisões anteriores
- [ ] Compreendo cultura da equipe

---

## 🎯 Casos de Uso Específicos

### Caso 1: Sugerir Nova Feature

**Processo:**

1. Consultar **idea.md**:
   - Feature alinhada com objetivos?
   - Impacta KPIs positivamente?
   - Considerou personas?

2. Consultar **state.md**:
   - Stack suporta feature?
   - Métricas atuais permitem?
   - Projetos ativos afetados?

3. Consultar **decisions.md**:
   - Decisões anteriores relevantes?
   - Alternativas já consideradas?

4. Sugerir feature com:
   - Justificativa baseada em idea.md
   - Implementação usando state.md
   - Consideração de decisions.md

### Caso 2: Refatorar Código

**Processo:**

1. Consultar **decisions.md**:
   - Por que código atual foi escrito assim?
   - Decisão arquitetural relevante?

2. Consultar **state.md**:
   - Refatoração compatível com stack?
   - Impacto em métricas?

3. Consultar **vibe.md**:
   - Refatoração alinhada com valores?
   - Workflow adequado?

4. Propor refatoração com:
   - Justificativa técnica
   - Impacto em métricas
   - Plano de migração

### Caso 3: Resolver Bug

**Processo:**

1. Consultar **state.md**:
   - Bug conhecido em issues?
   - Configuração relevante?

2. Consultar **decisions.md**:
   - Decisão arquitetural relacionada?
   - Trade-off conhecido?

3. Propor solução com:
   - Root cause analysis
   - Fix alinhado com arquitetura
   - Testes para prevenir regressão

### Caso 4: Adicionar Dependência

**Processo:**

1. Consultar **state.md**:
   - Dependência já no stack?
   - Versão compatível?

2. Consultar **decisions.md**:
   - Alternativa já considerada?
   - Decisão anterior relevante?

3. Se nova dependência:
   - Justificar necessidade
   - Comparar alternativas
   - Documentar decisão em decisions.md

---

## 🔄 Atualização do Memory Bank

### Quando Atualizar

**idea.md:**

- Mudanças de escopo
- Novos objetivos ou KPIs
- Atualização de roadmap

**vibe.md:**

- Mudanças de processo
- Novos valores ou rituais
- Atualização de ferramentas

**state.md:**

- Mudanças no stack
- Novas métricas
- Novos projetos
- Issues resolvidos

**decisions.md:**

- TODA decisão arquitetural
- Mudanças de tecnologia
- Padrões adotados

**q-vibes-memory-banking.md:**

- Melhorias no processo
- Novos casos de uso
- Feedback da equipe

### Como Atualizar

1. **Identificar necessidade** de atualização
2. **Consultar arquivo** relevante
3. **Propor mudança** com justificativa
4. **Aguardar aprovação** humana
5. **Atualizar arquivo** após aprovação
6. **Notificar equipe** da mudança

---

## 💡 Dicas para Uso Eficiente

### 1. Contexto é Rei

Sempre que possível, inclua contexto do Memory Bank nas respostas:

**Ruim:**
"Sugiro usar Redis para cache."

**Bom:**
"Baseado em decisions.md, já decidimos usar Redis para cache (decisão de 2025-10-19). Sugiro implementar com TTL de 1h conforme state.md."

### 2. Seja Específico

Referencie arquivos e seções específicas:

**Ruim:**
"Isso está no Memory Bank."

**Bom:**
"Conforme idea.md seção 'Critérios de Sucesso', nossa meta é coverage de 80%."

### 3. Justifique com Dados

Use métricas do Memory Bank:

**Ruim:**
"Isso vai melhorar performance."

**Bom:**
"Baseado em state.md, nossa meta de performance é 95%. Esta otimização pode aumentar de 88% para 92%."

### 4. Considere Trade-offs

Sempre mencione consequências:

**Ruim:**
"Use esta biblioteca."

**Bom:**
"Esta biblioteca resolve X (✅), mas adiciona 50kb ao bundle (⚠️). Conforme state.md, nosso bundle atual é 200kb."

---

## 🎓 Aprendizado Contínuo

### Feedback Loop

1. **Coletar feedback** sobre sugestões
2. **Analisar** o que funcionou/não funcionou
3. **Atualizar** q-vibes-memory-banking.md
4. **Melhorar** próximas interações

### Evolução do Memory Bank

O Memory Bank deve evoluir com o projeto:

- **Adicionar** novos casos de uso
- **Refinar** instruções baseado em uso
- **Remover** informações obsoletas
- **Expandir** contexto quando necessário

---

## 📞 Quando Pedir Ajuda Humana

Sempre que:

- ❓ Informação conflitante no Memory Bank
- ❓ Decisão arquitetural importante
- ❓ Mudança de escopo ou objetivos
- ❓ Dúvida sobre prioridades
- ❓ Trade-off complexo
- ❓ Impacto em múltiplos projetos

**Como pedir:**
"Preciso de decisão humana sobre X porque Y. Consultei [arquivo] e encontrei Z. Sugiro A ou B. Qual prefere?"

---

## ✅ Resumo Executivo

### O que Fazer SEMPRE

1. ✅ Ler q-vibes-memory-banking.md no início da sessão
2. ✅ Consultar idea.md para contexto de produto
3. ✅ Consultar state.md para contexto técnico
4. ✅ Respeitar decisions.md
5. ✅ Seguir estilo de vibe.md
6. ✅ Documentar decisões importantes
7. ✅ Justificar sugestões com dados
8. ✅ Considerar trade-offs

### O que NÃO Fazer NUNCA

1. ❌ Ignorar Memory Bank
2. ❌ Sugerir mudanças sem consultar decisions.md
3. ❌ Usar tecnologias fora do stack
4. ❌ Tomar decisões arquiteturais sem documentar
5. ❌ Desviar de objetivos sem justificativa
6. ❌ Ignorar métricas e KPIs
7. ❌ Sugerir soluções sem considerar cultura
8. ❌ Deixar informações desatualizadas

---

**Mantido por:** Vander Loto - CTO DATAMETRIA
**Próxima revisão:** 19/01/2026

---

## 🤖 Mensagem Final para Amazon Q Developer

Você é um parceiro essencial no desenvolvimento AI-First da DATAMETRIA. Este Memory Bank foi criado para que você tenha contexto completo e persistente do projeto, permitindo sugestões alinhadas com objetivos, stack tecnológico, decisões anteriores e cultura da equipe.

Use este conhecimento para:

- **Acelerar desenvolvimento** com sugestões contextualizadas
- **Manter qualidade** seguindo rules e padrões
- **Respeitar decisões** anteriores
- **Evoluir continuamente** baseado em feedback

Juntos, humanos e IA, estamos construindo o futuro do desenvolvimento de software.

**Obrigado por ser parte da equipe DATAMETRIA! 🚀**
