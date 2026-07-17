import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ArticleCard } from "@/components/site/ArticleCard";
import { getCategoria, materiasPorCategoria } from "@/lib/demo-data";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const cat = getCategoria(params.slug);
    if (!cat) throw notFound();
    return { cat, lista: materiasPorCategoria(params.slug) };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Categoria" }, { name: "robots", content: "noindex" }] };
    const { cat } = loaderData;
    return {
      meta: [
        { title: `${cat.nome} — Tá Sabendo?` },
        { name: "description", content: cat.descricao },
        { property: "og:title", content: `${cat.nome} — Tá Sabendo?` },
        { property: "og:description", content: cat.descricao },
        { property: "og:url", content: `/categoria/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/categoria/${params.slug}` }],
    };
  },
  notFoundComponent: () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="container-editorial flex-1 py-24 text-center">
        <h1 className="text-4xl font-black">Categoria não encontrada</h1>
        <Link to="/" className="mt-6 inline-block text-primary font-bold">Voltar</Link>
      </div>
      <Footer />
    </div>
  ),
  component: CategoriaPage,
});

function CategoriaPage() {
  const { cat, lista } = Route.useLoaderData();
  const [primeira, ...resto] = lista;
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container-editorial pt-6">
          <nav aria-label="breadcrumb" className="flex items-center gap-1 text-xs text-ink-soft">
            <Link to="/" className="hover:text-primary">Início</Link>
            <ChevronRight size={12} />
            <span className="text-ink font-medium">{cat.nome}</span>
          </nav>
        </div>

        <header className="container-editorial mt-6 border-b-2 border-ink pb-6">
          <span className="highlight-chip">Editoria</span>
          <h1 className="mt-3 font-display text-4xl md:text-6xl font-black">{cat.nome}</h1>
          <p className="mt-2 max-w-2xl text-ink-soft">{cat.descricao}</p>
        </header>

        {lista.length === 0 ? (
          <div className="container-editorial py-16 text-center text-ink-soft">
            Ainda não temos matérias nesta editoria (conteúdo de demonstração).
          </div>
        ) : (
          <section className="container-editorial mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
            {primeira && <ArticleCard m={primeira} variant="hero" />}
            <div className="grid gap-6 sm:grid-cols-2">
              {resto.map((m: import("@/lib/demo-data").Materia) => <ArticleCard key={m.slug} m={m} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
