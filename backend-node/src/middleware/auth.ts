import { createMiddleware } from "hono/factory";

type Variables = {
  userId: string;
};

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ detail: "No autenticado" }, 401);
    }

    const token = authHeader.slice(7);

    const { supabaseAdmin } = await import("../lib/supabase.js");
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      return c.json({ detail: "No autenticado" }, 401);
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_id", data.user.id)
      .single();

    if (!profile) {
      return c.json({ detail: "Usuario no encontrado" }, 401);
    }

    c.set("userId", profile.id);
    await next();
  }
);

export function optionalAuth() {
  return createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { supabaseAdmin } = await import("../lib/supabase.js");
      const { data } = await supabaseAdmin.auth.getUser(token);
      if (data.user) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("user_id", data.user.id)
          .single();
        if (profile) c.set("userId", profile.id);
      }
    }
    await next();
  });
}
