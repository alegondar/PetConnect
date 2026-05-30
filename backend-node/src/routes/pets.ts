import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import {
  CreatePetRequest,
  UpdatePetRequest,
  CreateVetVisitRequest,
  CreatePetEventRequest,
} from "../schemas/pets.js";

export const petsRoutes = new Hono<{ Variables: Variables }>();

petsRoutes.post("/pets/upload-photo", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return c.json({ detail: "No se envió ningún archivo" }, 400);
  }

  const buffer = await file.arrayBuffer();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${crypto.randomUUID().slice(0, 8)}-${file.name}`;

  const { error } = await supabaseAdmin.storage
    .from("pets")
    .upload(path, Buffer.from(buffer), {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) {
    return c.json({ detail: error.message }, 400);
  }

  const publicUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/pets/${path}`;
  return c.json({ url: publicUrl });
});

petsRoutes.get("/pets", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const species = c.req.query("species");
  const ownerId = c.req.query("owner_id");

  let query = supabaseAdmin
    .from("pets")
    .select("*", { count: "exact", head: false })
    .order("created_at", { ascending: false });

  if (species) query = query.eq("species", species);
  if (ownerId) query = query.eq("owner_id", ownerId);

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

petsRoutes.post(
  "/pets",
  authMiddleware,
  zValidator("json", CreatePetRequest),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const insertData: Record<string, unknown> = {
      name: data.name,
      species: data.species,
      owner_id: userId,
    };
    if (data.breed !== undefined && data.breed !== null) insertData.breed = data.breed;
    if (data.age !== undefined && data.age !== null) insertData.age = data.age;
    if (data.weight !== undefined && data.weight !== null) insertData.weight = data.weight;
    if (data.photo_url !== undefined && data.photo_url !== null) insertData.photo_url = data.photo_url;
    if (data.bio !== undefined && data.bio !== null) insertData.bio = data.bio;

    const { data: pet, error } = await supabaseAdmin
      .from("pets")
      .insert(insertData)
      .select("*")
      .single();

    if (error) {
      console.error("[POST /pets] Supabase error:", JSON.stringify(error, null, 2));
      return c.json({ detail: error.message }, 422);
    }
    return c.json(pet, 201);
  }
);

petsRoutes.get("/pets/:pet_id", async (c) => {
  const petId = c.req.param("pet_id");

  const { data: pet, error } = await supabaseAdmin
    .from("pets")
    .select("*")
    .eq("id", petId)
    .single();

  if (error || !pet) return c.json({ detail: "Mascota no encontrada" }, 404);
  return c.json(pet);
});

petsRoutes.put(
  "/pets/:pet_id",
  authMiddleware,
  zValidator("json", UpdatePetRequest),
  async (c) => {
    const userId = c.get("userId");
    const petId = c.req.param("pet_id");
    const data = c.req.valid("json");

    const { data: existing } = await supabaseAdmin
      .from("pets")
      .select("owner_id")
      .eq("id", petId)
      .single();

    if (!existing) return c.json({ detail: "Mascota no encontrada" }, 404);
    if (existing.owner_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) updateData[key] = value;
    }

    const { data: pet, error } = await supabaseAdmin
      .from("pets")
      .update(updateData)
      .eq("id", petId)
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 400);
    return c.json(pet);
  }
);

petsRoutes.delete("/pets/:pet_id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const petId = c.req.param("pet_id");

  const { data: existing } = await supabaseAdmin
    .from("pets")
    .select("owner_id")
    .eq("id", petId)
    .single();

  if (!existing) return c.json({ detail: "Mascota no encontrada" }, 404);
  if (existing.owner_id !== userId)
    return c.json({ detail: "No autorizado" }, 403);

  await supabaseAdmin.from("pets").delete().eq("id", petId);
  return c.body(null, 204);
});

// ---- Vet Visits ----

petsRoutes.get("/pets/:pet_id/vet-visits", async (c) => {
  const petId = c.req.param("pet_id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("vet_visits")
    .select("*", { count: "exact", head: false })
    .eq("pet_id", petId)
    .order("visit_date", { ascending: false })
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

petsRoutes.post(
  "/pets/:pet_id/vet-visits",
  authMiddleware,
  zValidator("json", CreateVetVisitRequest),
  async (c) => {
    const userId = c.get("userId");
    const petId = c.req.param("pet_id");
    const data = c.req.valid("json");

    const { data: pet } = await supabaseAdmin
      .from("pets")
      .select("owner_id")
      .eq("id", petId)
      .single();
    if (!pet) return c.json({ detail: "Mascota no encontrada" }, 404);
    if (pet.owner_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    const { data: visit, error } = await supabaseAdmin
      .from("vet_visits")
      .insert({ ...data, pet_id: petId })
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 422);
    return c.json(visit, 201);
  }
);

petsRoutes.put(
  "/pets/:pet_id/vet-visits/:visit_id",
  authMiddleware,
  zValidator("json", CreateVetVisitRequest),
  async (c) => {
    const visitId = c.req.param("visit_id");
    const data = c.req.valid("json");

    const { data: visit, error } = await supabaseAdmin
      .from("vet_visits")
      .update(data)
      .eq("id", visitId)
      .select("*")
      .single();

    if (error || !visit)
      return c.json({ detail: "Visita no encontrada" }, 404);
    return c.json(visit);
  }
);

petsRoutes.delete(
  "/pets/:pet_id/vet-visits/:visit_id",
  authMiddleware,
  async (c) => {
    const visitId = c.req.param("visit_id");

    const { error } = await supabaseAdmin
      .from("vet_visits")
      .delete()
      .eq("id", visitId);

    if (error) return c.json({ detail: "Visita no encontrada" }, 404);
    return c.body(null, 204);
  }
);

// ---- Pet Events ----

petsRoutes.get("/pets/:pet_id/events", async (c) => {
  const petId = c.req.param("pet_id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("pet_events")
    .select("*", { count: "exact", head: false })
    .eq("pet_id", petId)
    .order("event_date", { ascending: false })
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

petsRoutes.post(
  "/pets/:pet_id/events",
  authMiddleware,
  zValidator("json", CreatePetEventRequest),
  async (c) => {
    const userId = c.get("userId");
    const petId = c.req.param("pet_id");
    const data = c.req.valid("json");

    const { data: pet } = await supabaseAdmin
      .from("pets")
      .select("owner_id")
      .eq("id", petId)
      .single();
    if (!pet) return c.json({ detail: "Mascota no encontrada" }, 404);
    if (pet.owner_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    const { data: event, error } = await supabaseAdmin
      .from("pet_events")
      .insert({ ...data, pet_id: petId })
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 422);
    return c.json(event, 201);
  }
);

petsRoutes.put(
  "/pets/:pet_id/events/:event_id",
  authMiddleware,
  zValidator("json", CreatePetEventRequest),
  async (c) => {
    const eventId = c.req.param("event_id");
    const data = c.req.valid("json");

    const { data: event, error } = await supabaseAdmin
      .from("pet_events")
      .update(data)
      .eq("id", eventId)
      .select("*")
      .single();

    if (error || !event)
      return c.json({ detail: "Evento no encontrado" }, 404);
    return c.json(event);
  }
);

petsRoutes.delete(
  "/pets/:pet_id/events/:event_id",
  authMiddleware,
  async (c) => {
    const eventId = c.req.param("event_id");

    const { error } = await supabaseAdmin
      .from("pet_events")
      .delete()
      .eq("id", eventId);

    if (error) return c.json({ detail: "Evento no encontrado" }, 404);
    return c.body(null, 204);
  }
);
