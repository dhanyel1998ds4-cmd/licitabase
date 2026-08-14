# Padrão de UI interna — LicitaBase

## Objetivo e referências

Este padrão regula todas as superfícies autenticadas (`/dash2/*` e `/bot-lances/*`).

- `/dash2` é a referência visual principal para shell, densidade, tipografia, cores, largura útil, cards e responsividade.
- `/dash2/oportunidades/novas` é a referência complementar para fluxos internos.
- Essas referências não devem ser alteradas para acomodar telas divergentes.

## Shell e estrutura

1. Use sempre `AppLayout`, com uma única `Sidebar` e uma única `Topbar`.
2. Não recrie navegação, logo, header global ou tokens locais por página.
3. O conteúdo interno ocupa a largura útil do shell; não introduza um `max-width` que crie grandes áreas vazias.
4. Use como container de página:

```tsx
<div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-8">
  <div className="space-y-5 sm:space-y-6">...</div>
</div>
```

5. Toda `section` interna precisa de `py-0`, pois estilos públicos globais não podem afetar a área autenticada. Prefira `Panel`.

## Componentes obrigatórios e reutilização

| Necessidade | Primeira escolha |
| --- | --- |
| Card, painel e empty state | `Panel` em `src/components/dash2/Panel.tsx` |
| Bot e sessões | `BotPanel`/primitivas em `src/components/dash2/BotPrimitives.tsx` |
| Botões e campos | `src/components/ui/button.tsx`, `input.tsx`, `checkbox.tsx`, `form.tsx` |
| Abas | `src/components/ui/tabs.tsx` |
| Modal de confirmação | `src/components/ui/dialog.tsx` ou `alert-dialog.tsx` |
| Drawer/ações no mobile | `sheet.tsx` ou `drawer.tsx` |
| Feedback transitório | `sonner` |
| Skeleton | `src/components/ui/skeleton.tsx` |
| Estados de página | `src/components/dash2/InternalPageState.tsx` |

Cards/painéis usam `rounded-2xl`, `border-hairline`, fundo branco, sombra sutil e `p-4 sm:p-5` ou equivalente. Não crie uma segunda linguagem visual.

## Página, busca, lista e formulário

- Cabeçalho: contexto em `text-[12px] font-bold text-brand-strong`, título `24–28px` e descrição de `13px`.
- Ações prioritárias são verdes (`#18B849`) e têm alvo mínimo de 44px (`min-h-11`).
- Busca, filtros e tabs devem manter foco visível, rótulos acessíveis e estado vazio claro.
- Listas e tabelas mantêm alta densidade desktop, mas nunca usam overflow horizontal em mobile; mova ações secundárias para Sheet/Drawer quando necessário.
- Formulários mostram validação próxima ao campo, sucesso com toast/notice e confirmação antes de ações destrutivas.
- Use date picker somente quando houver uma decisão dependente de data; reutilize `calendar.tsx` e `popover.tsx`.

## Contrato de estados

Toda tela interna deve decidir explicitamente como reage aos estados abaixo. Não é obrigatório renderizá-los todos ao mesmo tempo.

| Estado | Tratamento esperado |
| --- | --- |
| Default | Dados/ações principais legíveis sem blockers. |
| Loading | Skeleton de geometria próxima ao conteúdo final; preserve o shell. |
| Empty | Explique por que não há dados e ofereça uma próxima ação útil. |
| Error | Explique o problema, preserve contexto e ofereça `Tentar novamente` quando possível. |
| Success | Use toast ou notice curto; não interrompa o fluxo. |
| Sem permissão | Explique a restrição e a ação de contato apropriada; não esconda a causa. |
| Bloqueio por plano | Indique recurso e benefício, com CTA de plano quando autorizado. |
| Offline | Preserve dados já carregados, informe a limitação e evite ações que exigem rede. |
| Atualização | Notice discreto, sem bloquear leitura. |
| Dados desatualizados | Mostre data/origem e ação para atualizar. |
| Alterações não salvas | Antes de sair, abra confirmação com `Continuar editando` e `Descartar alterações`. |

`InternalPageState`, `InternalStatusNotice` e `UnsavedChangesDialog` são as primitivas iniciais desse contrato. Páginas novas devem reutilizá-las ou justificar uma variação.

## Responsividade

- **Desktop (>=1280px):** alta densidade, grids amplos e painéis laterais quando ajudam a decisão.
- **Notebook (1024–1279px):** reduza colunas progressivamente; o shell usa rail compacta.
- **Tablet (768–1023px):** painéis laterais se tornam blocos inferiores ou drawers; não comprima tabelas.
- **Mobile (<768px):** uma coluna, CTA prioritário visível, alvos de 44px, detalhes em página ou drawer/bottom sheet.

Verifique ausência de overflow horizontal, ordem de foco e leitura de telas para todos os breakpoints.

## Checklist de entrega

- [ ] Shell e componentes existentes reutilizados.
- [ ] Todas as `section` internas usam `py-0`.
- [ ] Estado default e estados aplicáveis do contrato definidos.
- [ ] Empty/error/permission/plan têm mensagem e próximo passo.
- [ ] Loading usa skeleton sem deslocamento excessivo.
- [ ] Mobile, tablet, notebook e desktop revisados.
- [ ] Teclado, foco visível, `aria-current`/rótulos e reduced motion revisados.
- [ ] Nova rota incluída em `scripts/internal-routes.manifest.cjs`.
- [ ] `check:internal-ui`, lint, TypeScript e build executados.

## Tela-piloto

`/dash2/operacao/anotacoes` é a primeira aplicação deste contrato. A página mantém o empty state real e aceita `?state=` para QA dos estados `loading`, `error`, `success`, `forbidden`, `plan`, `offline`, `updating`, `stale` e `dirty`.
