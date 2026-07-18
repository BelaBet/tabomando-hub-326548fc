import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

export type AdminAuthState =
  | { status: "loading" }
  | { status: "signed-out" }
  | { status: "signed-in-no-role"; session: Session }
  | { status: "admin"; session: Session; role: "admin" | "editor" };

export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    async function resolve(session: Session | null) {
      if (!session) {
        if (!cancelled) setState({ status: "signed-out" });
        return;
      }
      const { data, error } = await supabase
        .from("platform_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setState({ status: "signed-in-no-role", session });
      } else {
        setState({ status: "admin", session, role: data.role as "admin" | "editor" });
      }
    }

    supabase.auth.getSession().then(({ data }) => resolve(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session);
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
