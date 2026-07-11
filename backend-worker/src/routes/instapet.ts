import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { getSupabaseClients } from "../lib/supabase.js";
import type { Bindings } from "../index.js";
import type { Variables } from "../lib/types.js";
import {
  CreateInstaPetPostRequest,
  CreateMilestoneRequest,
} from "../schemas/instapet.js";

export const instapetRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// ---- InstaPet Posts ----

instapetRoutes.get("/pets/:pet_id/instapet/posts", async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const petId = c.req.param("pet_id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("instapet_posts")
    .select("*, author:profiles(*)", { count: "exact", head: false })
    .eq("pet_id", petId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

instapetRoutes.get("/pets/:pet_id/instapet/posts/:post_id", async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const postId = c.req.param("post_id");

  const { data: post, error } = await supabaseAdmin
    .from("instapet_posts")
    .select("*, author:profiles(*), pet:pets(*)")
    .eq("id", postId)
    .single();

  if (error || !post)
    return c.json({ detail: "Post no encontrado" }, 404);
  return c.json(post);
});

instapetRoutes.post(
  "/pets/:pet_id/instapet/posts",
  authMiddleware,
  zValidator("json", CreateInstaPetPostRequest),
  async (c) => {
    const { supabaseAdmin } = getSupabaseClients(c.env);
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

    const insertData: Record<string, unknown> = {
      author_id: userId,
      pet_id: petId,
      likes_count: 0,
      comments_count: 0,
    };
    if (data.photo_url) insertData.photo_url = data.photo_url;
    if (data.video_url) insertData.video_url = data.video_url;
    if (data.description) insertData.description = data.description;

    const { data: post, error } = await supabaseAdmin
      .from("instapet_posts")
      .insert(insertData)
      .select("*, author:profiles(*)")
      .single();

    if (error) return c.json({ detail: error.message }, 422);
    return c.json(post, 201);
  }
);

instapetRoutes.delete(
  "/pets/:pet_id/instapet/posts/:post_id",
  authMiddleware,
  async (c) => {
    const { supabaseAdmin } = getSupabaseClients(c.env);
    const userId = c.get("userId");
    const postId = c.req.param("post_id");

    const { data: post } = await supabaseAdmin
      .from("instapet_posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (!post) return c.json({ detail: "Post no encontrado" }, 404);
    if (post.author_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    await supabaseAdmin.from("instapet_posts").delete().eq("id", postId);
    return c.body(null, 204);
  }
);

// ---- Followers ----

instapetRoutes.get("/pets/:pet_id/followers", async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const petId = c.req.param("pet_id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("instapet_followers")
    .select("*, follower:profiles(*)", { count: "exact", head: false })
    .eq("pet_id", petId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

instapetRoutes.post("/pets/:pet_id/follow", authMiddleware, async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const userId = c.get("userId");
  const petId = c.req.param("pet_id");

  const { data: existing } = await supabaseAdmin
    .from("instapet_followers")
    .select("id")
    .eq("follower_id", userId)
    .eq("pet_id", petId)
    .maybeSingle();

  if (existing)
    return c.json({ detail: "Ya sigues a esta mascota" }, 409);

  await supabaseAdmin
    .from("instapet_followers")
    .insert({ follower_id: userId, pet_id: petId });

  return c.json({ detail: "Ahora sigues a esta mascota" }, 201);
});

instapetRoutes.delete("/pets/:pet_id/follow", authMiddleware, async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const userId = c.get("userId");
  const petId = c.req.param("pet_id");

  await supabaseAdmin
    .from("instapet_followers")
    .delete()
    .eq("follower_id", userId)
    .eq("pet_id", petId);

  return c.body(null, 204);
});

instapetRoutes.get("/me/following", authMiddleware, async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const userId = c.get("userId");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("instapet_followers")
    .select("pet_id, created_at, pet:pets(name, photo_url, species)", {
      count: "exact",
      head: false,
    })
    .eq("follower_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);

  const items =
    data?.map((row: any) => ({
      pet_id: row.pet_id,
      pet_name: row.pet?.name ?? "Desconocido",
      pet_photo_url: row.pet?.photo_url ?? null,
      species: row.pet?.species ?? "Desconocido",
      followed_at: row.created_at,
    })) ?? [];

  return c.json({
    items,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

// ---- Milestones ----

instapetRoutes.get("/pets/:pet_id/milestones", async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const petId = c.req.param("pet_id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("instapet_milestones")
    .select("*", { count: "exact", head: false })
    .eq("pet_id", petId)
    .order("milestone_date", { ascending: false })
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);

  return c.json({
    items: data,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

instapetRoutes.post(
  "/pets/:pet_id/milestones",
  authMiddleware,
  zValidator("json", CreateMilestoneRequest),
  async (c) => {
    const { supabaseAdmin } = getSupabaseClients(c.env);
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

    const insertData: Record<string, unknown> = {
      ...data,
      pet_id: petId,
    };

    const { data: milestone, error } = await supabaseAdmin
      .from("instapet_milestones")
      .insert(insertData)
      .select("*")
      .single();

    if (error) return c.json({ detail: error.message }, 422);
    return c.json(milestone, 201);
  }
);
