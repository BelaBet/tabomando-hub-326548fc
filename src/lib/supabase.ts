import { supabase as typedSupabase } from "@/integrations/supabase/client";
import type { SupabaseClient } from "@supabase/supabase-js";

// The generated Database types don't include the project tables yet
// (categorias, autores, materias, perfis, platform_roles). Until a
// migration adds them and regenerates the types, expose an untyped
// client so the existing data-access code type-checks.
export const supabase = typedSupabase as unknown as SupabaseClient;
