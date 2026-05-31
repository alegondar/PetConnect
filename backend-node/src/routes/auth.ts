import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import {
  RegisterRequest,
  LoginRequest,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ChangeEmailRequest,
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

  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(
    profile.user_id,
  );
  const email = authUser?.user?.email ?? null;

  return c.json({ ...profile, email });
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
    if (data.full_name !== undefined) updateData.full_name = data.full_name;
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

authRoutes.put(
  "/auth/password",
  authMiddleware,
  zValidator("json", ChangePasswordRequest),
  async (c) => {
    const userId = c.get("userId");
    const { password } = c.req.valid("json");

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return c.json({ detail: "Perfil no encontrado" }, 404);
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      profile.user_id,
      { password },
    );

    if (updateError) {
      return c.json({ detail: updateError.message }, 400);
    }

    return c.json({ detail: "Contraseña actualizada correctamente" });
  },
);

authRoutes.put(
  "/auth/email",
  authMiddleware,
  zValidator("json", ChangeEmailRequest),
  async (c) => {
    const userId = c.get("userId");
    const { email } = c.req.valid("json");

    const { data: profile, error } = await supabaseAdmin
      .from("profiles")
      .select("user_id")
      .eq("id", userId)
      .single();

    if (error || !profile) {
      return c.json({ detail: "Perfil no encontrado" }, 404);
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      profile.user_id,
      { email },
    );

    if (updateError) {
      return c.json({ detail: updateError.message }, 400);
    }

    return c.json({
      detail: "Te enviamos un email de confirmación a la nueva dirección. El cambio se aplica cuando confirmés desde ese mail.",
    });
  },
);

authRoutes.post("/auth/avatar", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return c.json({ detail: "No se envió ningún archivo" }, 400);
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${Date.now()}.${ext}`;

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return c.json({ detail: "Perfil no encontrado" }, 404);
  }

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return c.json({ detail: uploadError.message }, 500);
  }

  const { data: urlData } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(path);

  return c.json({ url: urlData.publicUrl });
});

authRoutes.delete("/auth/me", authMiddleware, async (c) => {
  const userId = c.get("userId");

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("user_id")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return c.json({ detail: "Perfil no encontrado" }, 404);
  }

  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(
    profile.user_id,
  );
  if (deleteAuthError) {
    return c.json({ detail: deleteAuthError.message }, 500);
  }

  const { error: deleteProfileError } = await supabaseAdmin
    .from("profiles")
    .delete()
    .eq("id", userId);

  if (deleteProfileError) {
    return c.json({ detail: deleteProfileError.message }, 500);
  }

  return c.json({ detail: "Cuenta eliminada exitosamente" });
});
