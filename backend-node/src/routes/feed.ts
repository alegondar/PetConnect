import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import { CreatePostRequest, CreateCommentRequest, UpdatePostRequest } from "../schemas/feed.js";

export const feedRoutes = new Hono<{ Variables: Variables }>();

feedRoutes.get("/feed", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("posts")
    .select("*, author:profiles(*), pet:pets(*)", {
      count: "exact",
      head: false,
    })
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

feedRoutes.get("/feed/:post_id", authMiddleware, async (c) => {
  const postId = c.req.param("post_id");
  const userId = c.get("userId");

  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .select("*, author:profiles(*), pet:pets(*)")
    .eq("id", postId)
    .single();

  if (error || !post) return c.json({ detail: "Post no encontrado" }, 404);

  const { data: like } = await supabaseAdmin
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  return c.json({ ...post, liked_by_me: !!like });
});

feedRoutes.post(
  "/feed",
  authMiddleware,
  zValidator("json", CreatePostRequest),
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
      author_id: userId,
      pet_id: data.pet_id,
      likes_count: 0,
      comments_count: 0,
    };
    if (data.content) insertData.content = data.content;
    if (data.photo_url) insertData.photo_url = data.photo_url;

    const { data: post, error } = await supabaseAdmin
      .from("posts")
      .insert(insertData)
      .select("*, author:profiles(*), pet:pets(*)")
      .single();

    if (error) {
      console.error("[POST /feed] Supabase error:", JSON.stringify(error, null, 2));
      return c.json({ detail: error.message }, 422);
    }
    return c.json(post, 201);
  }
);

feedRoutes.delete("/feed/:post_id", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const postId = c.req.param("post_id");

  const { data: post } = await supabaseAdmin
    .from("posts")
    .select("author_id")
    .eq("id", postId)
    .single();

  if (!post) return c.json({ detail: "Post no encontrado" }, 404);
  if (post.author_id !== userId)
    return c.json({ detail: "No autorizado" }, 403);

  await supabaseAdmin.from("posts").delete().eq("id", postId);
  return c.body(null, 204);
});

feedRoutes.put(
  "/feed/:post_id",
  authMiddleware,
  zValidator("json", UpdatePostRequest),
  async (c) => {
    const userId = c.get("userId");
    const postId = c.req.param("post_id");
    const data = c.req.valid("json");

    const { data: post } = await supabaseAdmin
      .from("posts")
      .select("author_id")
      .eq("id", postId)
      .single();

    if (!post) return c.json({ detail: "Post no encontrado" }, 404);
    if (post.author_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    const updateData: Record<string, unknown> = {};
    if (data.content !== undefined) updateData.content = data.content;
    if (data.photo_url !== undefined) updateData.photo_url = data.photo_url;

    if (Object.keys(updateData).length === 0)
      return c.json({ detail: "No hay campos para actualizar" }, 400);

    const { data: updated, error } = await supabaseAdmin
      .from("posts")
      .update(updateData)
      .eq("id", postId)
      .select("*, author:profiles(*), pet:pets(*)")
      .single();

    if (error) return c.json({ detail: error.message }, 400);
    return c.json(updated);
  }
);

// ---- Likes ----

feedRoutes.post("/feed/:post_id/like", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const postId = c.req.param("post_id");

  const { data: existing } = await supabaseAdmin
    .from("likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return c.json({ detail: "Ya diste like a este post" }, 409);

  await supabaseAdmin
    .from("likes")
    .insert({ user_id: userId, post_id: postId });

  return c.body(null, 201);
});

feedRoutes.delete("/feed/:post_id/like", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const postId = c.req.param("post_id");

  await supabaseAdmin
    .from("likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId);

  return c.body(null, 204);
});

// ---- Comments ----

feedRoutes.get("/feed/:post_id/comments", async (c) => {
  const postId = c.req.param("post_id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, count, error } = await supabaseAdmin
    .from("comments")
    .select("*, author:profiles(*)", { count: "exact", head: false })
    .eq("post_id", postId)
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

feedRoutes.post(
  "/feed/:post_id/comments",
  authMiddleware,
  zValidator("json", CreateCommentRequest),
  async (c) => {
    const userId = c.get("userId");
    const postId = c.req.param("post_id");
    const data = c.req.valid("json");

    const { data: comment, error } = await supabaseAdmin
      .from("comments")
      .insert({ user_id: userId, post_id: postId, content: data.content })
      .select("*, author:profiles(*)")
      .single();

    if (error) return c.json({ detail: error.message }, 422);
    return c.json(comment, 201);
  }
);

feedRoutes.delete(
  "/feed/:post_id/comments/:comment_id",
  authMiddleware,
  async (c) => {
    const userId = c.get("userId");
    const commentId = c.req.param("comment_id");

    const { data: comment } = await supabaseAdmin
      .from("comments")
      .select("user_id")
      .eq("id", commentId)
      .single();

    if (!comment)
      return c.json({ detail: "Comentario no encontrado" }, 404);

    if (comment.user_id !== userId)
      return c.json({ detail: "No autorizado" }, 403);

    await supabaseAdmin.from("comments").delete().eq("id", commentId);
    return c.body(null, 204);
  }
);
