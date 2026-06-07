import { Hono } from "hono";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";

export const veterinariasRoutes = new Hono<{ Variables: Variables }>();

veterinariasRoutes.get("/veterinarias", async (c) => {
  const zona = c.req.query("zona");

  let query = supabaseAdmin
    .from("veterinarias_24hs")
    .select("*")
    .order("nombre", { ascending: true });

  if (zona) query = query.eq("zona", zona);

  const { data, error } = await query;

  if (error) return c.json({ detail: error.message }, 400);

  return c.json(data ?? []);
});
