import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import {
  CreateLostPetRequest,
  UpdateLostPetRequest,
  CreateAdoptionRequest,
  UpdateAdoptionRequest,
} from "../schemas/community.js";

export const communityRoutes = new Hono<{ Variables: Variables }>();

// ---- Lost Pets ----

communityRoutes.get("/lost-pets", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const status = c.req.query("status");

  let query = supabaseAdmin
    .from("lost_pets")
    .select("*", { count: "exact", head: false })
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

communityRoutes.get("/lost-pets/:id", async (c) => {
  const id = c.req.param("id");

  const { data: lostPet, error } = await supabaseAdmin
    .from("lost_pets")
    .select("*, reporter:profiles(*)")
    .eq("id", id)
    .single();

  if (error || !lostPet)
    return c.json({ detail: "Mascota perdida no encontrada" }, 404);
  return c.json(lostPet);
});

communityRoutes.post(
  "/lost-pets",
  authMiddleware,
  zValidator("json", CreateLostPetRequest),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const { data: lostPet, error } = await supabaseAdmin
      .from("lost_pets")
      .insert({ ...data, reporter_id: userId, status: "lost" })
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 422);
    return c.json(lostPet, 201);
  }
);

communityRoutes.put(
  "/lost-pets/:id",
  authMiddleware,
  zValidator("json", UpdateLostPetRequest),
  async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const { data: existing } = await supabaseAdmin
      .from("lost_pets")
      .select("reporter_id")
      .eq("id", id)
      .single();

    if (!existing)
      return c.json({ detail: "Mascota perdida no encontrada" }, 404);
    if (existing.reporter_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) updateData[key] = value;
    }

    const { data: lostPet, error } = await supabaseAdmin
      .from("lost_pets")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 400);
    return c.json(lostPet);
  }
);

communityRoutes.delete("/lost-pets/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const { data: existing } = await supabaseAdmin
    .from("lost_pets")
    .select("reporter_id")
    .eq("id", id)
    .single();

  if (!existing)
    return c.json({ detail: "Mascota perdida no encontrada" }, 404);
  if (existing.reporter_id !== userId)
    return c.json({ detail: "No autorizado" }, 403);

  await supabaseAdmin.from("lost_pets").delete().eq("id", id);
  return c.body(null, 204);
});

// ---- Adoptions ----

communityRoutes.get("/adoptions", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const status = c.req.query("status");

  let query = supabaseAdmin
    .from("adoptions")
    .select("*", { count: "exact", head: false })
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

communityRoutes.get("/adoptions/:id", async (c) => {
  const id = c.req.param("id");

  const { data: adoption, error } = await supabaseAdmin
    .from("adoptions")
    .select(
      "*, pet:pets(*), owner:profiles!adoptions_owner_id_fkey(*), adopter:profiles!adoptions_adopter_id_fkey(*)"
    )
    .eq("id", id)
    .single();

  if (error || !adoption)
    return c.json({ detail: "Adopción no encontrada" }, 404);
  return c.json(adoption);
});

communityRoutes.post(
  "/adoptions",
  authMiddleware,
  zValidator("json", CreateAdoptionRequest),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const { data: pet } = await supabaseAdmin
      .from("pets")
      .select("owner_id")
      .eq("id", data.pet_id)
      .single();

    if (!pet || pet.owner_id !== userId)
      return c.json({ detail: "La mascota no te pertenece" }, 403);

    const insertData: Record<string, unknown> = {
      owner_id: userId,
      pet_id: data.pet_id,
      status: "available",
    };
    if (data.description) insertData.description = data.description;

    const { data: adoption, error } = await supabaseAdmin
      .from("adoptions")
      .insert(insertData)
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 422);
    return c.json(adoption, 201);
  }
);

communityRoutes.put(
  "/adoptions/:id",
  authMiddleware,
  zValidator("json", UpdateAdoptionRequest),
  async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const { data: existing } = await supabaseAdmin
      .from("adoptions")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!existing)
      return c.json({ detail: "Adopción no encontrada" }, 404);
    if (existing.owner_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) updateData[key] = value;
    }

    const { data: adoption, error } = await supabaseAdmin
      .from("adoptions")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 400);
    return c.json(adoption);
  }
);

communityRoutes.delete("/adoptions/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const { data: existing } = await supabaseAdmin
    .from("adoptions")
    .select("owner_id")
    .eq("id", id)
    .single();

  if (!existing)
    return c.json({ detail: "Adopción no encontrada" }, 404);
  if (existing.owner_id !== userId)
    return c.json({ detail: "No autorizado" }, 403);

  await supabaseAdmin.from("adoptions").delete().eq("id", id);
  return c.body(null, 204);
});
