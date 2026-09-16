# Plano de implementação do sistema de SEO — LicitaBase

Data: 16 de setembro de 2026
Base: `docs/SEO_GAP_ANALYSIS.md` e a especificação mestre fornecida pelo usuário.

## Princípios de execução

- Preservar TanStack Start, SSR, URLs publicadas e componentes atuais sempre que possível.
- Não editar manualmente `src/routeTree.gen.ts`.
- Não sobrescrever alterações locais pré-existentes sem revisar o contexto.
- Não indexar rotas privadas, páginas de resultado interno, tokens, filtros arbitrários ou ambientes de preview.
- Não alegar ranking garantido, indexação garantida ou dados de Search Console inexistentes.
- Não automatizar publicação de conteúdo sem validação de intenção, fontes, valor único e revisão humana.

## Fase 0 — Auditoria e planejamento

Status: concluída em 16 de setembro de 2026.

Entregas:

- `docs/SEO_GAP_ANALYSIS.md`;
- este plano;
- guardrails permanentes resumidos em `AGENTS.md`;
- inventário da arquitetura atual e dos bloqueios externos.

## Fase 1 — Fundação de rastreamento e indexação

Objetivo: tornar explícito o que pode ser indexado e impedir regressões graves.

Status: parcialmente concluída em ambiente local; ainda sem commit, push ou deploy.

Implementação entregue:

1. `src/lib/seo.ts` estabelece URL canônica, metadados reutilizáveis e schemas de artigo/breadcrumb.
2. `scripts/seo-public-routes.cjs` estabelece a allowlist das nove URLs públicas indexáveis.
3. `scripts/generate-seo-artifacts.cjs` gera `public/sitemap.xml` e `public/robots.txt`; previews e desenvolvimento saem bloqueados, produção sai permitida.
4. Áreas autenticadas, `/bot-lances`, confirmação de compra e a LP alternativa `/2` agora recebem `noindex, nofollow`.
5. A landing principal recebeu canonical; post inexistente passou a responder com 404 real.
6. `seo:check` e `seo:smoke` passaram a validar esses contratos no build/localmente.

Implementação proposta originalmente:

1. Criar uma configuração SEO central com host canônico e política por ambiente.
2. Criar allowlist/registro de tipos de rota indexáveis e regras padrão de `noindex` para áreas privadas e estados utilitários.
3. Centralizar canonical absoluto, meta robots e locale; manter o comportamento atual das URLs de blog.
4. Substituir sitemap manual por geração determinística a partir do registro de conteúdo público; usar `lastmod` somente com data de alteração material.
5. Ajustar `robots.txt` para declarar o sitemap gerado e proteger ambientes não produtivos pelo mecanismo compatível com a arquitetura de deploy.
6. Criar testes de resposta HTTP para URLs indexáveis, 404, canonical, meta robots e entradas do sitemap.
7. Inventariar redirecionamentos, sem alterar `/` para `/lp` até a decisão de produto.

Saídas esperadas:

- rota/artefato de sitemap automático;
- política de indexação verificável;
- testes `seo:check` e smoke tests SSR;
- documentação de indexação e redirecionamento.

## Fase 2 — Metadata e dados estruturados reutilizáveis

Objetivo: eliminar divergência entre tipos de página e tornar os metadados completos e testáveis.

Status: concluída em ambiente local; ainda sem commit, push ou deploy.

Implementação entregue:

1. `createPageSeo`, `createBlogPostingSchema` e `createBreadcrumbListSchema` agora são reutilizados pelas páginas públicas principais e pelos blogposts.
2. Os schemas de artigo incluem URL canônica, `mainEntityOfPage`, datas, imagem, publisher e URL da organização autora.
3. O catálogo editorial de cada post está em `src/content/blog-editorial.ts`, com intenção, cluster, pilar, consultas secundárias, CTA, autor, revisão, fontes e status.

Pendências desta fase: schemas específicos de `WebSite`/`SoftwareApplication`, quando houver dados de produto aprovados, e regras adicionais do auditor para H1, duplicidade e JSON-LD.

Implementação proposta:

1. Criar helper tipado de `PageSeo` para título, descrição, canonical, robots, OG/Twitter e imagem social.
2. Criar schemas reutilizáveis para `Organization`, `WebSite`, `BlogPosting`, `BreadcrumbList` e, quando aplicável, `SoftwareApplication`.
3. Garantir que os artigos incluam `headline`, imagem, datas, `author.url`, publisher e `mainEntityOfPage` quando os dados existirem.
4. Adicionar validação de título duplicado, H1 ausente, description ausente, canonical inválido e JSON-LD malformado.

## Fase 3 — Arquitetura editorial e blogpost

Objetivo: permitir criação previsível de posts sem duplicar templates ou canibalizar intenções.

Status: em andamento. O catálogo editorial está criado, sem mudar slugs nem publicar novo conteúdo. A migração do template pilar específico para o mesmo renderer dos satélites deve preservar sua experiência visual antes de remover o componente dedicado.

Implementação proposta:

1. Unificar pilar e satélites em um modelo de conteúdo único, mantendo variantes visuais necessárias.
2. Migrar o catálogo inicial para conteúdo versionado em Git (MDX/JSON/TypeScript validado), sem mudar slugs existentes.
3. Introduzir campos: tópico principal, intenção, cluster, página-pilar, consultas secundárias, entidades, SEO title, H1, slug, canonical, imagem, alt, CTA, autor, revisor, fontes, datas, status e links relacionados.
4. Criar páginas de autor/revisor e bloco visível de fontes para temas que dependem de legislação, editais ou orientações oficiais.
5. Criar regras para links internos contextuais, relacionados e relação pilar-satélite.
6. Criar warnings de página órfã, intenção duplicada, título/H1 similar e risco de conteúdo repetitivo.

## Fase 4 — Experiência, mídia e performance

Objetivo: proteger conteúdo indexável em mobile e reduzir problemas que prejudiquem experiência de página.

Implementação proposta:

1. Auditar LCP, CLS, INP, imagens, fontes, JS e carregamento de terceiros nas rotas públicas.
2. Padronizar imagens de blog com `width`, `height`, `alt`, prioridade de LCP e lazy loading abaixo da dobra.
3. Validar mobile sem overflow, legibilidade, navegação por teclado e conteúdo equivalente ao desktop.
4. Definir orçamento de performance e testes práticos no CI quando a infraestrutura permitir.

## Fase 5 — Auditor SEO e gate de CI

Objetivo: detectar regressões antes do deploy.

Implementação proposta:

1. Criar auditor local que percorra as rotas públicas registradas.
2. Validar HTTP, indexabilidade, canonical, robots, sitemap, links internos, imagens, schema, títulos/H1 e metadata.
3. Emitir warnings para orfandade, links quebrados, canibalização e páginas potencialmente finas.
4. Adicionar scripts de build: lint → typecheck/build → `seo:check` → smoke de rotas públicas.
5. Bloquear apenas falhas críticas; avisos editoriais não devem quebrar o build sem revisão.

## Fase 6 — Fluxo editorial e automação de blogposts

Objetivo: automatizar preparação e validação, não a publicação indiscriminada.

Fluxo:

```text
Consulta/dor real
→ pauta priorizada
→ briefing SEO
→ outline e rascunho assistidos por IA
→ fontes e exemplo original
→ revisão humana/factual
→ validador SEO
→ preview
→ publicação agendada
→ sitemap e monitoramento
```

O briefing automático conterá intenção, público, cluster, assunto primário, consultas secundárias, páginas relacionadas, CTA, fontes obrigatórias e um diferencial editorial. O gerador pode produzir rascunho e sugestões; ele não poderá aprovar nem publicar sozinho.

Regras de bloqueio de publicação:

- assunto/intenção duplicados sem justificativa;
- fontes ausentes para afirmações sensíveis;
- autor ou revisor ausente quando obrigatório;
- slug/canonical inválidos;
- links internos quebrados;
- página órfã;
- schema ou metadados críticos inválidos;
- conteúdo baseado apenas em paráfrase sem valor próprio.

## Fase 7 — Integrações de dados

Objetivo: priorizar conteúdo com dados reais, quando houver autorização.

Integrações opcionais:

- Google Search Console: consultas, páginas, cliques, impressões, CTR e posição média;
- analytics: landing orgânica, CTA, cadastro e ativação;
- Google Ads Keyword Planner ou exportação manual: volume e variações de pesquisa;
- CMS, se o time optar por deixar o Git-first.

Dependências: propriedade verificada, OAuth/service account autorizado, consentimento de analytics e definição do responsável pelos dados. Sem essas credenciais, o sistema opera com briefings manuais e não inventa métricas.

## Fase 8 — Inteligência e ciclo de otimização

Objetivo: transformar dados em uma fila editorial de melhoria.

Relatórios planejados:

- oportunidades de CTR: muitas impressões e CTR baixo;
- quick wins: posição média aproximada entre 4 e 10;
- striking distance: posição média aproximada entre 11 e 20;
- perda de desempenho e páginas desatualizadas;
- consultas que o conteúdo ainda não responde;
- possível canibalização por consulta;
- conversões e CTA por cluster.

Esses relatórios orientam a priorização; não são fatores de ranking nem pontuação do Google.

## Ordem de implantação recomendada

1. Fases 1 e 2: base técnica, metadados e testes.
2. Fase 3: modelo de conteúdo e cluster atual.
3. Fase 5: auditor e proteção de CI.
4. Fase 4: performance e experiência, com métricas reais.
5. Fase 6: workflow de rascunho, revisão e publicação.
6. Fases 7 e 8: integrações e inteligência após acesso aos dados.

## Primeira entrega técnica proposta

A primeira alteração na aplicação deve ser pequena e reversível: registro SEO das rotas públicas, helper de metadata/robots, geração de sitemap e testes de indexação. Ela não cria posts novos, não altera o conteúdo existente, não conecta contas externas e não muda redirecionamentos públicos.

Antes de modificar a URL raiz, são necessárias as decisões listadas no gap analysis. As demais fases podem avançar sem credenciais externas, respeitando os arquivos locais já modificados.
