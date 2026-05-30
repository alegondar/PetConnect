import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import {
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
} from "../schemas/auth.js";

type Variables = { userId: string };

export const authRoutes = new Hono<{ Variables: Variables }>();

authRoutes.post(
  "/auth/register",
  zValidator("json", RegisterRequest),
  async (c) => {
    const data = c.req.valid("json");

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { username: data.username },
        },
      });

    if (authError || !authData.user) {
      return c.json(
        { detail: authError?.message ?? "Error al registrar" },
        409
      );
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({ user_id: userId, username: data.username });
    if (profileError) {
      return c.json({ detail: profileError.message }, 400);
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    return c.json(
      {
        access_token: authData.session?.access_token ?? "",
        token_type: "bearer",
        profile,
      },
      201
    );
  }
);

authRoutes.post(
  "/auth/login",
  zValidator("json", LoginRequest),
  async (c) => {
    const data = c.req.valid("json");

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

    if (authError || !authData.user) {
      return c.json({ detail: "Credenciales inválidas" }, 401);
    }

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("user_id", authData.user.id)
      .single();

    return c.json({
      access_token: authData.session.access_token,
      token_type: "bearer",
      profile: profile ?? null,
    });
  }
);

authRoutes.get("/auth/me", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return c.json({ detail: "Perfil no encontrado" }, 404);
  }

  return c.json(profile);
});

authRoutes.put(
  "/auth/me",
  authMiddleware,
  zValidator("json", UpdateProfileRequest),
  async (c) => {
    const userId = c.get("userId");
    const data = c.req.valid("json");

    const updateData: Record<string, unknown> = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
    if (data.bio !== undefined) updateData.bio = data.bio;

    if (Object.keys(updateData).length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update(updateData)
        .eq("id", userId);
      if (updateError) {
        return c.json({ detail: updateError.message }, 400);
      }
    }

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return c.json({ detail: "Perfil no encontrado" }, 404);
    }

    return c.json(profile);
  }
);
