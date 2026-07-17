import { createFileRoute, Link } from "@tanstack/react-router";
import { materias, autores, categorias } from "@/lib/demo-data";
import {
  LayoutDashboard, FileText, FileEdit, Clock, Users, Tag, Hash,
  User2, Building2, BookOpen, MessageSquare, Megaphone, Mail, BarChart3, Settings,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Painel Editorial — Tá Sabendo?" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const menu = [
  { icon: LayoutDashboard, label: "Visão geral", active: true },
  { icon: FileText, label: "Matérias" },
  { icon: FileEdit, label: "Rascunhos" },
  { icon: Clock, label: "Agendadas" },
  { icon: Users, label: "Autores" },
  { icon: Tag, label: "Categorias" },
  { icon: Hash, label: "Assuntos" },
  { icon: User2, label: "Pessoas" },
  { icon: Building2, label: "Empresas" },
  { icon: BookOpen, label: "Fontes" },
  { icon: MessageSquare, label: "Comentários" },
  { icon: Megaphone, label: "Publicidade" },
  { icon: Mail, label: "Newsletter" },
  { icon: BarChart3, label: "Métricas" },
  { icon: Settings, label: "SEO" },
];

const statusColors: Record<string, string> = {
  Publicada: "bg-green-100 text-green-800",
  Rascunho: "bg-gray-100 text-gray-700",
  "Em revisão": "bg-yellow-100 text-yellow-800",
  Agendada: "bg-blue-100 text-blue-800",
  Atualizada: "bg-purple-100 text-purple-800",
  Arquivada: "bg-red-100 text-red-800",
};

function AdminPage() {
  const stats = [
    { label: "Publicadas hoje", value: materias.length, hint: "+3 vs ontem" },
    { label: "Rascunhos", value: 12, hint: "5 aguardando revisão" },
    { label: "Autores ativos", value: autores.length, hint: "" },
    { label: "Visualizações 24h", value: "1,2M", hint: "+18%" },
  ];

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* Topbar */}
      <div className="border-b border-border bg-surface">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="ts-logo text-lg">
              TÁ SABENDO<span className="ml-0.5 inline-block rounded-sm bg-primary px-1 text-white">?</span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink-soft">Painel Editorial</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-ink-soft hover:text-primary">Ver site →</Link>
            <div className="h-8 w-8 rounded-full bg-primary text-white grid place-items-center text-xs font-bold">RB</div>
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="hidden md:block w-60 shrink-0 border-r border-border bg-surface min-h-[calc(100vh-56px)]">
          <nav className="p-3 space-y-1">
            {menu.map((m) => (
              <button
                key={m.label}
                className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                  m.active ? "bg-primary text-primary-foreground" : "text-ink hover:bg-surface-alt"
                }`}
              >
                <m.icon size={16} /> {m.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 space-y-6">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-black">Visão geral</h1>
              <p className="text-sm text-ink-soft">Layout inicial do painel — dados de demonstração.</p>
            </div>
            <button className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              + Nova matéria
            </button>
          </header>

          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                <div className="text-xs font-bold uppercase tracking-widest text-ink-soft">{s.label}</div>
                <div className="mt-1 text-3xl font-black text-ink">{s.value}</div>
                {s.hint && <div className="text-xs text-primary font-semibold mt-1">{s.hint}</div>}
              </div>
            ))}
          </div>

          <section className="rounded-xl border border-border bg-surface overflow-hidden">
            <header className="flex items-center justify-between px-5 py-3 border-b border-border">
              <h2 className="font-display text-lg font-black">Últimas matérias</h2>
              <div className="text-xs text-ink-soft">{materias.length} itens</div>
            </header>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-alt text-left text-xs uppercase tracking-widest text-ink-soft">
                  <tr>
                    <th className="px-5 py-3">Título</th>
                    <th className="px-5 py-3">Categoria</th>
                    <th className="px-5 py-3">Autor</th>
                    <th className="px-5 py-3">Classificação</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Views</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {materias.map((m, i) => {
                    const status = ["Publicada", "Atualizada", "Em revisão", "Agendada", "Publicada", "Rascunho", "Publicada"][i % 7];
                    return (
                      <tr key={m.slug} className="hover:bg-surface-alt">
                        <td className="px-5 py-3 font-semibold text-ink max-w-md">
                          <Link to="/materia/$slug" params={{ slug: m.slug }} className="hover:text-primary line-clamp-1">
                            {m.titulo}
                          </Link>
                        </td>
                        <td className="px-5 py-3 text-ink-soft">{categorias.find((c) => c.slug === m.categoria)?.nome}</td>
                        <td className="px-5 py-3 text-ink-soft">{autores.find((a) => a.slug === m.autor)?.nome}</td>
                        <td className="px-5 py-3"><span className="classification-badge">{m.classificacao}</span></td>
                        <td className="px-5 py-3">
                          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[status]}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-5 py-3 font-mono text-ink-soft">{m.visualizacoes.toLocaleString("pt-BR")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-black">Autores</h2>
              <ul className="mt-3 space-y-3">
                {autores.map((a) => (
                  <li key={a.slug} className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 grid place-items-center text-xs font-bold text-primary">
                      {a.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-ink">{a.nome}</div>
                      <div className="text-xs text-ink-soft">{a.cargo}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-xl border border-border bg-surface p-5">
              <h2 className="font-display text-lg font-black">Categorias</h2>
              <ul className="mt-3 flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <li key={c.slug} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink">
                    {c.nome}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
