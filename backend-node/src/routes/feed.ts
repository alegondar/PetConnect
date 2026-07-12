import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware, optionalAuth } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import { CreatePostRequest, CreateCommentRequest, UpdatePostRequest } from "../schemas/feed.js";

export const feedRoutes = new Hono<{ Variables: Variables }>();

feedRoutes.get("/feed", async (c) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const mode = c.req.query("mode");

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  if (mode === "following") {
    const authHeader = c.req.header("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return c.json({ detail: "Autenticación requerida para feed de seguidos" }, 401);
    }
    const token = authHeader.slice(7);
    const { data: authData } = await supabaseAdmin.auth.getUser(token);
    if (!authData.user) {
      return c.json({ detail: "No autenticado" }, 401);
    }
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("user_id", authData.user.id)
      .single();
    if (!profile) {
      return c.json({ detail: "Usuario no encontrado" }, 401);
    }

    const { data: following } = await supabaseAdmin
      .from("user_follows")
      .select("following_id")
      .eq("follower_id", profile.id);

    const followingIds = (following ?? []).map((f) => f.following_id);
    if (followingIds.length === 0) {
      return c.json({ items: [], total: 0, page, pages: 0 });
    }

    const { data, count, error } = await supabaseAdmin
      .from("posts")
      .select("*, author:profiles(*), pet:pets(*)", {
        count: "exact",
        head: false,
      })
      .in("author_id", followingIds)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) return c.json({ detail: error.message }, 400);

    return c.json({
      items: data,
      total: count ?? 0,
      page,
      pages: Math.ceil((count ?? 0) / limit),
    });
  }

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

feedRoutes.get("/feed/:post_id", optionalAuth(), async (c) => {
  const postId = c.req.param("post_id");
  const userId = c.get("userId") as string | undefined;

  const { data: post, error } = await supabaseAdmin
    .from("posts")
    .select("*, author:profiles(*), pet:pets(*)")
    .eq("id", postId)
    .single();

  if (error || !post) return c.json({ detail: "Post no encontrado" }, 404);

  let likedByMe = false;
  if (userId) {
    const { data: like } = await supabaseAdmin
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .maybeSingle();
    likedByMe = !!like;
  }

  return c.json({ ...post, liked_by_me: likedByMe });
});