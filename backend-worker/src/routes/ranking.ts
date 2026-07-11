import { Hono } from "hono";
import { getSupabaseClients } from "../lib/supabase.js";
import type { Bindings } from "../index.js";

export const rankingRoutes = new Hono<{ Bindings: Bindings }>();

rankingRoutes.get("/ranking", async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const { data, error } = await supabaseAdmin
    .from("weekly_ranking")
    .select("*")
    .order("rank")
    .limit(limit);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data ?? [],
    updated_at: data?.[0]?.updated_at ?? null,
  });
});
