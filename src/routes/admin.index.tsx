import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchAllMaterias, fetchAutores, fetchCategorias } from "@/lib/data";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import {
  LayoutDashboard, FileText, Users, Tag, LogOut, Trash2, Pencil, BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Painel Editorial — Tá Sabendo?" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const statusColors: Record<string, string> = {
  Publicada: "bg-green-100 text-green-800",
  Rascunho: "bg-gray-100 text-gray-700",
  "Em revisão": "bg-yellow-100 text-yellow-800",
  Agendada: "bg-blue-100 text-blue-800",
  Atualizada: "bg-purple-100 text-purple-800",
  Arquivada: "bg-red-100 text-red-800",
};

const menu = [
  { icon: LayoutDashboard, label: "Visão geral" },
  { icon: FileText, label: "Matérias" },
  { icon: Users, label: "Autores" },
  { icon: Tag, label: "Categorias" },
];

function AdminPage() {
  const auth = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "signed-out") {
      navigate({ to: "/admin/login" });
    }
  }, [auth.status, navigate]);

  if (auth.status === "loading") {
    return <div className="min-h-screen grid place-items-center text-ink-soft">Carregando…</div>;
  }
  if (auth.status === "signed-out") {
    return null; // redirecting
  }
  if (auth.status === "signed-in-no-role") {
    return (
      <div className="min-h-screen grid place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-black">Sem permissão</h1>
          <p className="mt-2 text-sm text-ink-soft max-w-sm">
            Sua conta está autenticada, mas ainda não tem um papel (admin/editor) atribuído no
            painel. Peça para um administrador te adicionar em <code>platform_roles</code>.
          </p>
          <button
            className="mt-4 text-sm text-primary underline"
            onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/admin/login" }))}
          >
            Sair
          </button>
        </div>
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"overview" | "materias" | "autores" | "categorias">("overview");

  const materiasQ = useQuery({ queryKey: ["admin-materias"], queryFn: fetchAllMaterias });
  const autoresQ = useQuery({ queryKey: ["autores"], queryFn: fetchAutores });
  const categoriasQ = useQuery({ queryKey: ["categorias"], queryFn: fetchCategorias });

  const materias = materiasQ.data ?? [];
  const autores = autoresQ.data ?? [];
  const categorias = categoriasQ.data ?? [];

  async function handleDelete(slug: string) {
    if (!confirm(`Excluir a matéria "${slug}"? Essa ação não pode ser desfeita.`)) return;
    const { error } = await supabase.from("materias").delete().eq("slug", slug);
    if (error) {
      alert("Erro ao excluir: " + error.message);
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["admin-materias"] });
  }

  const stats = [
    { label: "Publicadas", value: materias.filter((m) => m.status === "Publicada" || m.status === "Atualizada").length },
    { label: "Rascunhos", value: materias.filter((m) => m.status === "Rascunho").length },
    { label: "Autores", value: autores.length },
    { label: "Total de matérias", value: materias.length },
  ];

  return (
    <div className="min-h-screen bg-surface-alt">
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
            <button
              className="flex items-center gap-1 text-sm text-ink-soft hover:text-primary"
              onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/admin/login" }))}
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        <aside className="hidden md:block w-60 shrink-0 border-r border-border bg-surface min-h-[calc(100vh-56px)]">
          <nav className="p-3 space-y-1">
            <Link
              to="/admin/pesquisa"
              className="mb-3 flex w-full items-center gap-2 rounded-md border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-800 transition hover:bg-violet-100"
            >
              <BarChart3 size={16} /> Respostas da pesquisa
            </Link>
            {menu.map((m) => {
              const key = m.label === "Visão geral" ? "overview" : m.label === "Matérias" ? "materias" : m.label === "Autores" ? "autores" : "categorias";
              return (
                <button
                  key={m.label}
                  onClick={() => setTab(key as typeof tab)}
                  className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
                    tab === key ? "bg-primary text-primary-foreground" : "text-ink hover:bg-surface-alt"
                  }`}
                >
                  <m.icon size={16} /> {m.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6 space-y-6">
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-black">
                {tab === "overview" && "Visão geral"}
                {tab === "materias" && "Matérias"}
                {tab === "autores" && "Autores"}
                {tab === "categorias" && "Categorias"}
              </h1>
              <p className="text-sm text-ink-soft">Dados em tempo real do Supabase.</p>
            </div>
            {tab === "materias" && (
              <Link
                to="/admin/materias/nova"
                className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
              >
                + Nova matéria
              </Link>
            )}
          </header>

          {tab === "overview" && (
            <div className="grid gap-4 md:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-surface p-4">
                  <div className="text-xs font-bold uppercase tracking-widest text-ink-soft">{s.label}</div>
                  <div className="mt-1 text-3xl font-black text-ink">{s.value}</div>
                </div>
              ))}
            </div>
          )}

          {(tab === "overview" || tab === "materias") && (
            <section className="rounded-xl border border-border bg-surface overflow-hidden">
              <header className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h2 className="font-display text-lg font-black">
                  {tab === "overview" ? "Últimas matérias" : "Todas as matérias"}
                </h2>
                <div className="text-xs text-ink-soft">{materias.length} itens</div>
              </header>
              {materiasQ.isLoading ? (
                <div className="p-5 text-sm text-ink-soft">Carregando…</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-alt text-left text-xs uppercase tracking-widest text-ink-soft">
                      <tr>
                        <th className="px-5 py-3">Título</th>
                        <th className="px-5 py-3">Categoria</th>
                        <th className="px-5 py-3">Autor</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Views</th>
                        <th className="px-5 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {(tab === "overview" ? materias.slice(0, 7) : materias).map((m) => (
                        <tr key={m.slug} className="hover:bg-surface-alt">
                          <td className="px-5 py-3 font-semibold text-ink max-w-md">
                            <Link to="/materia/$slug" params={{ slug: m.slug }} className="hover:text-primary line-clamp-1">
                              {m.titulo}
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-ink-soft">{categorias.find((c) => c.slug === m.categoria)?.nome ?? "—"}</td>
                          <td className="px-5 py-3 text-ink-soft">{autores.find((a) => a.slug === m.autor)?.nome ?? "—"}</td>
                          <td className="px-5 py-3">
                            <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${statusColors[m.status]}`}>
                              {m.status}
                            </span>
                          </td>
                          <td className="px-5 py-3 font-mono text-ink-soft">{m.visualizacoes.toLocaleString("pt-BR")}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <Link to="/admin/materias/$slug" params={{ slug: m.slug }} className="text-ink-soft hover:text-primary" aria-label="Editar">
                                <Pencil size={15} />
                              </Link>
                              <button onClick={() => handleDelete(m.slug)} className="text-ink-soft hover:text-destructive" aria-label="Excluir">
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {tab === "autores" && (
            <section className="rounded-xl border border-border bg-surface p-5">
              <ul className="space-y-3">
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
          )}

          {tab === "categorias" && (
            <section className="rounded-xl border border-border bg-surface p-5">
              <ul className="flex flex-wrap gap-2">
                {categorias.map((c) => (
                  <li key={c.slug} className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-ink">
                    {c.nome}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
