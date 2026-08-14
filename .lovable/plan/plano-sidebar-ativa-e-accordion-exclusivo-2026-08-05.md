# Plano: Sidebar ativa e accordion exclusivo

## Objetivo
Deixar o menu da sidebar com destaque visual real baseado na rota atual (título do bloco + item ativo) e transformar os blocos em accordion exclusivo: apenas um aberto por vez, começando com "Explorar licitações" expandido.

## O que será alterado

### 1. Dados de navegação com rotas
- Incluir `url` em cada item do menu (`/dashboard`, `/licitacoes/buscar`, `/categorias`, `/itens`, `/filtros`, `/minhas-licitacoes`, `/pipeline`, `/bot-lances`, `/documentos`, `/raio-x`, `/score-orgaos`, `/empresas-monitoradas`, `/concorrentes`, `/relatorios`, `/equipe`, `/integracoes`, `/planos`, `/alertas`, `/configuracoes`, `/ajuda`).
- Rotas ainda não existem; os links usarão `<Link>` do TanStack Router e só `/dashboard` funcionará nesta rodada. As demais URLs preparam a estrutura para quando as rotas forem criadas.

### 2. Destaque do item ativo
- Substituir a prop manual `active` por detecção automática via `useRouterState` ou `activeProps` do `<Link>`.
- Manter o estilo atual: fundo `bg-brand-tint`, texto `text-brand-strong` e ícone `text-brand`.
- No modo colapsado, o tooltip do item ativo também reflete o estado ativo.

### 3. Destaque do título do bloco ativo
- Quando algum item dentro de um bloco estiver na rota atual, o cabeçalho daquele bloco ganha destaque adicional (por exemplo, barra lateral verde ou fundo mais escuro) além do estilo de pill atual.
- No modo colapsado, o separador de grupo ativo muda de cor para indicar o bloco correspondente.

### 4. Accordion exclusivo
- Trocar o estado de `Set<string>` para `string | null`.
- Ao clicar em um bloco, ele abre e fecha qualquer outro bloco aberto.
- Estado inicial: apenas "Explorar licitações" aberto; os demais blocos fechados.
- O bloco "Workspace" (Visão geral) continua sempre visível, sem accordion.

### 5. Acessibilidade
- Preservar `aria-expanded`, `aria-current="page"` e tooltips no modo colapsado.
- Garantir que o drawer mobile continue sempre expandido, sem accordion colapsado.

## Escopo desta rodada
- Alterar apenas os componentes de layout da sidebar (`Sidebar.tsx`, `SidebarNavItem.tsx`) e, se necessário, ajustar passagem de props em `AppLayout.tsx`.
- Não criar novas rotas além de `/dashboard` nesta rodada.
- Validar visualmente via preview/screenshot no desktop e no mobile.
