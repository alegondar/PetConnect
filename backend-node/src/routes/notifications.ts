import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";

export const notificationsRoutes = new Hono<{ Variables: Variables }>();

notificationsRoutes.get("/notifications", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("id", userId)
    .single();

  if (!profile) return c.json({ detail: "Perfil no encontrado" }, 404);

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("*")
    .eq("user_id", profile.user_id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({ items: data ?? [] });
});

notificationsRoutes.patch("/notifications/read", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("id", userId)
    .single();

  if (!profile) return c.json({ detail: "Perfil no encontrado" }, 404);

  const { count, error } = await supabaseAdmin
    .from("notifications")
    .update({ read_at: new Date().toISOString() }, { count: "exact" })
    .eq("user_id", profile.user_id)
    .is("read_at", null);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({ read: count ?? 0 });
});
