import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCategorias, getCategoria, type Materia, formatarData } from "@/lib/data";

export function ArticleCard({ m, variant = "default" }: { m: Materia; variant?: "default" | "compact" | "hero" }) {
  const { data: categorias = [] } = useQuery({ queryKey: ["categorias"], queryFn: fetchCategorias });
  const cat = getCategoria(categorias, m.categoria);
  if (variant === "hero") {
    return (
      <Link
        to="/materia/$slug"
        params={{ slug: m.slug }}
        className="group relative block overflow-hidden rounded-lg bg-brand-black text-white shadow-editorial"
      >
        <img src={m.imagem} alt={m.legendaImagem} className="h-[380px] md:h-[540px] w-full object-cover opacity-90 group-hover:scale-[1.02] transition duration-700" />
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
          <div className="flex items-center gap-2">
            {cat && <span className="category-chip">{cat.nome}</span>}
            <span className="highlight-chip">Manchete</span>
          </div>
          <h1 className="mt-3 text-3xl md:text-5xl font-black leading-tight max-w-3xl">{m.titulo}</h1>
          <p className="mt-3 text-white/85 max-w-2xl text-sm md:text-base">{m.subtitulo}</p>
          <div className="mt-4 text-xs text-white/70">
            {formatarData(m.publicadoEm)} · {m.tempoLeitura} min de leitura
          </div>
        </div>
      </Link>
    );
  }

  if (variant === "compact") {
    return (
      <Link to="/materia/$slug" params={{ slug: m.slug }} className="group flex gap-3 py-3 border-b border-border last:border-0">
        <img src={m.imagem} alt="" className="h-16 w-20 rounded object-cover shrink-0" />
        <div className="min-w-0">
          {cat && <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{cat.nome}</span>}
          <h3 className="text-sm font-semibold text-ink group-hover:text-primary line-clamp-2">{m.titulo}</h3>
          <div className="mt-1 text-[11px] text-ink-soft">{formatarData(m.publicadoEm)}</div>
        </div>
      </Link>
    );
  }

  return (
    <Link to="/materia/$slug" params={{ slug: m.slug }} className="group flex flex-col overflow-hidden rounded-lg bg-surface border border-border hover:shadow-editorial transition">
      <div className="aspect-[16/10] overflow-hidden bg-muted">
        <img src={m.imagem} alt={m.legendaImagem} className="h-full w-full object-cover group-hover:scale-[1.03] transition duration-500" />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {cat && <span className="category-chip">{cat.nome}</span>}
          <span className="classification-badge">{m.classificacao}</span>
        </div>
        <h3 className="text-lg font-bold text-ink leading-snug group-hover:text-primary line-clamp-3">{m.titulo}</h3>
        <p className="text-sm text-ink-soft line-clamp-2">{m.resumo}</p>
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-ink-soft">
          <span>{formatarData(m.publicadoEm)}</span>
          <span className="inline-flex items-center gap-1"><Clock size={12} />{m.tempoLeitura} min</span>
        </div>
      </div>
    </Link>
  );
}
