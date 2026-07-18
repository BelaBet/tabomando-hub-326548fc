// Re-exports Lovable Cloud's own generated Supabase client.
// It correctly handles both the browser (import.meta.env) and SSR
// (process.env) environments, which our own client creation didn't.
export { supabase } from "@/integrations/supabase/client";
