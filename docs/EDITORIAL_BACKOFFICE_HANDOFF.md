# Backoffice editorial — referência de implementação

## Finalidade e limite atual

Este módulo é uma referência navegável para o futuro backoffice editorial da LicitaBase. Ele não é um CMS em produção e não fornece acesso a dados de clientes.

- A rota `/editorial-preview` pode ser aberta para validação visual enquanto o protótipo não está conectado a dados reais.
- Ela continua com `noindex, nofollow` e não aparece na navegação do produto.
- Os dados são fixtures em memória; não existe banco, chave de IA, API ou publicação.
- A rota não aparece na navegação da área do cliente e não entra no sitemap.

## O que pode ser reaproveitado

```text
src/features/editorial/types.ts
  Contratos de artigo, briefing, status, repositório e provedor de rascunho.

src/features/editorial/fixtures.ts
  Dados demonstrativos. Remover ao conectar a fonte real.

src/features/editorial/mock-adapters.ts
  Implementações temporárias das interfaces. Substituir sem reescrever a UI.

src/features/editorial/EditorialBackofficePrototype.tsx
  Referência visual e de fluxo: biblioteca → briefing → preview/revisão.
```

## Segurança do admin definitivo

Quando o CMS real receber autenticação, banco ou IA, ele deve ficar em uma rota ou aplicação administrativa separada, por exemplo `/admin/editorial`. Não basta esconder links na interface.

1. O servidor autentica a sessão.
2. O servidor consulta a função do membro da equipe.
3. Apenas os cargos abaixo recebem dados ou podem executar ações.

| Papel                           | Pode fazer                                                                           |
| ------------------------------- | ------------------------------------------------------------------------------------ |
| `editorial_admin`               | configurar provedores, publicar, agendar, gerenciar permissões e reverter publicação |
| `editor`                        | criar briefing, gerar rascunho e editar conteúdo                                     |
| `reviewer`                      | revisar, aprovar ou devolver conteúdo                                                |
| `customer` / usuário LicitaBase | nenhum acesso; API deve responder `403`                                              |

Todas as permissões precisam ser verificadas em funções de servidor e na camada de banco. Um guard somente no frontend não é suficiente.

## Estado editorial

```text
draft → in_review → approved → scheduled → published → archived
```

Transições que precisam de auditoria:

- `in_review → approved`: quem aprovou, quando e quais pendências foram conferidas;
- `approved → scheduled`: data, timezone e responsável;
- `scheduled → published`: confirmação de publicação e URL final;
- qualquer retorno para `draft` ou `archived`: motivo obrigatório.

Somente `published` pode ficar público, aparecer em `/blog`, ser indexado, entrar no sitemap e receber links internos de outros artigos.

## Contrato de banco recomendado

```text
editorial_articles
  id, slug, title, seo_description, body, category_id, cluster_id,
  primary_keyword, search_intent, hero_image_id, status,
  author_id, reviewer_id, published_at, scheduled_for,
  created_at, updated_at

editorial_briefs
  id, article_id, topic, audience, secondary_keywords,
  source_requirements, internal_link_targets, call_to_action,
  created_by, created_at

editorial_revisions
  id, article_id, content_snapshot, change_summary,
  created_by, created_at

editorial_reviews
  id, article_id, decision, checklist_snapshot, notes,
  reviewed_by, reviewed_at

editorial_publication_events
  id, article_id, action, previous_status, next_status,
  actor_id, metadata, created_at
```

Impor índice único para `editorial_articles.slug`. Nunca reutilizar um slug publicado sem redirecionamento explícito.

## APIs privadas recomendadas

```text
GET    /api/admin/editorial/articles
POST   /api/admin/editorial/articles
PATCH  /api/admin/editorial/articles/:id
POST   /api/admin/editorial/articles/:id/draft
POST   /api/admin/editorial/articles/:id/review
POST   /api/admin/editorial/articles/:id/schedule
POST   /api/admin/editorial/articles/:id/publish
POST   /api/admin/editorial/articles/:id/archive
GET    /api/admin/editorial/articles/:id/preview
```

Cada endpoint deve validar a sessão, o papel, a transição de status e o payload no servidor. O provedor de IA só pode ser chamado pelo endpoint `draft`; a chave fica em variável de ambiente do servidor.

## Contrato de IA

O `DraftProvider` atual é um mock. A implementação real deve receber um briefing validado e devolver saída estruturada:

```text
title
slug
metaDescription
outline
body
faq
suggestedInternalLinks
reviewNotes
```

A IA não define publicação. Ela não deve inventar regras, dados jurídicos, prazos ou fontes. Quando o tema pedir informação verificável, o rascunho deve sinalizar a fonte oficial necessária para a revisão humana.

## Integração ao blog público

1. Publicar o artigo no banco como `published`.
2. Invalidar/revalidar o cache da listagem `/blog` e do slug correspondente.
3. Gerar `title`, description, canonical, Open Graph, `BlogPosting`, breadcrumb e imagem social com os dados do artigo.
4. Adicionar somente URLs publicadas ao sitemap.
5. Aplicar links internos apenas para posts com status `published`.
6. Manter `noindex` em previews, rascunhos e rotas administrativas.

## Próxima etapa para o programador

Substituir os dois adapters mock por implementações reais, sem acoplar a UI ao provedor:

```ts
class ProductionEditorialRepository implements EditorialRepository {}
class OpenAiDraftProvider implements DraftProvider {}
```

Depois, mover a tela para o admin autenticado real e restringir ou remover a rota `/editorial-preview`. Antes da primeira publicação, configurar Search Console, sitemap de produção, analytics e um processo de revisão editorial.
