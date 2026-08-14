<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

<!-- INTERNAL-UI-STANDARD:BEGIN -->
## Regra obrigatória — telas internas da LicitaBase

Use a skill local `$dash2-internal-ui` em toda criação, alteração ou revisão de páginas, rotas, subrotas, menus, submenus, abas, painéis, drawers e modais da área autenticada do produto.

### Referências protegidas

- `/dash2` é a fonte de verdade visual para shell, densidade, tipografia, cores, espaçamentos, margens, paddings, largura útil, cards, bordas, sombras e responsividade.
- `/dash2/oportunidades/novas` é uma segunda referência já aprovada para páginas internas de fluxo.
- **Não modifique nenhuma dessas duas rotas nem seus componentes exclusivos**, a menos que o usuário solicite explicitamente a alteração citando a rota exata.
- Ao padronizar outras páginas, copie os princípios e reutilize os componentes; nunca “corrija” a referência para acomodar uma implementação divergente.

### Escopo

Esta regra abrange todas as telas internas atuais e futuras, especialmente `/dash2/*` e `/bot-lances/*`. Não se aplica às superfícies públicas, como `/lp`, `/login` e páginas públicas de comparação de planos.

### Contrato de implementação

1. Preserve o shell existente: `AppLayout`, uma única `Sidebar` e uma única `Topbar`. Não recrie sidebar, header ou design system.
2. Reutilize primeiro os componentes de `src/components/dash2`, `src/components/layout` e `src/components/ui`.
3. Use como ritmo-base do conteúdo interno: `px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8` e `space-y-5 sm:space-y-6`, salvo necessidade funcional comprovada.
4. Cards e painéis devem seguir a densidade da visão geral: `rounded-2xl`, borda `border-hairline`, fundo branco, sombra sutil e padding responsivo de `p-4 sm:p-5` ou equivalente existente.
5. Não centralize a página em um `max-width` arbitrário que gere grandes áreas vazias. Use toda a largura útil disponibilizada pelo shell.
6. Devido aos estilos públicos globais de `section`, toda `section` interna deve usar `py-0`; prefira `Panel` ou `BotPanel`, que já neutralizam esse comportamento.
7. Mobile `< 768px`: uma coluna, sem overflow horizontal, controles com alvo mínimo de 44 px e filtros/ações secundárias em Sheet/Drawer quando necessário. Não comprima a versão desktop.
8. Tablet `768–1279px`: reorganize grids e painéis progressivamente. Desktop `>= 1280px`: mantenha alta densidade informacional e alinhamento com a `/dash2`.
9. Abas, tabelas, filtros, drawers, modais e estados loading/empty/error também fazem parte da página e devem ser verificados em todos os breakpoints.
10. Não edite `src/routeTree.gen.ts` manualmente.

### Registro e validação obrigatórios

- Registre toda nova rota interna em `scripts/internal-routes.manifest.cjs`.
- Execute `npm run check:internal-ui` após criar ou remover rotas.
- Execute `npm run verify:internal-ui` com o servidor local ativo para verificar desktop, notebook, tablet e mobile.
- Antes de concluir, execute lint, TypeScript e build, além de verificar ausência de overflow horizontal e navegação por teclado.
- O build valida automaticamente o catálogo de rotas internas; uma rota nova não registrada deve falhar até ser incluída no manifesto.

Leia o contrato detalhado em `.agents/skills/dash2-internal-ui/references/internal-ui-standard.md`.
<!-- INTERNAL-UI-STANDARD:END -->
