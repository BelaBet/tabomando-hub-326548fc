import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  Download,
  LoaderCircle,
  LogOut,
  Mail,
  MessageSquareText,
  RefreshCw,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/pesquisa")({
  head: () => ({
    meta: [
      { title: "Respostas da pesquisa — Tá Sabendo?" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PesquisaDashboardPage,
});

type Resposta = {
  id: string;
  situacao_profissional: string;
  maior_dificuldade: string;
  tipos_ajuda: string[];
  relato: string | null;
  email: string | null;
  consentimento_uso_anonimo: boolean;
  created_at: string;
};

type Periodo = "7" | "30" | "90" | "all";

const colors = ["#7c3aed", "#9333ea", "#c026d3", "#ea580c", "#2563eb", "#059669", "#64748b"];

function PesquisaDashboardPage() {
  const auth = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "signed-out") navigate({ to: "/admin/login" });
  }, [auth.status, navigate]);

  if (auth.status === "loading") {
    return <div className="grid min-h-screen place-items-center text-ink-soft"><LoaderCircle className="animate-spin" /></div>;
  }
  if (auth.status === "signed-out") return null;
  if (auth.status !== "admin" || auth.role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center px-4 text-center">
        <div>
          <h1 className="font-display text-2xl font-black">Acesso restrito</h1>
          <p className="mt-2 text-sm text-ink-soft">Somente administradores podem visualizar as respostas.</p>
          <Link to="/admin" className="mt-4 inline-block text-sm font-semibold text-primary underline">Voltar ao painel</Link>
        </div>
      </div>
    );
  }

  return <PesquisaDashboard />;
}

async function fetchRespostas(): Promise<Resposta[]> {
  const { data, error } = await supabase
    .from("pesquisa_transicao_carreira")
    .select("id,situacao_profissional,maior_dificuldade,tipos_ajuda,relato,email,consentimento_uso_anonimo,created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Resposta[];
}

function countValues(values: string[]) {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return Array.from(counts, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function PesquisaDashboard() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState<Periodo>("30");
  const [busca, setBusca] = useState("");
  const respostasQ = useQuery({ queryKey: ["pesquisa-transicao-respostas"], queryFn: fetchRespostas });

  const respostas = respostasQ.data ?? [];
  const filtradas = useMemo(() => {
    const limite = periodo === "all" ? null : Date.now() - Number(periodo) * 86_400_000;
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    return respostas.filter((resposta) => {
      const dentroDoPeriodo = limite === null || new Date(resposta.created_at).getTime() >= limite;
      const corresponde = !termo || [resposta.situacao_profissional, resposta.maior_dificuldade, resposta.relato, resposta.email, ...resposta.tipos_ajuda]
        .filter(Boolean)
        .some((value) => String(value).toLocaleLowerCase("pt-BR").includes(termo));
      return dentroDoPeriodo && corresponde;
    });
  }, [respostas, periodo, busca]);

  const situacoes = useMemo(() => countValues(filtradas.map((r) => r.situacao_profissional)), [filtradas]);
  const dificuldades = useMemo(() => countValues(filtradas.map((r) => r.maior_dificuldade)), [filtradas]);
  const ajudas = useMemo(() => countValues(filtradas.flatMap((r) => r.tipos_ajuda)), [filtradas]);
  const comRelato = filtradas.filter((r) => Boolean(r.relato)).length;
  const comEmail = filtradas.filter((r) => Boolean(r.email)).length;
  const principalDificuldade = dificuldades[0]?.name ?? "Sem dados";

  function exportCsv() {
    const header = ["data", "situacao", "dificuldade", "tipos_de_ajuda", "relato", "email", "consentimento"];
    const rows = filtradas.map((r) => [r.created_at, r.situacao_profissional, r.maior_dificuldade, r.tipos_ajuda.join(" | "), r.relato, r.email, r.consentimento_uso_anonimo ? "sim" : "nao"]);
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `respostas-pesquisa-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-surface-alt">
      <header className="border-b border-border bg-surface">
        <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 px-4 py-2">
          <div className="flex items-center gap-3">
            <span className="ts-logo text-lg">TÁ SABENDO<span className="ml-0.5 inline-block rounded-sm bg-primary px-1 text-white">?</span></span>
            <span className="text-xs font-bold uppercase tracking-widest text-ink-soft">Pesquisa de carreira</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin" className="flex items-center gap-1 text-sm text-ink-soft hover:text-primary"><ArrowLeft size={14} /> Painel</Link>
            <button className="flex items-center gap-1 text-sm text-ink-soft hover:text-primary" onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/admin/login" }))}><LogOut size={14} /> Sair</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-4 md:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-700">Análise das respostas</p>
            <h1 className="mt-1 font-display text-3xl font-black text-ink md:text-4xl">O que a audiência está dizendo</h1>
            <p className="mt-1 text-sm text-ink-soft">Dados atualizados diretamente do Supabase.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select value={periodo} onChange={(e) => setPeriodo(e.target.value as Periodo)} className="h-10 rounded-md border border-border bg-surface px-3 text-sm" aria-label="Período">
              <option value="7">Últimos 7 dias</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="all">Todo o período</option>
            </select>
            <button onClick={() => respostasQ.refetch()} className="grid h-10 w-10 place-items-center rounded-md border border-border bg-surface text-ink-soft hover:text-primary" aria-label="Atualizar"><RefreshCw size={16} /></button>
            <button onClick={exportCsv} disabled={!filtradas.length} className="flex h-10 items-center gap-2 rounded-md bg-violet-700 px-4 text-sm font-bold text-white disabled:opacity-40"><Download size={15} /> Exportar CSV</button>
          </div>
        </div>

        {respostasQ.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">Não foi possível carregar as respostas. Confirme se a migração do Supabase foi aplicada e se sua conta é administradora.</div>
        ) : respostasQ.isLoading ? (
          <div className="grid min-h-72 place-items-center text-ink-soft"><LoaderCircle className="animate-spin" /></div>
        ) : (
          <>
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Metric icon={Users} label="Respostas" value={filtradas.length} detail="no período selecionado" />
              <Metric icon={MessageSquareText} label="Com relato" value={comRelato} detail={`${filtradas.length ? Math.round((comRelato / filtradas.length) * 100) : 0}% das respostas`} />
              <Metric icon={Mail} label="Com e-mail" value={comEmail} detail={`${filtradas.length ? Math.round((comEmail / filtradas.length) * 100) : 0}% das respostas`} />
              <Metric icon={BarChart3} label="Maior dor" value={principalDificuldade} detail={`${dificuldades[0]?.value ?? 0} menções`} textValue />
            </section>

            <section className="grid gap-5 lg:grid-cols-2">
              <ChartCard title="Momento profissional" subtitle="Distribuição das situações atuais" data={situacoes} />
              <ChartCard title="Principais dificuldades" subtitle="O maior obstáculo apontado por resposta" data={dificuldades} />
            </section>

            <section className="rounded-xl border border-border bg-surface p-5">
              <div className="mb-5"><h2 className="font-display text-xl font-black">Ajuda mais desejada</h2><p className="text-xs text-ink-soft">Uma pessoa pode selecionar mais de uma opção.</p></div>
              <div className="grid gap-3 md:grid-cols-2">
                {ajudas.map((item, index) => {
                  const max = ajudas[0]?.value || 1;
                  return <div key={item.name}><div className="mb-1 flex justify-between gap-3 text-xs"><span className="font-semibold text-ink">{item.name}</span><span className="shrink-0 text-ink-soft">{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-violet-100"><div className="h-full rounded-full" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: colors[index % colors.length] }} /></div></div>;
                })}
                {!ajudas.length && <p className="text-sm text-ink-soft">Nenhuma resposta neste período.</p>}
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-border bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
                <div><h2 className="font-display text-xl font-black">Respostas recentes</h2><p className="text-xs text-ink-soft">Detalhes para leitura e acompanhamento editorial.</p></div>
                <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar nas respostas..." className="h-10 w-full rounded-md border border-border px-3 text-sm outline-none focus:border-violet-600 sm:w-64" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left text-sm">
                  <thead className="bg-surface-alt text-xs uppercase tracking-widest text-ink-soft"><tr><th className="px-5 py-3">Data</th><th className="px-5 py-3">Situação</th><th className="px-5 py-3">Dificuldade</th><th className="px-5 py-3">Relato</th><th className="px-5 py-3">Contato</th></tr></thead>
                  <tbody className="divide-y divide-border">
                    {filtradas.slice(0, 100).map((r) => <tr key={r.id} className="align-top hover:bg-surface-alt"><td className="whitespace-nowrap px-5 py-4 text-xs text-ink-soft"><CalendarDays size={13} className="mr-1 inline" />{new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(r.created_at))}</td><td className="max-w-52 px-5 py-4 font-semibold">{r.situacao_profissional}</td><td className="max-w-52 px-5 py-4">{r.maior_dificuldade}</td><td className="max-w-md px-5 py-4 text-ink-soft">{r.relato || "—"}</td><td className="px-5 py-4 text-xs text-ink-soft">{r.email || "—"}</td></tr>)}
                    {!filtradas.length && <tr><td colSpan={5} className="px-5 py-12 text-center text-ink-soft">Nenhuma resposta encontrada.</td></tr>}
                  </tbody>
                </table>
              </div>
              {filtradas.length > 100 && <p className="border-t border-border px-5 py-3 text-xs text-ink-soft">Mostrando as 100 respostas mais recentes. Use “Exportar CSV” para acessar todas.</p>}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value, detail, textValue = false }: { icon: typeof Users; label: string; value: number | string; detail: string; textValue?: boolean }) {
  return <div className="rounded-xl border border-border bg-surface p-5"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink-soft"><Icon size={15} className="text-violet-700" />{label}</div><div className={`mt-3 font-black text-ink ${textValue ? "line-clamp-2 min-h-12 text-lg leading-6" : "text-4xl"}`}>{value}</div><p className="mt-1 text-xs text-ink-soft">{detail}</p></div>;
}

function ChartCard({ title, subtitle, data }: { title: string; subtitle: string; data: { name: string; value: number }[] }) {
  return <section className="rounded-xl border border-border bg-surface p-5"><h2 className="font-display text-xl font-black">{title}</h2><p className="mb-5 text-xs text-ink-soft">{subtitle}</p>{data.length ? <div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ left: 8, right: 20 }}><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" /><XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={145} tick={{ fontSize: 10 }} interval={0} /><Tooltip cursor={{ fill: "#f5f3ff" }} formatter={(value) => [`${Number(value)} respostas`, "Total"]} /><Bar dataKey="value" radius={[0, 6, 6, 0]}>{data.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}</Bar></BarChart></ResponsiveContainer></div> : <div className="grid h-80 place-items-center text-sm text-ink-soft">Nenhum dado neste período.</div>}</section>;
}
