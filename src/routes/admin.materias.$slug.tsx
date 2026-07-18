import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { fetchMateriaBySlug } from "@/lib/data";
import { MateriaForm } from "@/components/admin/MateriaForm";

export const Route = createFileRoute("/admin/materias/$slug")({
  head: () => ({
    meta: [
      { title: "Editar matéria — Painel Editorial" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: EditarMateriaPage,
});

function EditarMateriaPage() {
  const { slug } = Route.useParams();
  const auth = useAdminAuth();
  const navigate = useNavigate();
  const materiaQ = useQuery({ queryKey: ["materia", slug], queryFn: () => fetchMateriaBySlug(slug) });

  useEffect(() => {
    if (auth.status === "signed-out") navigate({ to: "/admin/login" });
  }, [auth.status, navigate]);

  if (auth.status !== "admin" || materiaQ.isLoading) {
    return <div className="min-h-screen grid place-items-center text-ink-soft">Carregando…</div>;
  }

  if (!materiaQ.data) {
    return (
      <div className="min-h-screen grid place-items-center text-center">
        <div>
          <p className="text-ink-soft">Matéria não encontrada.</p>
          <Link to="/admin" className="text-primary underline">Voltar ao painel</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt p-6">
      <Link to="/admin" className="text-sm text-ink-soft hover:text-primary">← Voltar ao painel</Link>
      <h1 className="mt-2 font-display text-3xl font-black">Editar matéria</h1>
      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <MateriaForm existing={materiaQ.data} />
      </div>
    </div>
  );
}
