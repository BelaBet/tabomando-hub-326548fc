import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import {
  getMateria,
  getCategoria,
  getAutor,
  materias,
  formatarData,
  type Materia,
  type ClassificacaoEditorial,
} from "@/lib/demo-data";
import { CheckCircle2, HelpCircle, AlertTriangle, Sparkles, Share2, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/materia/$slug")({
  loader: ({ params }) => {
    const m = getMateria(params.slug);
    if (!m) throw notFound();
    return { materia: m };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return { meta: [{ title: "Matéria não encontrada" }, { name: "robots", content: "noindex" }] };
    }
    const m = loaderData.materia;
    const cat = getCategoria(m.categoria);
    const autor = getAutor(m.autor);
    return {
      meta: [
        { title: `${m.titulo} — Tá Sabendo?` },
        { name: "description", content: m.resumo },
        { name: "keywords", content: m.tags.join(", ") },
        { property: "og:title", content: m.titulo },
        { property: "og:description", content: m.resumo },
        { property: "og:image", content: m.imagem },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/materia/${params.slug}` },
        { property: "article:published_time", content: m.publicadoEm },
        ...(m.atualizadoEm ? [{ property: "article:modified_time", content: m.atualizadoEm }] : []),
        { property: "article:section", content: cat?.nome ?? "" },
        { property: "article:author", content: autor?.nome ?? "" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/materia/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: m.titulo,
            description: m.resumo,
            image: [m.imagem],
            datePublished: m.publicadoEm,
            dateModified: m.atualizadoEm ?? m.publicadoEm,
            author: autor ? { "@type": "Person", name: autor.nome } : undefined,
            publisher: {
              "@type": "NewsMediaOrganization",
              name: "Tá Sabendo?",
            },
            articleSection: cat?.nome,
            keywords: m.tags,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Início", item: "/" },
              { "@type": "ListItem", position: 2, name: cat?.nome, item: `/categoria/${m.categoria}` },
              { "@type": "ListItem", position: 3, name: m.titulo, item: `/materia/${params.slug}` },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container-editorial flex-1 py-24 text-center">
        <h1 className="text-4xl font-black">Matéria não encontrada</h1>
        <p className="mt-2 text-ink-soft">O conteúdo pode ter sido movido ou removido.</p>
        <Link to="/" className="mt-6 inline-block text-primary font-bold">Voltar ao início</Link>
      </div>
      <Footer />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-8 text-center">Erro: {error.message}</div>
  ),
  component: MateriaPage,
});

const iconClassif = {
  Confirmado: CheckCircle2,
  Relatado: HelpCircle,
  Rumor: AlertTriangle,
  Análise: Sparkles,
  Atualização: Sparkles,
} as const;

function MateriaPage() {
  const data = Route.useLoaderData() as { materia: Materia };
  const m = data.materia;
  const cat = getCategoria(m.categoria);
  const autor = getAutor(m.autor);
  const relacionadas = materias.filter((x) => x.categoria === m.categoria && x.slug !== m.slug).slice(0, 3);
  const Icon = iconClassif[m.classificacao as ClassificacaoEditorial];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-6">
          <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-primary">Início</Link>
            <ChevronRight size={12} />
            {cat && (
              <>
                <Link to="/categoria/$slug" params={{ slug: cat.slug }} className="hover:text-primary">
                  {cat.nome}
                </Link>
                <ChevronRight size={12} />
              </>
            )}
            <span className="text-ink font-medium line-clamp-1">{m.titulo}</span>
          </nav>
        </div>

        <article className="container-editorial mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-2">
                {cat && <span className="category-chip">{cat.nome}</span>}
                <span className="classification-badge" style={{ borderColor: "var(--brand-red)", color: "var(--brand-red)" }}>
                  <Icon size={12} /> {m.classificacao}
                </span>
              </div>
              <h1 className="mt-4 font-display text-3xl md:text-5xl font-black leading-[1.05]">{m.titulo}</h1>
              <p className="mt-3 text-lg text-ink-soft">{m.subtitulo}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-ink-soft border-y border-border py-3">
                {autor && (
                  <span>
                    Por <Link to="/perfil/$slug" params={{ slug: autor.slug }} className="text-ink font-semibold hover:text-primary">{autor.nome}</Link>
                  </span>
                )}
                <span>·</span>
                <time dateTime={m.publicadoEm}>Publicado em {formatarData(m.publicadoEm)}</time>
                {m.atualizadoEm && (
                  <>
                    <span>·</span>
                    <time dateTime={m.atualizadoEm} className="text-primary font-semibold">
                      Atualizado em {formatarData(m.atualizadoEm)}
                    </time>
                  </>
                )}
                <span className="ml-auto inline-flex items-center gap-1"><Share2 size={14} /> Compartilhar</span>
              </div>
            </header>

            <figure className="mt-6">
              <img src={m.imagem} alt={m.legendaImagem} className="w-full rounded-lg object-cover" />
              <figcaption className="mt-2 text-xs text-ink-soft">
                {m.legendaImagem} — <span className="italic">{m.creditoImagem}</span>
              </figcaption>
            </figure>

            {/* Resumo rápido */}
            <aside className="mt-8 rounded-xl border-2 border-ink bg-surface-alt p-5">
              <h2 className="font-display text-xl font-black inline-flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-primary" />
                Resumo rápido
              </h2>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
                {(
                  [
                    ["Quem", m.resumoRapido.quem],
                    ["O que aconteceu", m.resumoRapido.oQue],
                    ["Quando", m.resumoRapido.quando],
                    ["Situação", m.resumoRapido.situacao],
                    ["Fonte principal", m.resumoRapido.fontePrincipal],
                    ["Última atualização", formatarData(m.atualizadoEm ?? m.publicadoEm)],
                  ] as const
                ).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[11px] font-bold uppercase tracking-widest text-ink-soft">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </aside>

            <div className="prose-editorial mt-8 space-y-5 text-lg leading-relaxed text-ink">
              {m.conteudo.map((p: string, i: number) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {m.taSabendoDisso && (
              <aside className="my-8 rounded-xl p-6 text-white" style={{ background: "var(--gradient-red)" }}>
                <span className="highlight-chip">Tá sabendo disso?</span>
                <p className="mt-3 text-lg font-semibold leading-snug">{m.taSabendoDisso}</p>
              </aside>
            )}

            {/* Espaço reservado publicidade */}
            <div
              role="complementary"
              aria-label="Publicidade"
              className="my-8 flex h-32 items-center justify-center rounded-md border border-dashed border-border bg-surface-alt text-xs uppercase tracking-widest text-ink-soft"
            >
              Espaço publicitário — reservado (sem CLS)
            </div>

            <section className="mt-8">
              <h2 className="font-display text-xl font-black">Fontes consultadas</h2>
              <ul className="mt-2 list-disc pl-5 text-sm text-ink-soft">
                {m.fontes.map((f: { titulo: string; url?: string }, i: number) => (
                  <li key={i}>{f.url ? <a href={f.url} className="text-primary hover:underline">{f.titulo}</a> : f.titulo}</li>
                ))}
              </ul>
            </section>

            {autor && (
              <section className="mt-10 flex items-start gap-4 rounded-xl border border-border bg-surface p-5">
                <div className="h-14 w-14 shrink-0 rounded-full bg-primary/10 grid place-items-center text-primary font-black">
                  {autor.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-widest text-ink-soft">Sobre o autor</div>
                  <div className="font-display text-lg font-black">{autor.nome}</div>
                  <div className="text-sm text-primary font-semibold">{autor.cargo}</div>
                  <p className="mt-1 text-sm text-ink-soft">{autor.bio}</p>
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-black">Relacionadas</h2>
              <div className="mt-2">
                {relacionadas.map((r) => <ArticleCard key={r.slug} m={r} variant="compact" />)}
              </div>
            </section>
            <div
              role="complementary"
              aria-label="Publicidade"
              className="flex h-64 items-center justify-center rounded-md border border-dashed border-border bg-surface-alt text-xs uppercase tracking-widest text-ink-soft"
            >
              Publicidade
            </div>
          </aside>
        </article>

        <section className="container-editorial mt-16">
          <h2 className="font-display text-2xl font-black border-b-2 border-ink pb-2">Continue lendo</h2>
          <div className="mt-4 grid gap-6 md:grid-cols-3">
            {materias.filter((x) => x.slug !== m.slug).slice(0, 3).map((r) => <ArticleCard key={r.slug} m={r} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
