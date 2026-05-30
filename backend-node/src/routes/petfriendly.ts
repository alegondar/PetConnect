import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import { CreatePetFriendlyPlaceRequest } from "../schemas/petfriendly.js";

export const petfriendlyRoutes = new Hono<{ Variables: Variables }>();

petfriendlyRoutes.get("/pet-friendly", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 50, 200);
  const categoria = c.req.query("categoria");

  let query = supabaseAdmin
    .from("pet_friendly_places")
    .select("*", { count: "exact", head: false })
    .order("nombre", { ascending: true });

  if (categoria) query = query.eq("categoria", categoria);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data ?? [],
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

petfriendlyRoutes.post(
  "/pet-friendly",
  authMiddleware,
  zValidator("json", CreatePetFriendlyPlaceRequest),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const insertData: Record<string, unknown> = {
      nombre: data.nombre,
      categoria: data.categoria,
      lat: data.lat,
      lng: data.lng,
      created_by: userId,
      fuente: "usuario",
    };
    if (data.direccion) insertData.direccion = data.direccion;
    if (data.descripcion) insertData.descripcion = data.descripcion;
    if (data.foto_url) insertData.foto_url = data.foto_url;

    const { data: place, error } = await supabaseAdmin
      .from("pet_friendly_places")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error("[POST /pet-friendly] Supabase error:", JSON.stringify(error, null, 2));
      return c.json({ detail: error.message }, 422);
    }
    return c.json(place, 201);
  }
);
