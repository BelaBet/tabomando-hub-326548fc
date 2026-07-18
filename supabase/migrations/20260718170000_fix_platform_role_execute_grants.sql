-- Re-grant EXECUTE that the Lovable security linter revoked automatically.
-- Our RLS policies (public read on categorias/autores/perfis/materias) call
-- is_platform_editor() under the anon/authenticated role, so it must stay
-- callable by them. The bootstrap trigger function is invoked by Supabase
-- Auth itself on signup and needs the same grant.
GRANT EXECUTE ON FUNCTION public.is_platform_editor() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user_bootstrap_admin() TO anon, authenticated;
