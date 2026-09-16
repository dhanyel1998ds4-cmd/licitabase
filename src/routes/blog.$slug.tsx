import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowRight, BookOpen, CheckCircle2, ListChecks, Share2 } from "lucide-react";
import { useState } from "react";
import {
  blogArticles,
  blogHref,
  blogHubArticle,
  getBlogArticle,
  type BlogArticle,
} from "@/content/blog-articles";
import { Footer } from "@/components/lp/Footer";
import { Header } from "@/components/lp/Header";
import { getBlogEditorialProfile } from "@/content/blog-editorial";
import {
  createBlogPostingSchema,
  createBreadcrumbListSchema,
  createPageSeo,
  SEO_SITE_URL,
} from "@/lib/seo";

const siteUrl = SEO_SITE_URL;

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    if (!getBlogArticle(params.slug)) throw notFound();
  },
  head: ({ params }) => {
    const article = getBlogArticle(params.slug);

    if (!article) {
      return { meta: [{ title: "Artigo não encontrado | LicitaBase" }] };
    }

    return createPageSeo({
      title: `${article.title} | LicitaBase`,
      description: article.description,
      canonicalPath: blogHref(article.slug),
      imagePath: article.image,
      imageAlt: article.imageAlt,
      kind: "article",
      publishedAt: article.publishedAt,
      modifiedAt: article.modifiedAt,
    });
  },
  notFoundComponent: BlogArticleNotFound,
  component: BlogSatellitePage,
});

function ShareArticleButton({ article }: { article: BlogArticle }) {
  const [copied, setCopied] = useState(false);
  const articleUrl = `${siteUrl}${blogHref(article.slug)}`;

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url: articleUrl });
        return;
      }

      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Closing the native share UI is an expected action.
    }
  };

  return (
    <button
      type="button"
      onClick={() => void share()}
      className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-brand/30 hover:bg-brand-tint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
    >
      <Share2 size={16} aria-hidden="true" />
      {copied ? "Link copiado" : "Compartilhar"}
    </button>
  );
}

function BlogSatellitePage() {
  const { slug } = Route.useParams();
  const article = getBlogArticle(slug);

  if (!article) return null;

  const editorialProfile = getBlogEditorialProfile(article.slug);

  const articleUrl = `${siteUrl}${blogHref(article.slug)}`;
  const articleImageUrl = `${siteUrl}${article.image}`;
  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => getBlogArticle(relatedSlug))
    .filter((relatedArticle): relatedArticle is BlogArticle => Boolean(relatedArticle));
  const structuredData = [
    createBlogPostingSchema({
      title: article.title,
      description: article.description,
      canonicalPath: blogHref(article.slug),
      imagePath: article.image,
      publishedAt: article.publishedAt,
      modifiedAt: article.modifiedAt,
      section: article.category,
      ...(editorialProfile ? { keywords: editorialProfile.secondaryQueries } : {}),
    }),
    createBreadcrumbListSchema([
      { name: "Início", path: "/lp" },
      { name: "Blog", path: "/blog" },
      { name: article.title, path: blogHref(article.slug) },
    ]),
  ];

  return (
    <div className="lp-page min-h-screen w-full overflow-x-clip bg-[#f8fbf9] font-manrope text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header forceSolid />
      <main className="pt-32 sm:pt-36">
        <article>
          <header className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <nav aria-label="Navegação estrutural" className="mb-7 text-sm text-slate-500">
              <a href="/lp" className="transition hover:text-brand-strong">
                Início
              </a>
              <span aria-hidden="true" className="mx-2 text-slate-300">
                /
              </span>
              <a href="/blog" className="transition hover:text-brand-strong">
                Blog
              </a>
              <span aria-hidden="true" className="mx-2 text-slate-300">
                /
              </span>
              <span className="text-slate-700">{article.category}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
              <div className="max-w-4xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand-tint px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                  <BookOpen size={14} aria-hidden="true" />
                  {article.category}
                </div>
                <h1 className="max-w-4xl text-balance text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
                  {article.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                  {article.description}
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
                  Conteúdo relacionado
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Este artigo faz parte do guia da LicitaBase para quem quer participar de
                  licitações.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={blogHubArticle.href}
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-strong px-4 text-sm font-bold text-white transition hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    Ver guia principal <ArrowRight size={16} aria-hidden="true" />
                  </a>
                  <ShareArticleButton article={article} />
                </div>
              </div>
            </div>
          </header>

          <figure className="mx-auto max-w-[1240px] px-4 pb-10 sm:px-6 sm:pb-14 lg:px-8">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="aspect-[16/8] w-full rounded-2xl border border-brand/20 object-cover shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
            />
          </figure>

          <div className="border-y border-brand/20 bg-gradient-to-r from-brand-tint via-white to-brand-tint">
            <div className="mx-auto grid max-w-[1240px] gap-5 px-4 py-7 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:px-8">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-brand-strong text-white shadow-lg shadow-brand/20">
                <ListChecks size={27} aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                  O que você encontra aqui
                </p>
                <p className="mt-1 max-w-4xl text-lg font-semibold leading-7 text-slate-900">
                  Orientação prática para tomar uma decisão mais segura antes de avançar na
                  oportunidade.
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
                  {article.sections.map((section, index) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="group flex min-h-11 items-center gap-3 rounded-xl px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-brand-tint hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 transition group-hover:bg-brand-tint group-hover:text-brand-strong">
                          {index + 1}
                        </span>
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </section>

              <div className="mt-10 space-y-11 text-[1.06rem] leading-8 text-slate-700 sm:text-lg">
                {article.sections.map((section) => (
                  <section key={section.id} id={section.id} className="scroll-mt-32">
                    <h2 className="text-3xl font-bold leading-tight tracking-[-0.03em] text-slate-950">
                      {section.title}
                    </h2>
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mt-4">
                        {paragraph}
                      </p>
                    ))}
                    {section.checklist ? (
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2" role="list">
                        {section.checklist.map((item) => (
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
                    ) : null}
                  </section>
                ))}

                <section className="rounded-2xl border border-brand/30 bg-brand-tint p-5 sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
                    Próximo passo
                  </p>
                  <h2 className="mt-2 text-xl font-bold tracking-[-0.02em] text-slate-950">
                    Transforme informação em uma decisão acompanhável.
                  </h2>
                  <p className="mt-2 text-base leading-7 text-slate-600">
                    A LicitaBase ajuda a concentrar oportunidades, documentos, prazos e decisões da
                    equipe.
                  </p>
                  <a
                    href="/cadastro"
                    className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-strong px-4 text-sm font-bold text-white transition hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                  >
                    Conhecer a LicitaBase <ArrowRight size={17} aria-hidden="true" />
                  </a>
                </section>
              </div>
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
                <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-500">
                  Neste artigo
                </p>
                <ol className="mt-4 space-y-1" role="list">
                  {article.sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-lg px-3 py-2 text-sm font-medium leading-5 text-slate-600 transition hover:bg-brand-tint hover:text-brand-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>

          <section
            aria-labelledby="conteudos-relacionados"
            className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
              Continue aprendendo
            </p>
            <h2
              id="conteudos-relacionados"
              className="mt-2 text-3xl font-bold tracking-[-0.03em] text-slate-950"
            >
              Conteúdos relacionados
            </h2>
            <div
              aria-label="Conteúdos relacionados"
              className="-mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-3 scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:overflow-visible md:px-0 md:pb-0 md:grid-cols-3"
              role="list"
            >
              {[blogHubArticle, ...relatedArticles].map((relatedArticle) => (
                <a
                  key={relatedArticle.slug}
                  href={
                    "href" in relatedArticle ? relatedArticle.href : blogHref(relatedArticle.slug)
                  }
                  className="group w-[calc(100vw-3rem)] shrink-0 snap-start rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:p-4 md:w-auto md:shrink"
                  role="listitem"
                >
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-brand-tint">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.imageAlt}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/8] w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                    />
                  </div>
                  <p className="mt-5 px-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">
                    {relatedArticle.category}
                  </p>
                  <h3 className="mt-2 px-2 text-lg font-bold leading-6 text-slate-950 transition group-hover:text-brand-strong">
                    {relatedArticle.title}
                  </h3>
                  <p className="mt-2 px-2 text-sm leading-6 text-slate-600">
                    {relatedArticle.description}
                  </p>
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

function BlogArticleNotFound() {
  return (
    <div className="lp-page min-h-screen bg-[#f8fbf9] font-manrope text-slate-900">
      <Header forceSolid />
      <main className="mx-auto flex min-h-screen max-w-[1240px] items-center px-4 pt-24 sm:px-6 lg:px-8">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
            Conteúdo não encontrado
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-950">
            Este artigo não está disponível.
          </h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Volte ao blog para encontrar os guias publicados pela LicitaBase.
          </p>
          <a
            href="/blog"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-xl bg-brand-strong px-4 text-sm font-bold text-white transition hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
          >
            Ver conteúdos <ArrowRight size={17} aria-hidden="true" />
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
