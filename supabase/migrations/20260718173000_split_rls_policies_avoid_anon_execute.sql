-- Root-cause fix: previously the public "read materias" policy did
--   status in ('Publicada','Atualizada') OR public.is_platform_editor()
-- Postgres must be able to parse/plan a call to is_platform_editor() for
-- ANY role touching that policy — including anon — even on rows where the
-- first condition is already true. That's why anon needed EXECUTE, and why
-- Lovable's security linter kept flagging (and revoking) it.
--
-- Splitting into two separate policies removes the need entirely: anon
-- only ever evaluates the plain status check, authenticated gets a second
-- policy that may call the function (RLS SELECT policies are OR'd).

drop policy if exists "public read published materias" on public.materias;

create policy "anon read published materias" on public.materias
  for select to anon
  using (status in ('Publicada','Atualizada'));

create policy "authenticated read materias" on public.materias
  for select to authenticated
  using (status in ('Publicada','Atualizada') or public.is_platform_editor());

-- Scope the write policies to `authenticated` explicitly (anon should never
-- even attempt these, and this keeps anon fully clear of the function).
drop policy if exists "editors write categorias" on public.categorias;
create policy "editors write categorias" on public.categorias
  for all to authenticated
  using (public.is_platform_editor()) with check (public.is_platform_editor());

drop policy if exists "editors write autores" on public.autores;
create policy "editors write autores" on public.autores
  for all to authenticated
  using (public.is_platform_editor()) with check (public.is_platform_editor());

drop policy if exists "editors write perfis" on public.perfis;
create policy "editors write perfis" on public.perfis
  for all to authenticated
  using (public.is_platform_editor()) with check (public.is_platform_editor());

drop policy if exists "editors write materias" on public.materias;
create policy "editors write materias" on public.materias
  for all to authenticated
  using (public.is_platform_editor()) with check (public.is_platform_editor());

drop policy if exists "self can read own role" on public.platform_roles;
create policy "self can read own role" on public.platform_roles
  for select to authenticated
  using (user_id = auth.uid() or public.is_platform_editor());

-- Now only `authenticated` ever needs EXECUTE — anon never touches the
-- function, so the linter has nothing to flag here going forward.
REVOKE EXECUTE ON FUNCTION public.is_platform_editor() FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_editor() TO authenticated;

-- handle_new_user_bootstrap_admin() runs as a trigger owned by postgres on
-- auth.users insert — it doesn't need direct EXECUTE from anon/authenticated
-- at all; the earlier grant to those roles was unnecessary and is removed.
REVOKE EXECUTE ON FUNCTION public.handle_new_user_bootstrap_admin() FROM anon, authenticated, PUBLIC;
