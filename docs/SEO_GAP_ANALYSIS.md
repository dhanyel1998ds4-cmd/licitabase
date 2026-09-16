# SEO gap analysis — LicitaBase

Data da auditoria: 16 de setembro de 2026
Escopo: rotas públicas, blog, renderização, rastreamento, indexação, metadados e base para operação editorial.
Fonte de verdade: `SEO_OPERATING_SYSTEM_MASTER.md` fornecido pelo usuário; quando houver conflito, prevalecem requisitos reais do produto e as políticas atuais do Google.

## Resumo executivo

A LicitaBase já possui uma fundação editorial utilizável: TanStack Start com SSR, sete URLs de blog, metadados por artigo, canonical, Open Graph, `BlogPosting`, `BreadcrumbList`, `robots.txt`, sitemap e links para conteúdos relacionados. Isso é um ponto de partida; não é ainda um sistema de SEO operável e seguro contra regressões.

As maiores lacunas são: regras de indexação explícitas por ambiente e tipo de rota, sitemap gerado a partir da fonte de conteúdo, modelo editorial unificado, páginas de autor/revisor e fontes, validações automatizadas de SEO, monitoramento de Search Console/analytics e uma política para impedir canibalização e publicação automática de conteúdo fraco.

O objetivo não é prometer posição no Google. É remover barreiras técnicas, tornar a intenção de indexação verificável e criar um fluxo editorial que gere conteúdo útil, rastreável e mensurável.

## Estado do repositório durante a auditoria

- Branch atual: `codex/participacao-e-disputa`.
- A árvore de trabalho já contém alterações e arquivos não rastreados, inclusive em `public/robots.txt`, `public/sitemap.xml`, `src/content/` e rotas do blog.
- Nenhum desses arquivos foi sobrescrito durante a auditoria.
- Os documentos desta pasta são novos e não alteram a aplicação publicada.

## Arquitetura observada

| Item | Estado atual | Evidência |
| --- | --- | --- |
| Framework | TanStack Start + React + Vite + TypeScript | `package.json`, `vite.config.ts` |
| Renderização | SSR configurado com entrada Nitro própria | `vite.config.ts`, `src/server.ts`, `src/start.ts` |
| Rotas | File-based routing TanStack | `src/routes/`, `src/routeTree.gen.ts` |
| Conteúdo do blog | Dados TypeScript estáticos + uma página-pilar com implementação própria | `src/content/blog-articles.ts`, `src/routes/blog.*.tsx` |
| Deploy | Arquitetura compatível com Vercel/Lovable | configurações e histórico do projeto |
| Testes SEO | Não foi encontrado runner ou script SEO dedicado | `package.json`, busca por testes/configurações |

## Inventário de SEO atual

### O que já existe

1. **Blog publicado**
   - Hub: `/blog`.
   - Página-pilar: `/blog/como-participar-de-licitacao`.
   - Seis artigos satélites no catálogo atual.
   - URLs legíveis, estáveis e orientadas ao assunto.

2. **Metadados dos artigos**
   - Título único por artigo, meta description, canonical absoluto, OG, Twitter Card, imagem social e datas.
   - Os satélites têm um template dinâmico em `src/routes/blog.$slug.tsx`.
   - A página-pilar possui implementação separada em `src/routes/blog.como-participar-de-licitacao.tsx`.

3. **Dados estruturados**
   - `BlogPosting` e `BreadcrumbList` nos artigos.
   - Datas, imagem, categoria e organização autora estão presentes.

4. **Descoberta**
   - `public/robots.txt` permite rastreamento e declara `https://licitabase.vercel.app/sitemap.xml`.
   - `public/sitemap.xml` lista `/lp`, `/blog` e os sete artigos atuais.

5. **Links internos**
   - Breadcrumbs, conteúdos relacionados e links contextuais entre os artigos do cluster inicial.

### Riscos e lacunas priorizados

| Prioridade | Lacuna | Risco / impacto | Correção prevista |
| --- | --- | --- | --- |
| P0 | Regras de indexação por rota e ambiente não são centralizadas | Smoke test confirmou `/dash2`, subrota interna e `/bot-lances` indexáveis por padrão | Política central de `robots`, allowlist de rotas indexáveis e testes de ambiente |
| P0 | Sitemap é um XML manual | Publicações podem ficar fora do sitemap; `lastmod` pode divergir da mudança real | Registro de conteúdo/rotas e geração automática no build |
| P0 | Status 404, noindex e sitemap verificados por HTTP | `/blog/nao-existe` confirmou soft 404 (HTTP 200); sitemap e robots respondem 200 | Corrigir semântica de not-found e manter smoke tests SSR |
| P1 | A raiz `/` redireciona para `/dash2`, enquanto a landing pública é `/lp` | Estratégia de URL pública/canonical não está explícita | Decisão de produto antes de alterar redirects; não mudar silenciosamente |
| P1 | Página-pilar e satélites usam dois modelos de conteúdo/renderização | Duplicação, automação difícil e risco de metadata/schema divergentes | Modelo único de conteúdo com variações de layout quando necessário |
| P1 | Não há camada reutilizável de metadados por tipo de página | Canonical, OG, robots e schema podem divergir entre rotas | Utilitário SEO tipado por tipo de rota |
| P1 | Nenhuma regra de autoria, revisão e fontes estruturadas | Menos confiança em temas de licitação e maior risco factual | Entidades `Author`, `Reviewer`, `Source` e páginas de autor |
| P1 | Não há validações SEO em CI | Regressões de `noindex`, links quebrados, títulos duplicados ou sitemap inválido passam despercebidas | `seo:check` e testes de rotas públicas no pipeline |
| P2 | Links relacionados são definidos manualmente sem relatório de páginas órfãs | Novos artigos podem nascer sem contexto interno | Grafo de cluster e auditor de links/orfandade |
| P2 | Não há proteção contra canibalização | Variações do mesmo tema podem competir entre si | Avisos por intenção, assunto, título/H1 e similaridade |
| P2 | Não há auditoria de mídia/performance do blog | Imagens e fontes podem afetar LCP/CLS sem alerta | Inventário de imagens, largura/altura, auditoria de performance |
| P3 | Search Console e analytics não estão integrados no repositório | Não há priorização por impressões, CTR, posição ou conversão | Integrações opcionais após credenciais |

## Observações técnicas importantes

### Indexação

O `robots.txt` atual permite todos os caminhos. Isso não é uma política de indexação completa: `robots.txt` não substitui meta robots/canonical e não diferencia produção de preview. A primeira fase deve declarar quais tipos de rota pública podem ser indexados e quais não podem.

Especial atenção para rotas autenticadas, painéis, resultados internos, filtros salvos, links com token, onboarding, login, cadastro e páginas de obrigado. A decisão não deve depender de cada desenvolvedor lembrar de adicionar `noindex` manualmente.

### Smoke test SSR local — 16/09/2026

O servidor local TanStack Start respondeu HTML SSR nas rotas avaliadas. Resultado observado:

| URL | HTTP | Canonical | Robots | Resultado |
| --- | --- | --- | --- | --- |
| `/blog` | 200 | `https://licitabase.vercel.app/blog` | ausente | Elegível por padrão; canonical presente |
| `/blog/como-participar-de-licitacao` | 200 | presente | ausente | `BlogPosting` presente |
| `/blog/documentos-necessarios-para-licitacao` | 200 | presente | ausente | `BlogPosting` presente |
| `/blog/nao-existe` | **200** | ausente | ausente | **soft 404 confirmado** |
| `/robots.txt` | 200 | — | — | sitemap declarado |
| `/sitemap.xml` | 200 | — | — | XML entregue |
| `/` | 307 para `/dash2` | — | — | decisão de URL pública pendente |
| `/lp` | 200 | ausente | ausente | landing indexável por padrão, sem canonical próprio |
| `/login` | 200 | ausente | `noindex, nofollow` | protegido individualmente |
| `/cadastro` | 200 | ausente | ausente | intenção de indexação precisa ser decidida |
| `/obrigado` | 200 | ausente | ausente | deveria ser avaliada para `noindex` |
| `/2` | 200 | ausente | ausente | rota pública/experimental sem política explícita |
| `/dash2` | 200 | ausente | ausente | **área interna indexável por padrão** |
| `/dash2/oportunidades/novas` | 200 | ausente | ausente | **área interna indexável por padrão** |
| `/bot-lances` | 200 | ausente | ausente | **área interna indexável por padrão** |

Esse teste não foi executado contra o domínio de produção e não prova o estado de indexação no Google. Ele prova que a regra local precisa ser corrigida e transformada em teste automatizado.

### Conteúdo

O cluster inicial é coerente:

```text
Como participar de licitação (pilar)
├── Encontrar licitações abertas
├── Documentos necessários
├── Como ler edital
├── Proposta de preços
├── Pregão eletrônico
└── Cadastro da empresa
```

Ele precisa evoluir para campos editoriais explícitos: intenção, cluster, pilar, consultas secundárias, entidades, autor, revisor, fontes, CTA, links internos, status e datas reais.

Não haverá meta keywords, densidade artificial, páginas de sinônimos ou produção em massa de textos fracos. Cada post precisa resolver uma intenção diferente e acrescentar valor próprio.

### Dados estruturados

`BlogPosting` e breadcrumbs já são um bom começo. Ainda faltam uma organização reutilizável completa, autor com URL/página, revisor quando aplicável, validação de schema e uma política de schema por tipo de página. Markup estruturado descreve conteúdo; não garante rich result ou ranking.

### Renderização e 404

O projeto tem SSR configurado, o que é positivo. Mesmo assim, a auditoria precisa executar requisições reais contra o servidor de produção/preview para confirmar HTML renderizado, resposta 200/404, canonical, meta robots e links; a inspeção de código não prova o comportamento HTTP final.

## Dependências externas não encontradas

Nenhuma credencial ou configuração ativa foi encontrada para:

- Google Search Console;
- Google Analytics;
- Google Ads Keyword Planner;
- CMS externo;
- monitoramento de Core Web Vitals.

Esses itens permanecerão como integrações opcionais. Nenhum dado será inventado e nenhuma conexão será criada sem autorização e credenciais do proprietário.

## Decisões de produto que exigem confirmação antes de alterar URLs

1. A URL pública principal deve continuar sendo `/lp` ou o site público deve ocupar `/`? Hoje `/` redireciona para `/dash2`.
2. Quais páginas públicas, além de `/lp`, `/blog` e `/blog/*`, devem ser indexáveis? Por exemplo: comparação de planos, integrações, cadastro e agradecimento.
3. Quem será autor e/ou revisor responsável pelo conteúdo com referência a regras, editais e processos públicos?
4. O fluxo editorial começa em Git/MDX, CMS externo ou painel interno? A recomendação inicial é Git/MDX por preservar o modelo atual e permitir revisão via pull request.

## Critério de aprovação da fase 0

- [x] Documentação fonte de verdade lida na ordem pedida.
- [x] Arquitetura, rotas de blog, renderização, sitemap, robots e metadata inspecionados.
- [x] Alterações pré-existentes preservadas.
- [x] Lacunas priorizadas registradas.
- [x] Plano de implementação criado antes de mudanças de produto.
