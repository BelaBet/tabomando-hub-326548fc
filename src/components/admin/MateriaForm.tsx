import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchAutores, fetchCategorias, type Materia } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function MateriaForm({ existing }: { existing?: Materia }) {
  const navigate = useNavigate();
  const categoriasQ = useQuery({ queryKey: ["categorias"], queryFn: fetchCategorias });
  const autoresQ = useQuery({ queryKey: ["autores"], queryFn: fetchAutores });

  const [titulo, setTitulo] = useState(existing?.titulo ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!existing);
  const [subtitulo, setSubtitulo] = useState(existing?.subtitulo ?? "");
  const [resumo, setResumo] = useState(existing?.resumo ?? "");
  const [conteudo, setConteudo] = useState(existing?.conteudo.join("\n\n") ?? "");
  const [categoria, setCategoria] = useState(existing?.categoria ?? "");
  const [autor, setAutor] = useState(existing?.autor ?? "");
  const [status, setStatus] = useState<Materia["status"]>(existing?.status ?? "Rascunho");
  const [classificacao, setClassificacao] = useState<Materia["classificacao"]>(existing?.classificacao ?? "Relatado");
  const [imagem, setImagem] = useState(existing?.imagem ?? "");
  const [tags, setTags] = useState(existing?.tags.join(", ") ?? "");
  const [destaque, setDestaque] = useState(!!existing?.destaque);
  const [manchete, setManchete] = useState(!!existing?.manchete);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categorias = categoriasQ.data ?? [];
  const autores = autoresQ.data ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const { data: catRow } = await supabase.from("categorias").select("id").eq("slug", categoria).maybeSingle();
      const { data: autRow } = await supabase.from("autores").select("id").eq("slug", autor).maybeSingle();

      const payload = {
        slug,
        titulo,
        subtitulo,
        resumo,
        conteudo: conteudo.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
        categoria_id: catRow?.id ?? null,
        autor_id: autRow?.id ?? null,
        status,
        classificacao,
        imagem,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        destaque,
        manchete,
        publicado_em:
          status === "Publicada" || status === "Atualizada"
            ? (existing?.publicadoEm ?? new Date().toISOString())
            : existing?.publicadoEm ?? null,
        atualizado_em: status === "Atualizada" ? new Date().toISOString() : existing?.atualizadoEm ?? null,
        updated_at: new Date().toISOString(),
      };

      if (existing) {
        const { error } = await supabase.from("materias").update(payload).eq("id", existing.id);
        if (error) throw error;
      } else {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const { error } = await supabase.from("materias").insert({ ...payload, created_by: user?.id ?? null });
        if (error) throw error;
      }
      navigate({ to: "/admin", search: (s: any) => s });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
      {error && <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      <div className="space-y-1.5">
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          required
          value={titulo}
          onChange={(e) => {
            setTitulo(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug (URL)</Label>
        <Input
          id="slug"
          required
          value={slug}
          onChange={(e) => {
            setSlug(slugify(e.target.value));
            setSlugTouched(true);
          }}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="subtitulo">Subtítulo</Label>
        <Input id="subtitulo" value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="resumo">Resumo</Label>
        <Textarea id="resumo" rows={2} value={resumo} onChange={(e) => setResumo(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="conteudo">Conteúdo (separe parágrafos com uma linha em branco)</Label>
        <Textarea id="conteudo" rows={10} value={conteudo} onChange={(e) => setConteudo(e.target.value)} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Categoria</Label>
          <Select value={categoria} onValueChange={setCategoria}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c.slug} value={c.slug}>{c.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Autor</Label>
          <Select value={autor} onValueChange={setAutor}>
            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
            <SelectContent>
              {autores.map((a) => (
                <SelectItem key={a.slug} value={a.slug}>{a.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Materia["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Rascunho", "Em revisão", "Agendada", "Publicada", "Atualizada", "Arquivada"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Classificação editorial</Label>
          <Select value={classificacao} onValueChange={(v) => setClassificacao(v as Materia["classificacao"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {["Confirmado", "Relatado", "Rumor", "Análise", "Atualização"].map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="imagem">URL da imagem de capa</Label>
        <Input id="imagem" value={imagem} onChange={(e) => setImagem(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
        <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} /> Destaque
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={manchete} onChange={(e) => setManchete(e.target.checked)} /> Manchete
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving}>{saving ? "Salvando…" : existing ? "Salvar alterações" : "Criar matéria"}</Button>
      </div>
    </form>
  );
}
