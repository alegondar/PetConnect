import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { getSupabaseClients } from "../lib/supabase.js";
import type { Bindings } from "../index.js";
import type { Variables } from "../lib/types.js";

export const usersRoutes = new Hono<{ Bindings: Bindings; Variables: Variables }>();

function optionalAuth() {
  return async (c: any, next: any) => {
    const { supabaseAdmin } = getSupabaseClients(c.env);
    const authHeader = c.req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const { data } = await supabaseAdmin.auth.getUser(token);
      if (data.user) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("id")
          .eq("user_id", data.user.id)
          .single();
        if (profile) c.set("userId", profile.id);
      }
    }
    await next();
  };
}

async function getIsFollowing(
  env: any,
  userId: string,
  targetProfileId: string,
): Promise<boolean> {
  if (!userId) return false;
  const { supabaseAdmin } = getSupabaseClients(env);
  const { data } = await supabaseAdmin
    .from("user_follows")
    .select("id")
    .eq("follower_id", userId)
    .eq("following_id", targetProfileId)
    .maybeSingle();
  return !!data;
}

usersRoutes.get("/users/:userId", optionalAuth(), async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const targetId = c.req.param("userId");
  const currentUserId = c.get("userId") as string | undefined;

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("id, username, full_name, avatar_url, bio")
    .eq("id", targetId)
    .single();

  if (error || !profile) {
    return c.json({ detail: "Usuario no encontrado" }, 404);
  }

  const { count: postsCount } = await supabaseAdmin
    .from("posts")
    .select("id", { count: "exact", head: true })
    .eq("author_id", targetId);

  const isFollowing = currentUserId
    ? await getIsFollowing(c.env, currentUserId, targetId)
    : false;

  return c.json({
    ...profile,
    followers_count: (profile as any).followers_count ?? 0,
    following_count: (profile as any).following_count ?? 0,
    posts_count: postsCount ?? 0,
    is_following: isFollowing,
  });
});

usersRoutes.get("/users/:userId/posts", async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const targetId = c.req.param("userId");
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
    .eq("author_id", targetId)
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

usersRoutes.get("/users/:userId/followers", optionalAuth(), async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const targetId = c.req.param("userId");
  const currentUserId = c.get("userId") as string | undefined;
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: follows, count, error } = await supabaseAdmin
    .from("user_follows")
    .select("follower_id", { count: "exact", head: false })
    .eq("following_id", targetId)
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);
  if (!follows || follows.length === 0) {
    return c.json({ items: [], total: 0, page, pages: 0 });
  }

  const followerIds = follows.map((f) => f.follower_id);
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .in("id", followerIds);

  const items = await Promise.all(
    (profiles ?? []).map(async (p) => ({
      ...p,
      is_following: currentUserId
        ? await getIsFollowing(c.env, currentUserId, p.id)
        : false,
    })),
  );

  return c.json({
    items,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

usersRoutes.get("/users/:userId/following", optionalAuth(), async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const targetId = c.req.param("userId");
  const currentUserId = c.get("userId") as string | undefined;
  const page = Number(c.req.query("page")) || 1;
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data: follows, count, error } = await supabaseAdmin
    .from("user_follows")
    .select("following_id", { count: "exact", head: false })
    .eq("follower_id", targetId)
    .range(from, to);

  if (error) return c.json({ detail: error.message }, 400);
  if (!follows || follows.length === 0) {
    return c.json({ items: [], total: 0, page, pages: 0 });
  }

  const followingIds = follows.map((f) => f.following_id);
  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("id, username, full_name, avatar_url")
    .in("id", followingIds);

  const items = await Promise.all(
    (profiles ?? []).map(async (p) => ({
      ...p,
      is_following: currentUserId
        ? await getIsFollowing(c.env, currentUserId, p.id)
        : false,
    })),
  );

  return c.json({
    items,
    total: count ?? 0,
    page,
    pages: Math.ceil((count ?? 0) / limit),
  });
});

usersRoutes.post("/users/:userId/follow", authMiddleware, async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const currentUserId = c.get("userId");
  const targetId = c.req.param("userId");

  if (currentUserId === targetId) {
    return c.json({ detail: "No podés seguirte a vos mismo" }, 400);
  }

  const { data: existing } = await supabaseAdmin
    .from("user_follows")
    .select("id")
    .eq("follower_id", currentUserId)
    .eq("following_id", targetId)
    .maybeSingle();

  if (existing) {
    return c.json({ detail: "Ya seguís a este usuario" }, 409);
  }

  const { error } = await supabaseAdmin
    .from("user_follows")
    .insert({ follower_id: currentUserId, following_id: targetId });

  if (error) {
    return c.json({ detail: error.message }, 400);
  }

  return c.json({ detail: "Ahora seguís a este usuario" }, 201);
});

usersRoutes.delete("/users/:userId/follow", authMiddleware, async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const currentUserId = c.get("userId");
  const targetId = c.req.param("userId");

  const { error } = await supabaseAdmin
    .from("user_follows")
    .delete()
    .eq("follower_id", currentUserId)
    .eq("following_id", targetId);

  if (error) {
    return c.json({ detail: error.message }, 400);
  }

  return c.json({ detail: "Dejaste de seguir a este usuario" });
});

usersRoutes.get("/users", optionalAuth(), async (c) => {
  const { supabaseAdmin } = getSupabaseClients(c.env);
  const q = c.req.query("q");
  const limit = Math.min(Number(c.req.query("limit")) || 10, 50);
  const currentUserId = c.get("userId") as string | undefined;

  let query = supabaseAdmin
    .from("profiles")
    .select("id, username, full_name, avatar_url");

  if (q) {
    query = query.or(`username.ilike.%${q}%,full_name.ilike.%${q}%`);
  }

  query = query.order("created_at", { ascending: false }).limit(limit);

  const { data: profiles, error } = await query;

  if (error) return c.json({ detail: error.message }, 400);

  const items = await Promise.all(
    (profiles ?? []).map(async (p) => ({
      ...p,
      is_following: currentUserId
        ? await getIsFollowing(c.env, currentUserId, p.id)
        : false,
    })),
  );

  return c.json({ items });
});
