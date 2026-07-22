CREATE TABLE IF NOT EXISTS public.pesquisa_transicao_carreira (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  situacao_profissional TEXT NOT NULL,
  maior_dificuldade TEXT NOT NULL,
  tipos_ajuda TEXT[] NOT NULL DEFAULT '{}',
  relato TEXT,
  email TEXT,
  consentimento_uso_anonimo BOOLEAN NOT NULL DEFAULT FALSE,
  pagina_origem TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT pesquisa_relato_limite CHECK (relato IS NULL OR char_length(relato) <= 600),
  CONSTRAINT pesquisa_email_limite CHECK (email IS NULL OR char_length(email) <= 320)
);

ALTER TABLE public.pesquisa_transicao_carreira ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.pesquisa_transicao_carreira FROM anon, authenticated;
GRANT INSERT ON TABLE public.pesquisa_transicao_carreira TO anon, authenticated;
GRANT SELECT ON TABLE public.pesquisa_transicao_carreira TO authenticated;

CREATE POLICY "Respostas publicas podem ser enviadas"
ON public.pesquisa_transicao_carreira
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(situacao_profissional) BETWEEN 1 AND 150
  AND char_length(maior_dificuldade) BETWEEN 1 AND 150
  AND cardinality(tipos_ajuda) BETWEEN 1 AND 8
);

CREATE POLICY "Administradores podem analisar respostas"
ON public.pesquisa_transicao_carreira
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.platform_roles
    WHERE platform_roles.user_id = auth.uid()
      AND platform_roles.role = 'admin'
  )
);

COMMENT ON TABLE public.pesquisa_transicao_carreira IS
  'Respostas da pesquisa editorial sobre transicao profissional. Leitura restrita ao backend administrativo.';
