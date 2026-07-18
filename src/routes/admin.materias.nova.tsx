import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { MateriaForm } from "@/components/admin/MateriaForm";

export const Route = createFileRoute("/admin/materias/nova")({
  head: () => ({
    meta: [
      { title: "Nova matéria — Painel Editorial" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NovaMateriaPage,
});

function NovaMateriaPage() {
  const auth = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.status === "signed-out") navigate({ to: "/admin/login" });
  }, [auth.status, navigate]);

  if (auth.status !== "admin") {
    return <div className="min-h-screen grid place-items-center text-ink-soft">Carregando…</div>;
  }

  return (
    <div className="min-h-screen bg-surface-alt p-6">
      <Link to="/admin" className="text-sm text-ink-soft hover:text-primary">← Voltar ao painel</Link>
      <h1 className="mt-2 font-display text-3xl font-black">Nova matéria</h1>
      <div className="mt-6 rounded-xl border border-border bg-surface p-6">
        <MateriaForm />
      </div>
    </div>
  );
}
