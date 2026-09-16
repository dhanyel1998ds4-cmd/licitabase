import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, GraduationCap } from "lucide-react";
import {
  blogArticles,
  blogHref,
  blogHubArticle,
  formatPublicationDate,
} from "@/content/blog-articles";
import { Footer } from "@/components/lp/Footer";
import { Header } from "@/components/lp/Header";
import { createPageSeo, SEO_SITE_URL } from "@/lib/seo";

const blogUrl = `${SEO_SITE_URL}/blog`;
const allArticles = [blogHubArticle, ...blogArticles];

export const Route = createFileRoute("/blog/")({
  head: () =>
    createPageSeo({
      title: "Blog sobre licitações para empresas | LicitaBase",
      description:
        "Guias práticos para encontrar licitações, analisar editais, organizar documentos e preparar propostas com segurança.",
      canonicalPath: "/blog",
      imagePath: blogHubArticle.image,
      imageAlt: blogHubArticle.imageAlt,
    }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog LicitaBase",
    description: "Guias práticos para empresas que participam de licitações.",
    url: blogUrl,
    inLanguage: "pt-BR",
  };

  return (
    <div className="lp-page min-h-screen w-full overflow-x-clip bg-[#f8fbf9] font-manrope text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Header forceSolid />
      <main className="pt-32 sm:pt-36">
        <header className="mx-auto max-w-[1240px] px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.13em] text-brand-strong">
            Blog LicitaBase
          </p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-4xl">
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl">
                Conteúdos para decidir melhor em cada licitação
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                Guias práticos para encontrar oportunidades, entender editais, organizar documentos
                e preparar propostas.
              </p>
            </div>
            <div className="rounded-2xl border border-brand/20 bg-white p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)]">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand-tint text-brand-strong">
                <GraduationCap size={22} aria-hidden="true" />
              </div>
              <p className="mt-4 text-sm font-bold text-slate-950">
                Aprendizado conectado à operação
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Cada guia aponta o próximo passo e se conecta aos conteúdos que aprofundam o tema.
              </p>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {allArticles.map((article, index) => {
              const href = "href" in article ? article.href : blogHref(article.slug);
              return (
                <a
                  key={article.slug}
                  href={href}
                  className="group flex min-h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:p-4"
                >
                  <div className="overflow-hidden rounded-xl border border-slate-100 bg-brand-tint">
                    <img
                      src={article.image}
                      alt={article.imageAlt}
                      loading={index === 0 ? "eager" : "lazy"}
                      decoding="async"
                      className="aspect-[16/8] w-full object-cover transition duration-300 group-hover:scale-[1.025]"
                    />
                  </div>
                  <p className="mt-5 px-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-strong">
                    {index === 0 ? "Guia principal" : article.category}
                  </p>
                  <h3 className="mt-2 px-2 text-xl font-bold leading-7 tracking-[-0.025em] text-slate-950 transition group-hover:text-brand-strong">
                    {article.title}
                  </h3>
                  <p className="mt-3 px-2 text-sm leading-6 text-slate-600">
                    {article.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3 px-2 pt-5 text-sm font-bold text-brand-strong">
                    <span className="inline-flex items-center gap-1.5 text-slate-500">
                      <CalendarDays size={15} className="text-brand-strong" aria-hidden="true" />
                      Publicado em {formatPublicationDate(article.publishedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      Ler guia <ArrowRight size={16} aria-hidden="true" />
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
