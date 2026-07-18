export type ClassificacaoEditorial = "Confirmado" | "Relatado" | "Rumor" | "Análise" | "Atualização";
export type StatusMateria = "Rascunho" | "Em revisão" | "Agendada" | "Publicada" | "Atualizada" | "Arquivada";
export type TipoPerfil = "Celebridade" | "Influenciador" | "Empresa";

export interface CategoriaRow {
  id: string;
  slug: string;
  nome: string;
  descricao: string;
  cor: string | null;
  created_at: string;
}

export interface AutorRow {
  id: string;
  slug: string;
  nome: string;
  bio: string;
  cargo: string;
  user_id: string | null;
  created_at: string;
}

export interface PerfilRow {
  id: string;
  slug: string;
  nome: string;
  tipo: TipoPerfil;
  descricao: string;
  imagem: string | null;
  seguidores: string | null;
  fatos: string[];
  created_at: string;
}

export interface FonteItem {
  titulo: string;
  url?: string;
}

export interface ResumoRapido {
  quem: string;
  oQue: string;
  quando: string;
  situacao: string;
  fontePrincipal: string;
}

export interface MateriaRow {
  id: string;
  slug: string;
  categoria_id: string | null;
  titulo: string;
  subtitulo: string | null;
  resumo: string | null;
  conteudo: string[];
  autor_id: string | null;
  status: StatusMateria;
  publicado_em: string | null;
  atualizado_em: string | null;
  tempo_leitura: number;
  imagem: string | null;
  legenda_imagem: string | null;
  credito_imagem: string | null;
  classificacao: ClassificacaoEditorial;
  destaque: boolean;
  manchete: boolean;
  visualizacoes: number;
  fontes: FonteItem[];
  resumo_rapido: ResumoRapido | null;
  ta_sabendo_disso: string | null;
  tags: string[];
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlatformRoleRow {
  user_id: string;
  role: "admin" | "editor";
  created_at: string;
}

// Loose Database shape so supabase-js generics are satisfied without full codegen.
export interface Database {
  public: {
    Tables: {
      categorias: { Row: CategoriaRow; Insert: Partial<CategoriaRow>; Update: Partial<CategoriaRow> };
      autores: { Row: AutorRow; Insert: Partial<AutorRow>; Update: Partial<AutorRow> };
      perfis: { Row: PerfilRow; Insert: Partial<PerfilRow>; Update: Partial<PerfilRow> };
      materias: { Row: MateriaRow; Insert: Partial<MateriaRow>; Update: Partial<MateriaRow> };
      platform_roles: { Row: PlatformRoleRow; Insert: Partial<PlatformRoleRow>; Update: Partial<PlatformRoleRow> };
    };
  };
}
