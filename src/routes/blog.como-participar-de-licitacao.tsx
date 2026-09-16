import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  ListChecks,
  Share2,
  ShieldCheck,
  Target,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/lp/Footer";
import { Header } from "@/components/lp/Header";
import { getBlogEditorialProfile } from "@/content/blog-editorial";
import {
  createBlogPostingSchema,
  createBreadcrumbListSchema,
  createPageSeo,
  seoCanonical,
} from "@/lib/seo";

const articlePath = "/blog/como-participar-de-licitacao";
const articleUrl = seoCanonical(articlePath);
const articleImage = "/images/blog/como-participar-de-licitacao.png";
const articlePublishedAt = "2026-08-31T12:00:00-03:00";
const articleModifiedAt = "2026-08-31T12:00:00-03:00";
const articleTitle = "Como participar de licitação: guia prático para empresas";
const articleDescription =
  "Aprenda como participar de uma licitação, encontrar oportunidades, organizar documentos e preparar sua proposta com mais segurança.";
const articleEditorialProfile = getBlogEditorialProfile("como-participar-de-licitacao");

const articleStructuredData = [
  createBlogPostingSchema({
    title: articleTitle,
    description: articleDescription,
    canonicalPath: articlePath,
    imagePath: articleImage,
    publishedAt: articlePublishedAt,
    modifiedAt: articleModifiedAt,
    section: "Licitações",
    keywords: articleEditorialProfile?.secondaryQueries ?? [
      "como participar de licitação",
      "licitação",
      "proposta de preços",
      "edital",
    ],
  }),
  createBreadcrumbListSchema([
    { name: "Início", path: "/lp" },
    { name: "Blog", path: "/blog" },
    { name: "Como participar de licitação", path: articlePath },
  ]),
] as const;

const articleSections = [
  ["o-que-e", "O que é uma licitação?"],
  ["encontrar", "Como encontrar oportunidades"],
  ["viabilidade", "Como saber se vale a pena"],
  ["documentos", "Quais documentos costumam ser exigidos"],
  ["proposta", "Como preparar a proposta"],
  ["disputa", "O que acontece durante a disputa"],
  ["resultado", "Como acompanhar o resultado"],
] as const;

const relatedArticles = [
  {
    title: "Documentos necessários para participar de uma licitação",
    description: "O que organizar antes de enviar uma proposta.",
    href: "/blog/documentos-necessarios-para-licitacao",
    image: "/images/blog/documentos-necessarios-para-licitacao.png",
    imageAlt: "Ilustração de documentos organizados, certificados e calendário",
  },
  {
    title: "Como encontrar licitações abertas para sua empresa",
    description: "Crie critérios para não acompanhar oportunidades sem aderência.",
    href: "/blog/como-encontrar-licitacoes-abertas",
    image: "/images/blog/como-encontrar-licitacoes-abertas.png",
    imageAlt: "Ilustração de mapa, bússola e lupa para encontrar oportunidades",
  },
  {
    title: "Como montar uma proposta de preços",
    description: "Itens, quantidades e revisões antes do envio.",
    href: "/blog/como-montar-proposta-precos-licitacao",
    image: "/images/blog/como-montar-proposta-precos-licitacao.png",
    imageAlt: "Ilustração de calculadora, etiquetas e itens para proposta de preços",
  },
] as const;

export const Route = createFileRoute("/blog/como-participar-de-licitacao")({
  head: () =>
    createPageSeo({
      title: `${articleTitle} | LicitaBase`,
      description: articleDescription,
      canonicalPath: articlePath,
      imagePath: articleImage,
      imageAlt: "Ilustração de documentos, checklist e calculadora para participação em licitações",
      kind: "article",
      publishedAt: articlePublishedAt,
      modifiedAt: articleModifiedAt,
    }),
  component: BlogArticlePage,
});

function ShareArticleButton() {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Como participar de licitação: guia prático para empresas",
          url: articleUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Closing the native sharing UI is an expected action, not an app error.
    }
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-brand/30 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      {copied ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
      {copied ? "Link copiado" : "Compartilhar"}
    </button>
  );
}

function BlogArticlePage() {
  return (
    <div className="lp-page min-h-screen w-full overflow-x-clip bg-[#f8fbf9] font-manrope text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <Header forceSolid />
      <main className="pt-32 sm:pt-36">
        <article>
          <header className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <nav aria-label="Navegação estrutural" className="mb-7 text-sm text-slate-500">
              <Link to="/lp" className="transition hover:text-brand-strong">
                Início
              </Link>
              <span aria-hidden="true" className="mx-2 text-slate-300">
                /
              </span>
              <span>Blog</span>
              <span aria-hidden="true" className="mx-2 text-slate-300">
                /
              </span>
              <span className="text-slate-700">Começar em licitações</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
              <div className="max-w-4xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-tint px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                  <BookOpen size={14} aria-hidden="true" />
                  Guia para iniciantes
                </div>
                <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
                  Como participar de licitação: guia prático para empresas
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                  Entenda as etapas, os documentos e como encontrar oportunidades compatíveis antes
                  de enviar uma proposta.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">Por Equipe LicitaBase</span>
                  <span aria-hidden="true" className="text-slate-300">
                    •
                  </span>
                  <span>Publicado em 31 de agosto de 2026</span>
                </div>
              </div>

              <div className="rounded-2xl border border-brand/20 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                  Comece por aqui
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Salve este guia para consultar antes de avaliar seu próximo edital.
                </p>
                <div className="mt-4">
                  <ShareArticleButton />
                </div>
              </div>
            </div>
          </header>

          <figure className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <img
              src={articleImage}
              alt="Ilustração de documentos, checklist e calculadora para participação em licitações"
              className="aspect-[16/8] w-full rounded-2xl border border-brand/20 object-cover shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
            />
          </figure>

          <div className="border-y border-brand/20 bg-gradient-to-r from-brand-tint via-white to-brand-tint">
            <div className="mx-auto grid max-w-[1240px] gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:px-8">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-strong text-white shadow-lg shadow-brand/20">
                <Target size={27} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                  Resposta rápida
                </p>
                <p className="mt-1 max-w-4xl text-lg font-semibold leading-7 text-slate-900">
                  Participar de uma licitação exige identificar uma oportunidade aderente, validar o
                  edital, reunir documentos e enviar uma proposta dentro do prazo.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-[minmax(0,760px)_260px] lg:px-8">
            <div className="min-w-0">
              <section
                aria-labelledby="artigo-indice"
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 text-slate-950">
                  <ListChecks size={19} className="text-brand-strong" aria-hidden="true" />
                  <h2 id="artigo-indice" className="text-base font-bold">
                    Neste artigo
                  </h2>
                </div>
                <ol className="mt-4 grid gap-3 sm:grid-cols-2">
                  {articleSections.map(([id, label], index) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="group flex min-h-11 items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-brand-tint hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition group-hover:bg-brand-tint group-hover:text-brand-strong">
                          {index + 1}
                        </span>
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-10 space-y-11 text-[1.06rem] leading-8 text-slate-700 sm:text-lg">
                <section id="o-que-e" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    O que é uma licitação?
                  </h2>
                  <p className="mt-4">
                    Licitação é o processo usado por órgãos públicos para contratar produtos,
                    serviços ou obras. A empresa interessada apresenta sua proposta e, conforme a
                    modalidade e as regras do edital, pode participar de uma disputa de preços.
                  </p>
                  <p className="mt-4">
                    O edital é o documento central: informa o objeto, as condições de participação,
                    os{" "}
                    <a
                      href="/blog/documentos-necessarios-para-licitacao"
                      className="font-semibold text-brand-strong underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand"
                    >
                      documentos exigidos
                    </a>
                    , os prazos e os critérios de julgamento.
                  </p>
                  <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 text-base leading-7 text-slate-700">
                    <strong className="text-slate-950">Antes de decidir:</strong> confirme se o
                    objeto, a região, a capacidade de entrega e os requisitos do edital são
                    compatíveis com sua operação.
                  </div>
                </section>

                <section id="encontrar" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    Como encontrar oportunidades compatíveis?
                  </h2>
                  <p className="mt-4">
                    O caminho mais eficiente não é acompanhar todos os editais. É criar critérios
                    claros para{" "}
                    <a
                      href="/blog/como-encontrar-licitacoes-abertas"
                      className="font-semibold text-brand-strong underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand"
                    >
                      encontrar oportunidades que sua empresa realmente consegue atender
                    </a>
                    .
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2" role="list">
                    {[
                      "Produtos ou serviços fornecidos",
                      "Cidades, estados ou regiões atendidas",
                      "Faixa de valor viável",
                      "Capacidade de entrega",
                      "Documentos e certificações disponíveis",
                      "Prazo para preparar a proposta",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-xl bg-white p-4 text-base leading-6 shadow-sm ring-1 ring-slate-100"
                      >
                        <CheckCircle2
                          className="mt-0.5 shrink-0 text-brand-strong"
                          size={19}
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <ArticleCta
                    eyebrow="Monitoramento inteligente"
                    title="Encontre editais por categoria, região e termo acompanhado."
                    description="Comece com filtros que representam a realidade da sua operação."
                    href="/lp#busca"
                    label="Conhecer o monitoramento"
                  />
                </section>

                <section id="viabilidade" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    Como saber se vale a pena participar?
                  </h2>
                  <p className="mt-4">
                    Antes de preparar documentos e proposta, faça uma leitura de viabilidade. Essa
                    etapa evita disputar itens fora da capacidade da empresa ou sem margem
                    operacional suficiente. Veja também como{" "}
                    <a
                      href="/blog/como-ler-edital-licitacao"
                      className="font-semibold text-brand-strong underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand"
                    >
                      ler um edital de licitação antes de decidir participar
                    </a>
                    .
                  </p>
                  <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white text-base">
                    <table className="w-full border-collapse text-left">
                      <caption className="sr-only">
                        Perguntas para avaliar a viabilidade de uma licitação
                      </caption>
                      <thead className="bg-slate-50 text-xs uppercase tracking-[0.1em] text-slate-500">
                        <tr>
                          <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                            Pergunta
                          </th>
                          <th scope="col" className="px-4 py-3 font-bold sm:px-5">
                            Por que importa
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {[
                          [
                            "O objeto é compatível?",
                            "Evita disputar itens fora da capacidade da empresa.",
                          ],
                          [
                            "O prazo é suficiente?",
                            "Permite reunir documentos e montar a proposta.",
                          ],
                          [
                            "A documentação está válida?",
                            "Evita inabilitação por certidão vencida.",
                          ],
                          ["O valor faz sentido?", "Ajuda a avaliar margem e custos operacionais."],
                        ].map(([question, answer]) => (
                          <tr key={question}>
                            <th
                              scope="row"
                              className="px-4 py-4 align-top font-semibold text-slate-900 sm:px-5"
                            >
                              {question}
                            </th>
                            <td className="px-4 py-4 align-top sm:px-5">{answer}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                <section id="documentos" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    Quais documentos costumam ser exigidos?
                  </h2>
                  <p className="mt-4">
                    Os documentos variam conforme o edital, mas normalmente envolvem dados
                    cadastrais, regularidade fiscal, qualificação técnica, documentos
                    econômico-financeiros, declarações e proposta comercial.
                  </p>
                  <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-base leading-7 text-amber-950">
                    <div className="flex gap-3">
                      <ShieldCheck
                        className="mt-1 shrink-0 text-amber-600"
                        size={20}
                        aria-hidden="true"
                      />
                      <p>
                        <strong>Importante:</strong> não existe uma lista única válida para todos os
                        processos. O edital sempre prevalece e documentos vencidos podem impedir a
                        habilitação.
                      </p>
                    </div>
                  </div>
                  <ArticleCta
                    eyebrow="Documentação sob controle"
                    title="Organize os arquivos usados com frequência pela equipe."
                    description="Mantenha versões, validade e contexto de uso em um só lugar."
                    href="/login"
                    label="Conhecer a biblioteca de documentos"
                  />
                </section>

                <section id="proposta" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    Como preparar a proposta?
                  </h2>
                  <p className="mt-4">
                    A proposta deve respeitar exatamente o que o edital pede: composição, unidades,
                    quantidade, prazo, validade, impostos, condições de pagamento e anexos. Para
                    aprofundar a etapa comercial, consulte o guia sobre{" "}
                    <a
                      href="/blog/como-montar-proposta-precos-licitacao"
                      className="font-semibold text-brand-strong underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand"
                    >
                      proposta de preços para licitação
                    </a>
                    .
                  </p>
                  <ol className="mt-5 space-y-3 text-base" role="list">
                    {[
                      "Confirme se todos os itens foram preenchidos.",
                      "Verifique se os valores consideram quantidade e custos operacionais.",
                      "Inclua os anexos solicitados e a versão correta do documento.",
                      "Registre a revisão e o responsável pelo envio.",
                      "Acompanhe o prazo até a confirmação do protocolo.",
                    ].map((item, index) => (
                      <li key={item} className="flex gap-4">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand-tint text-sm font-bold text-brand-strong">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                </section>

                <section id="disputa" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    O que acontece durante a disputa?
                  </h2>
                  <p className="mt-4">
                    Em modalidades com disputa eletrônica, a empresa acompanha a sessão no portal
                    indicado, observa os lances e reage conforme sua estratégia. Uma operação madura
                    não toma decisões apenas olhando o menor preço. Entenda as etapas do{" "}
                    <a
                      href="/blog/como-participar-pregao-eletronico"
                      className="font-semibold text-brand-strong underline decoration-brand/40 underline-offset-4 transition hover:decoration-brand"
                    >
                      pregão eletrônico
                    </a>
                    .
                  </p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      "posição por item",
                      "valor unitário e total",
                      "decremento mínimo",
                      "margem e tempo restante",
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-700"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  <ArticleCta
                    eyebrow="Sessão acompanhável"
                    title="Centralize itens, lances e decisões da equipe durante a disputa."
                    description="Registre o contexto de cada ação sem depender de planilhas isoladas."
                    href="/lp#bot-de-lances"
                    label="Conhecer o Bot de Lances"
                  />
                </section>

                <section id="resultado" className="scroll-mt-32">
                  <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    Como acompanhar o resultado?
                  </h2>
                  <p className="mt-4">
                    Depois da disputa, acompanhe classificação, habilitação, resultado, recursos e
                    eventuais convocações. A oportunidade não termina necessariamente ao encerrar os
                    lances.
                  </p>
                  <p className="mt-4">
                    Preserve uma linha do tempo com documentos enviados, proposta registrada,
                    anotações da equipe, comunicações e decisão final. Para regras e etapas
                    oficiais, consulte sempre o portal e a documentação do órgão responsável.
                  </p>
                </section>

                <section aria-labelledby="faq-titulo" className="border-t border-slate-200 pt-10">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                    Dúvidas frequentes
                  </p>
                  <h2
                    id="faq-titulo"
                    className="mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-950"
                  >
                    Perguntas sobre participação em licitações
                  </h2>
                  <div className="mt-6 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white px-5">
                    {[
                      [
                        "Qualquer empresa pode participar de licitação?",
                        "Depende do edital e de seus requisitos. A empresa precisa atender às condições de habilitação e ao objeto da contratação.",
                      ],
                      [
                        "Preciso ter todos os documentos antes de encontrar uma oportunidade?",
                        "É recomendável manter os documentos mais usados organizados e válidos, mas cada edital pode solicitar exigências específicas.",
                      ],
                      [
                        "Onde encontro licitações abertas?",
                        "Em portais oficiais e plataformas de compras. Um monitoramento ajuda a filtrar oportunidades por categoria, região e termos relevantes.",
                      ],
                    ].map(([question, answer]) => (
                      <details key={question} className="group py-4">
                        <summary className="cursor-pointer list-none pr-8 text-base font-bold text-slate-900 marker:content-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                          <span>{question}</span>
                          <span
                            className="float-right text-brand-strong transition group-open:rotate-45"
                            aria-hidden="true"
                          >
                            +
                          </span>
                        </summary>
                        <p className="pt-3 text-base leading-7 text-slate-600">{answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                  Neste artigo
                </p>
                <ol className="mt-4 space-y-1" role="list">
                  {articleSections.map(([id, label]) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="block rounded-lg px-3 py-2 text-sm font-medium leading-5 text-slate-600 transition hover:bg-brand-tint hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <ShareArticleButton />
                </div>
              </div>
            </aside>
          </div>

          <div className="border-y border-brand/20 bg-[#06351e]">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 py-10 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand">
                  Próximo passo
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.03em] text-white">
                  Transforme editais em oportunidades acompanháveis.
                </h2>
                <p className="mt-3 text-lg leading-7 text-white/80">
                  Encontre licitações compatíveis, acompanhe prazos e centralize decisões da equipe.
                </p>
              </div>
              <a
                href="/cadastro"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-bold text-slate-950 transition hover:bg-brand-strong hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-[#06351e]"
              >
                Explorar a LicitaBase <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
          </div>

          <section
            aria-labelledby="conteudos-relacionados"
            className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
          >
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                  Continue aprendendo
                </p>
                <h2
                  id="conteudos-relacionados"
                  className="mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-950"
                >
                  Conteúdos relacionados
                </h2>
              </div>
              <span className="text-sm font-semibold text-slate-500">
                <span className="sm:hidden">Deslize para ver mais conteúdos</span>
                <span className="hidden sm:inline">Próximos conteúdos em breve</span>
              </span>
            </div>
            <div
              aria-label="Conteúdos relacionados"
              className="-mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-3"
              role="list"
            >
              {relatedArticles.map(({ title, description, href, image, imageAlt }) => (
                <a
                  key={title}
                  href={href}
                  className="group w-[calc(100vw-3rem)] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:p-4 md:w-auto md:shrink"
                  role="listitem"
                >
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-brand-tint">
                    <img
                      src={image}
                      alt={imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/8] w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                    />
                  </div>
                  <h3 className="mt-5 px-2 text-lg font-bold leading-6 text-slate-950 transition group-hover:text-brand-strong">
                    {title}
                  </h3>
                  <p className="mt-2 px-2 text-sm leading-6 text-slate-600">{description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 px-2 text-sm font-bold text-brand-strong">
                    Ler conteúdo <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}

function ArticleCta({
  eyebrow,
  title,
  description,
  href,
  label,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  label: string;
}) {
  return (
    <div className="mt-8 rounded-2xl border border-brand/30 bg-brand-tint p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">{eyebrow}</p>
      <h3 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-950">{title}</h3>
      <p className="mt-2 text-base leading-7 text-slate-600">{description}</p>
      <a
        href={href}
        className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-strong px-4 text-sm font-bold text-white transition hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {label} <ArrowRight size={16} aria-hidden="true" />
      </a>
    </div>
  );
}
