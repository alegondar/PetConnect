import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import {
  CreateOfferRequest,
  UpdateOfferRequest,
  CreateRequestRequest,
  UpdateRequestRequest,
  ContactMessageRequest,
} from "../schemas/services.js";

export const servicesRoutes = new Hono<{ Variables: Variables }>();

// ---- Service Offers ----

servicesRoutes.get("/services/offers", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const type = c.req.query("type");
  const location = c.req.query("location");

  let query = supabaseAdmin
    .from("service_offers")
    .select("*, provider:profiles(username, avatar_url, followers_count)", { count: "exact", head: false })
    .eq("status", "activo")
    .order("created_at", { ascending: false });

  if (type) query = query.eq("service_type", type);
  if (location) query = query.ilike("location", `%${location}%`);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, count, error } = await query.range(from, to);
  if (error) return c.json({ detail: error.message }, 400);

  return c.json({ items: data, total: count ?? 0, page, pages: Math.ceil((count ?? 0) / limit) });
});

servicesRoutes.get("/services/offers/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabaseAdmin
    .from("service_offers")
    .select("*, provider:profiles(username, avatar_url, followers_count)")
    .eq("id", id)
    .single();
  if (error || !data) return c.json({ detail: "Oferta no encontrada" }, 404);
  return c.json(data);
});

servicesRoutes.post(
  "/services/offers",
  authMiddleware,
  zValidator("json", CreateOfferRequest),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const insertData: Record<string, unknown> = {
      provider_id: userId,
      service_type: data.service_type,
      title: data.title,
      description: data.description,
      location: data.location,
    };
    if (data.price_from !== undefined) insertData.price_from = data.price_from;
    if (data.price_to !== undefined) insertData.price_to = data.price_to;
    if (data.price_unit) insertData.price_unit = data.price_unit;
    if (data.lat !== undefined) insertData.lat = data.lat;
    if (data.lng !== undefined) insertData.lng = data.lng;
    if (data.available_days) insertData.available_days = data.available_days;
    if (data.photo_url) insertData.photo_url = data.photo_url;

    const { data: offer, error } = await supabaseAdmin
      .from("service_offers")
      .insert(insertData)
      .select("*")
      .single();
    if (error) return c.json({ detail: error.message }, 422);
    return c.json(offer, 201);
  }
);

servicesRoutes.put(
  "/services/offers/:id",
  authMiddleware,
  zValidator("json", UpdateOfferRequest),
  async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const { data: existing } = await supabaseAdmin
      .from("service_offers")
      .select("provider_id")
      .eq("id", id)
      .single();
    if (!existing) return c.json({ detail: "Oferta no encontrada" }, 404);
    if (existing.provider_id !== userId) return c.json({ detail: "No autorizado" }, 403);

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) updateData[key] = value;
    }

    const { data: offer, error } = await supabaseAdmin
      .from("service_offers")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();
    if (error) return c.json({ detail: error.message }, 400);
    return c.json(offer);
  }
);

servicesRoutes.delete("/services/offers/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const { data: existing } = await supabaseAdmin
    .from("service_offers")
    .select("provider_id")
    .eq("id", id)
    .single();
  if (!existing) return c.json({ detail: "Oferta no encontrada" }, 404);
  if (existing.provider_id !== userId) return c.json({ detail: "No autorizado" }, 403);

  await supabaseAdmin.from("service_offers").delete().eq("id", id);
  return c.body(null, 204);
});

// ---- Service Requests ----

servicesRoutes.get("/services/requests", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const type = c.req.query("type");

  let query = supabaseAdmin
    .from("service_requests")
    .select("*, requester:profiles(username, avatar_url), pet:pets(name, photo_url, species)", { count: "exact", head: false })
    .eq("status", "activo")
    .order("created_at", { ascending: false });

  if (type) query = query.eq("service_type", type);

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const { data, count, error } = await query.range(from, to);
  if (error) return c.json({ detail: error.message }, 400);

  return c.json({ items: data, total: count ?? 0, page, pages: Math.ceil((count ?? 0) / limit) });
});

servicesRoutes.get("/services/requests/:id", async (c) => {
  const id = c.req.param("id");
  const { data, error } = await supabaseAdmin
    .from("service_requests")
    .select("*, requester:profiles(username, avatar_url, followers_count), pet:pets(name, photo_url, species)")
    .eq("id", id)
    .single();
  if (error || !data) return c.json({ detail: "Solicitud no encontrada" }, 404);
  return c.json(data);
});

servicesRoutes.post(
  "/services/requests",
  authMiddleware,
  zValidator("json", CreateRequestRequest),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const insertData: Record<string, unknown> = {
      requester_id: userId,
      service_type: data.service_type,
      title: data.title,
      description: data.description,
      location: data.location,
    };
    if (data.pet_id) insertData.pet_id = data.pet_id;
    if (data.frequency_per_week !== undefined) insertData.frequency_per_week = data.frequency_per_week;
    if (data.start_date) insertData.start_date = data.start_date;
    if (data.end_date) insertData.end_date = data.end_date;
    if (data.lat !== undefined) insertData.lat = data.lat;
    if (data.lng !== undefined) insertData.lng = data.lng;

    const { data: request, error } = await supabaseAdmin
      .from("service_requests")
      .insert(insertData)
      .select("*")
      .single();
    if (error) return c.json({ detail: error.message }, 422);
    return c.json(request, 201);
  }
);

servicesRoutes.put(
  "/services/requests/:id",
  authMiddleware,
  zValidator("json", UpdateRequestRequest),
  async (c) => {
    const userId = c.get("userId");
    const id = c.req.param("id");
    const data = c.req.valid("json");

    const { data: existing } = await supabaseAdmin
      .from("service_requests")
      .select("requester_id")
      .eq("id", id)
      .single();
    if (!existing) return c.json({ detail: "Solicitud no encontrada" }, 404);
    if (existing.requester_id !== userId) return c.json({ detail: "No autorizado" }, 403);

    const updateData: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) updateData[key] = value;
    }

    const { data: request, error } = await supabaseAdmin
      .from("service_requests")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();
    if (error) return c.json({ detail: error.message }, 400);
    return c.json(request);
  }
);

servicesRoutes.delete("/services/requests/:id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const { data: existing } = await supabaseAdmin
    .from("service_requests")
    .select("requester_id")
    .eq("id", id)
    .single();
  if (!existing) return c.json({ detail: "Solicitud no encontrada" }, 404);
  if (existing.requester_id !== userId) return c.json({ detail: "No autorizado" }, 403);

  await supabaseAdmin.from("service_requests").delete().eq("id", id);
  return c.body(null, 204);
});

// ---- Contact endpoints ----

servicesRoutes.post(
  "/services/requests/:id/contact",
  authMiddleware,
  zValidator("json", ContactMessageRequest),
  async (c) => {
    const senderId = c.get("userId");
    const requestId = c.req.param("id");
    const { message } = c.req.valid("json");

    const { data: request } = await supabaseAdmin
      .from("service_requests")
      .select("requester_id")
      .eq("id", requestId)
      .single();
    if (!request) return c.json({ detail: "Solicitud no encontrada" }, 404);

    const { error } = await supabaseAdmin
      .from("service_contacts")
      .insert({ request_id: requestId, sender_id: senderId, receiver_id: request.requester_id, message });
    if (error) return c.json({ detail: error.message }, 422);

    return c.json({ ok: true }, 201);
  }
);

servicesRoutes.post(
  "/services/offers/:id/contact",
  authMiddleware,
  zValidator("json", ContactMessageRequest),
  async (c) => {
    const senderId = c.get("userId");
    const offerId = c.req.param("id");
    const { message } = c.req.valid("json");

    const { data: offer } = await supabaseAdmin
      .from("service_offers")
      .select("provider_id")
      .eq("id", offerId)
      .single();
    if (!offer) return c.json({ detail: "Oferta no encontrada" }, 404);

    const { error } = await supabaseAdmin
      .from("service_contacts")
      .insert({ offer_id: offerId, sender_id: senderId, receiver_id: offer.provider_id, message });
    if (error) return c.json({ detail: error.message }, 422);

    return c.json({ ok: true }, 201);
  }
);

// ---- My contacts (received messages) ----

servicesRoutes.get("/services/my-contacts", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 50, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("service_contacts")
    .select("*, sender:profiles(username, avatar_url)", { count: "exact", head: false })
    .eq("receiver_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);
  if (error) return c.json({ detail: error.message }, 400);

  return c.json({ items: data, total: count ?? 0, page, pages: Math.ceil((count ?? 0) / limit) });
});
