# Documentação de Interface e Experiência do Usuário (UI/UX) - Projeto Heritage

## Visão Geral
O projeto **Heritage** é um aplicativo financeiro projetado para atender tanto indivíduos quanto famílias. O aplicativo permite gerenciar orçamentos, acompanhar transações e colaborar em metas financeiras conjuntas. A interface foi desenhada seguindo as melhores práticas modernas de design, oferecendo uma experiência simples, padronizada e enriquecida com Inteligência Artificial.

## Arquitetura de Telas e Fluxos

As 26 telas mapeadas do projeto no [Stitch] foram organizadas em 7 grandes módulos ou fluxos de usuário:

### 1. Autenticação e Onboarding
O aplicativo conta com telas iniciais para o usuário ser integrado de forma rápida e segura.
* **Telas Relacionadas:** 
  * `Heritage Bem-vindo e Login`

### 2. Dashboards de Visão Geral
O app se divide em duas visualizações principais: o espaço financeiro pessoal e o espaço financeiro familiar. Ambos foram projetados para permitir um controle rápido e inteligível de despesas.
* **Telas Relacionadas:** 
  * `Dashboard Pessoal - Rodapé Padronizado`
  * `Dashboard Família Padronizado`
  * `Dashboard Família - Rodapé Padronizado IA`

### 3. Gestão de Finanças Pessoais
Um fluxo dedicado para que o usuário monitore suas finanças e adicione/remova despesas próprias em poucos cliques.
* **Telas Relacionadas:** 
  * `Transações Pessoais com Botão Lixeira`
  * `Nova Despesa Padronizada`
  * `Editar Despesa - Ícones Padronizados`
  * `Excluir Transação Pessoal`

### 4. Gestão de Finanças Familiares
Um espaço colaborativo que permite monitorar contas divididas, acompanhar os gastos da casa e ver movimentações dos membros da família.
* **Telas Relacionadas:** 
  * `Transações da Família Padronizada`
  * `Nova Despesa Familiar`
  * `Editar Despesa Familiar`
  * `Excluir Transação Familiar`

### 5. Metas Financeiras (Goals)
As metas são o centro do planejamento financeiro no Heritage, separadas também entre conquistas individuais e metas conjuntas (da família). Este fluxo inclui as rotinas padrão de CRUD (Criar, Ler, Atualizar, Excluir).
* **Telas Relacionadas:** 
  * `Metas Pessoais Padronizadas`
  * `Criar Meta Pessoal`
  * `Editar Meta Pessoal Padronizada`
  * `Excluir Meta Pessoal`
  * `Criar Meta Familiar`
  * `Editar Meta Familiar Padronizada`
  * `Excluir Meta Familiar Padronizada`

### 6. Configurações, Perfil e Integrações
Módulo essencial para gerenciamento da conta e integrações com Open Finance/bancos. A segurança é tratada como prioridade nas iterações de UI.
* **Telas Relacionadas:** 
  * `Perfil Heritage com Lixeira` (Versões para usuários com e sem família configurada)
  * `Gerenciar Família - Edição de Membros`
  * `Contas Conectadas com Botão Voltar`
  * `Preferências de Notificação Atualizada`
  * `Segurança Atualizada`

### 7. Assistente de Inteligência Artificial
Um recurso premium do aplicativo. O usuário possui um Chatbot que pode ser utilizado para tirar dúvidas, receber insights de planejamento ou resumir os gastos baseados no histórico importado via Open Finance.
* **Telas Relacionadas:** 
  * `Chat IA Padronizado`

---

## Estrutura de Design e Componentização
1. **Padronização:** A nomenclatura frequentemente menciona "Padronizado", o que indica um esforço consistente no design system do aplicativo para componentes globais (ex: Rodapés e Navegação).
2. **Ícones:** Foi adotada uma iconografia padronizada, especialmente visível ao editar categorias ou despesas.
3. **Deleção Amigável:** A exclusão de recursos utiliza o padrão de "caminho seguro" (botão lixeira, dialogs de exclusão de metas e transações separados da edição comum).

## Repositório Local
Os artefatos brutos (HTMLs e Screenshots) aprovados e gerados no Stitch foram sincronizados para a pasta local `docs/screens/` no repositório. Esses arquivos servem de base mockada para a implementação em Swift/Kotlin/React Native.
