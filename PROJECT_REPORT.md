# PetConnect — Project Report

Fecha de generación: 2026-05-31

---

## 0. Funcionalidades

| Módulo | Descripción |
|---|---|
| 🔐 **Auth** | Registro, login, recuperación de contraseña, configuración de perfil |
| 🐾 **Feed** | Posts de mascotas con likes, comentarios y fotos |
| 🏆 **Ranking** | Top mascotas semanal por likes |
| 🐶 **Mis Pets** | CRUD de mascotas, visitas al veterinario, eventos health tracking |
| 📸 **InstaPet** | Perfil social de mascotas con posts, seguidores y milestones |
| 🔍 **Perdidos** | Reporte y búsqueda de mascotas perdidas con mapa Leaflet |
| 🏠 **Adopciones** | Publicación y gestión de mascotas en adopción |
| 📍 **PetFriendly** | Directorio de lugares pet-friendly con mapa |
| 👤 **Perfil** | Avatar, username, bio, cambio de email/contraseña, eliminación de cuenta |
| 👥 **Social** | Seguir usuarios, perfiles públicos, feed personalizado, búsqueda, notificaciones |

---

## 1. Estructura de archivos

```
PetConnect/
├── .git/
├── .gitignore
├── .opencode/
│   ├── .gitignore
│   ├── agents/
│   ├── commands/
│   ├── node_modules/
│   ├── package-lock.json
│   ├── package.json
│   └── skills/
├── backend/                          # DEPRECATED — FastAPI (Python), legacy
├── backend-node/                     # API REST con Hono + TypeScript (activo)
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── index.ts
│       ├── migrate.ts
│       ├── lib/
│       │   ├── pagination.ts
│       │   ├── supabase.ts
│       │   └── types.ts
│       ├── middleware/
│       │   └── auth.ts
│       ├── routes/
│       │   ├── auth.ts
│       │   ├── community.ts
│       │   ├── feed.ts
│       │   ├── instapet.ts
│       │   ├── notifications.ts
│       │   ├── petfriendly.ts
│       │   ├── pets.ts
│       │   ├── ranking.ts
│       │   └── users.ts
│       └── schemas/
│           ├── auth.ts
│           ├── common.ts
│           ├── community.ts
│           ├── feed.ts
│           ├── instapet.ts
│           ├── petfriendly.ts
│           ├── pets.ts
│           ├── ranking.ts
│           └── users.ts
├── docs/
│   ├── db_schema.sql
│   ├── db_schema_petfriendly.sql
│   └── openapi.yaml
├── frontend/                         # Aplicación React + Vite
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── App.css
│       ├── App.tsx
│       ├── index.css
│       ├── main.tsx
│       ├── api/
│       │   ├── client.ts
│       │   └── endpoints/
│       │       ├── index.ts
│       │       └── petFriendly.ts
│       ├── assets/
│       ├── components/
│       │   ├── AvatarUpload.tsx
│       │   ├── CommentSection.tsx
│       │   ├── CreatePostModal.tsx
│       │   ├── FollowButton.tsx
│       │   ├── FollowersModal.tsx
│       │   ├── FollowingModal.tsx
│       │   ├── Layout.tsx
│       │   ├── LostPetPoster.tsx
│       │   ├── MapLocationPicker.tsx
│       │   ├── PostCard.tsx
│       │   └── ProtectedRoute.tsx
│       ├── hooks/
│       ├── lib/
│       │   └── supabase.ts
│       ├── pages/
│       │   ├── AdoptionsPage.tsx
│       │   ├── FeedPage.tsx
│       │   ├── FollowingPage.tsx
│       │   ├── ForgotPasswordPage.tsx
│       │   ├── InstaPetPage.tsx
│       │   ├── LoginPage.tsx
│       │   ├── LostPetDetailPage.tsx
│       │   ├── LostPetsPage.tsx
│       │   ├── MyPetsPage.tsx
│       │   ├── PetDetailPage.tsx
│       │   ├── PetFriendlyPage.tsx
│       │   ├── RankingPage.tsx
│       │   ├── RegisterPage.tsx
│       │   ├── ResetPasswordPage.tsx
│       │   ├── SearchUsersPage.tsx
│       │   ├── SettingsPage.tsx
│       │   └── UserProfilePage.tsx
│       ├── stores/
│       │   └── authStore.ts
│       └── types/
│           └── index.ts
├── openspec/
│   ├── changes/
│   ├── config.yaml
│   └── specs/
├── node_modules/
├── package.json                      # Raíz del monorepo
├── PetConnect-Manual.md
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

---

## 2. Contenido de archivos clave

### 2.1 Backend: `backend-node/src/index.ts`

```typescript
import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { serve } from "@hono/node-server";
import { authRoutes } from "./routes/auth.js";
import { petsRoutes } from "./routes/pets.js";
import { feedRoutes } from "./routes/feed.js";
import { rankingRoutes } from "./routes/ranking.js";
import { communityRoutes } from "./routes/community.js";
import { instapetRoutes } from "./routes/instapet.js";
import { petfriendlyRoutes } from "./routes/petfriendly.js";
import { usersRoutes } from "./routes/users.js";
import { notificationsRoutes } from "./routes/notifications.js";

const app = new Hono();

const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const PORT = Number(process.env.PORT) || 8000;

app.use(logger());
app.use(
  "*",
  cors({
    origin: FRONTEND_ORIGIN,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ detail: err.message || "Internal Server Error" }, 500);
});

app.route("/api/v1", authRoutes);
app.route("/api/v1", petsRoutes);
app.route("/api/v1", feedRoutes);
app.route("/api/v1", rankingRoutes);
app.route("/api/v1", communityRoutes);
app.route("/api/v1", instapetRoutes);
app.route("/api/v1", petfriendlyRoutes);
app.route("/api/v1", usersRoutes);
app.route("/api/v1", notificationsRoutes);

app.get("/", (c) => c.json({ message: "PetConnect API is running" }));

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  PetConnect API v0.1.0`);
  console.log(`  URL:  http://localhost:${info.port}`);
  console.log(`  CORS: ${FRONTEND_ORIGIN}`);
  console.log(`  Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
});
```

### 2.2 Backend: `backend-node/src/routes/auth.ts`

```typescript
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

// POST /auth/register — Registro de usuario
authRoutes.post(
  "/auth/register",
  zValidator("json", RegisterRequest),
  async (c) => {
    const data = c.req.valid("json");
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signUp({
        email: data.email,
        password: data.password,
        options: { data: { username: data.username } },
      });
    if (authError || !authData.user) {
      return c.json({ detail: authError?.message ?? "Error al registrar" }, 409);
    }
    const userId = authData.user.id;
    const { error: profileError } = await supabaseAdmin
      .from("profiles").insert({ user_id: userId, username: data.username });
    if (profileError) return c.json({ detail: profileError.message }, 400);
    const { data: profile } = await supabaseAdmin
      .from("profiles").select("*").eq("user_id", userId).single();
    return c.json({
      access_token: authData.session?.access_token ?? "",
      token_type: "bearer",
      profile,
    }, 201);
  }
);

// POST /auth/login — Inicio de sesión
authRoutes.post("/auth/login", zValidator("json", LoginRequest), async (c) => {
  const data = c.req.valid("json");
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.signInWithPassword({ email: data.email, password: data.password });
  if (authError || !authData.user) return c.json({ detail: "Credenciales inválidas" }, 401);
  const { data: profile } = await supabaseAdmin
    .from("profiles").select("*").eq("user_id", authData.user.id).single();
  return c.json({ access_token: authData.session.access_token, token_type: "bearer", profile: profile ?? null });
});

// GET /auth/me — Obtener perfil autenticado (con email)
authRoutes.get("/auth/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { data: profile, error } = await supabaseAdmin
    .from("profiles").select("*").eq("id", userId).single();
  if (error || !profile) return c.json({ detail: "Perfil no encontrado" }, 404);
  const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(profile.user_id);
  const email = authUser?.user?.email ?? null;
  return c.json({ ...profile, email });
});

// PUT /auth/me — Actualizar perfil
authRoutes.put("/auth/me", authMiddleware, zValidator("json", UpdateProfileRequest), async (c) => {
  const userId = c.get("userId");
  const data = c.req.valid("json");
  const updateData: Record<string, unknown> = {};
  if (data.username !== undefined) updateData.username = data.username;
  if (data.full_name !== undefined) updateData.full_name = data.full_name;
  if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (Object.keys(updateData).length > 0) {
    const { error: updateError } = await supabaseAdmin
      .from("profiles").update(updateData).eq("id", userId);
    if (updateError) return c.json({ detail: updateError.message }, 400);
  }
  const { data: profile, error } = await supabaseAdmin
    .from("profiles").select("*").eq("id", userId).single();
  if (error || !profile) return c.json({ detail: "Perfil no encontrado" }, 404);
  return c.json(profile);
});

// PUT /auth/password — Cambiar contraseña
authRoutes.put("/auth/password", authMiddleware, zValidator("json", ChangePasswordRequest), async (c) => {
  const userId = c.get("userId");
  const { password } = c.req.valid("json");
  const { data: profile, error } = await supabaseAdmin
    .from("profiles").select("user_id").eq("id", userId).single();
  if (error || !profile) return c.json({ detail: "Perfil no encontrado" }, 404);
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profile.user_id, { password });
  if (updateError) return c.json({ detail: updateError.message }, 400);
  return c.json({ detail: "Contraseña actualizada correctamente" });
});

// PUT /auth/email — Cambiar email
authRoutes.put("/auth/email", authMiddleware, zValidator("json", ChangeEmailRequest), async (c) => {
  const userId = c.get("userId");
  const { email } = c.req.valid("json");
  const { data: profile, error } = await supabaseAdmin
    .from("profiles").select("user_id").eq("id", userId).single();
  if (error || !profile) return c.json({ detail: "Perfil no encontrado" }, 404);
  const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(profile.user_id, { email });
  if (updateError) return c.json({ detail: updateError.message }, 400);
  return c.json({ detail: "Te enviamos un email de confirmación a la nueva dirección..." });
});

// POST /auth/avatar — Subir foto de perfil (multipart)
authRoutes.post("/auth/avatar", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const formData = await c.req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return c.json({ detail: "No se envió ningún archivo" }, 400);
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${Date.now()}.${ext}`;
  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles").select("user_id").eq("id", userId).single();
  if (profileError || !profile) return c.json({ detail: "Perfil no encontrado" }, 404);
  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars").upload(path, file, { upsert: true, contentType: file.type });
  if (uploadError) return c.json({ detail: uploadError.message }, 500);
  const { data: urlData } = supabaseAdmin.storage.from("avatars").getPublicUrl(path);
  return c.json({ url: urlData.publicUrl });
});

// DELETE /auth/me — Eliminar cuenta
authRoutes.delete("/auth/me", authMiddleware, async (c) => {
  const userId = c.get("userId");
  const { data: profile, error } = await supabaseAdmin
    .from("profiles").select("user_id").eq("id", userId).single();
  if (error || !profile) return c.json({ detail: "Perfil no encontrado" }, 404);
  const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(profile.user_id);
  if (deleteAuthError) return c.json({ detail: deleteAuthError.message }, 500);
  const { error: deleteProfileError } = await supabaseAdmin.from("profiles").delete().eq("id", userId);
  if (deleteProfileError) return c.json({ detail: deleteProfileError.message }, 500);
  return c.json({ detail: "Cuenta eliminada exitosamente" });
});
```

### 2.3 Backend: `backend-node/src/routes/pets.ts`

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import {
  CreatePetRequest, UpdatePetRequest,
  CreateVetVisitRequest, CreatePetEventRequest,
} from "../schemas/pets.js";

export const petsRoutes = new Hono<{ Variables: Variables }>();

// POST /pets/upload-photo — Subir foto de mascota (multipart, auth)
petsRoutes.post("/pets/upload-photo", authMiddleware, async (c) => { /* ... */ });

// GET /pets — Listar mascotas (paginado, filtro por species, owner_id)
petsRoutes.get("/pets", async (c) => { /* ... */ });

// POST /pets — Crear mascota (auth)
petsRoutes.post("/pets", authMiddleware, zValidator("json", CreatePetRequest), async (c) => { /* ... */ });

// GET /pets/:pet_id — Obtener mascota por ID
petsRoutes.get("/pets/:pet_id", async (c) => { /* ... */ });

// PUT /pets/:pet_id — Actualizar mascota (auth, solo dueño)
petsRoutes.put("/pets/:pet_id", authMiddleware, zValidator("json", UpdatePetRequest), async (c) => { /* ... */ });

// DELETE /pets/:pet_id — Eliminar mascota (auth, solo dueño)
petsRoutes.delete("/pets/:pet_id", authMiddleware, async (c) => { /* ... */ });

// ---- Vet Visits ----
// GET /pets/:pet_id/vet-visits — Listar visitas (paginado)
petsRoutes.get("/pets/:pet_id/vet-visits", async (c) => { /* ... */ });

// POST /pets/:pet_id/vet-visits — Crear visita (auth, dueño)
petsRoutes.post("/pets/:pet_id/vet-visits", authMiddleware, zValidator("json", CreateVetVisitRequest), async (c) => { /* ... */ });

// PUT /pets/:pet_id/vet-visits/:visit_id — Actualizar visita (auth)
petsRoutes.put("/pets/:pet_id/vet-visits/:visit_id", authMiddleware, zValidator("json", CreateVetVisitRequest), async (c) => { /* ... */ });

// DELETE /pets/:pet_id/vet-visits/:visit_id — Eliminar visita (auth)
petsRoutes.delete("/pets/:pet_id/vet-visits/:visit_id", authMiddleware, async (c) => { /* ... */ });

// ---- Pet Events (Health Tracking) ----
// GET /pets/:pet_id/events — Listar eventos (paginado)
petsRoutes.get("/pets/:pet_id/events", async (c) => { /* ... */ });

// POST /pets/:pet_id/events — Crear evento (auth, dueño)
petsRoutes.post("/pets/:pet_id/events", authMiddleware, zValidator("json", CreatePetEventRequest), async (c) => { /* ... */ });

// PUT /pets/:pet_id/events/:event_id — Actualizar evento (auth)
petsRoutes.put("/pets/:pet_id/events/:event_id", authMiddleware, zValidator("json", CreatePetEventRequest), async (c) => { /* ... */ });

// DELETE /pets/:pet_id/events/:event_id — Eliminar evento (auth)
petsRoutes.delete("/pets/:pet_id/events/:event_id", authMiddleware, async (c) => { /* ... */ });
```

### 2.4 Backend: `backend-node/src/routes/feed.ts`

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";
import { CreatePostRequest, CreateCommentRequest, UpdatePostRequest } from "../schemas/feed.js";

export const feedRoutes = new Hono<{ Variables: Variables }>();

// GET /feed — Obtener feed global (paginado, incluye author y pet)
feedRoutes.get("/feed", async (c) => { /* ... */ });

// GET /feed/:post_id — Obtener detalle de post (auth, incluye liked_by_me)
feedRoutes.get("/feed/:post_id", authMiddleware, async (c) => { /* ... */ });

// POST /feed — Crear post (auth, verifica propiedad de mascota)
feedRoutes.post("/feed", authMiddleware, zValidator("json", CreatePostRequest), async (c) => { /* ... */ });

// DELETE /feed/:post_id — Eliminar post (auth, solo autor)
feedRoutes.delete("/feed/:post_id", authMiddleware, async (c) => { /* ... */ });

// PUT /feed/:post_id — Actualizar post (auth, solo autor)
feedRoutes.put("/feed/:post_id", authMiddleware, zValidator("json", UpdatePostRequest), async (c) => { /* ... */ });

// ---- Likes ----
// POST /feed/:post_id/like — Dar like (auth, unique user_id+post_id)
feedRoutes.post("/feed/:post_id/like", authMiddleware, async (c) => { /* ... */ });

// DELETE /feed/:post_id/like — Quitar like (auth)
feedRoutes.delete("/feed/:post_id/like", authMiddleware, async (c) => { /* ... */ });

// ---- Comments ----
// GET /feed/:post_id/comments — Listar comentarios (paginado, incluye author)
feedRoutes.get("/feed/:post_id/comments", async (c) => { /* ... */ });

// POST /feed/:post_id/comments — Crear comentario (auth)
feedRoutes.post("/feed/:post_id/comments", authMiddleware, zValidator("json", CreateCommentRequest), async (c) => { /* ... */ });

// DELETE /feed/:post_id/comments/:comment_id — Eliminar comentario (auth, solo autor)
feedRoutes.delete("/feed/:post_id/comments/:comment_id", authMiddleware, async (c) => { /* ... */ });
```

### 2.5 Backend: `backend-node/src/routes/ranking.ts`

```typescript
import { Hono } from "hono";
import { supabaseAdmin } from "../lib/supabase.js";

export const rankingRoutes = new Hono();

// GET /ranking — Obtener top semanal (materialized view weekly_ranking)
rankingRoutes.get("/ranking", async (c) => {
  const limit = Math.min(Number(c.req.query("limit")) || 20, 100);
  const { data, error } = await supabaseAdmin
    .from("weekly_ranking").select("*").order("rank").limit(limit);
  if (error) return c.json({ detail: error.message }, 400);
  return c.json({ items: data ?? [], updated_at: data?.[0]?.updated_at ?? null });
});
```

### 2.6 Backend: `backend-node/src/routes/community.ts`

```typescript
// ---- Lost Pets ----
// GET /lost-pets — Listar mascotas perdidas (paginado, filtro status)
// GET /lost-pets/:id — Detalle con reporter
// POST /lost-pets — Reportar mascota perdida (auth)
// PUT /lost-pets/:id — Actualizar reporte (auth, solo reporter)
// DELETE /lost-pets/:id — Eliminar reporte (auth, solo reporter)

// ---- Adoptions ----
// GET /adoptions — Listar adopciones (paginado, filtro status)
// GET /adoptions/:id — Detalle con pet, owner, adopter
// POST /adoptions — Publicar en adopción (auth, verifica propiedad)
// PUT /adoptions/:id — Actualizar publicación (auth, solo owner)
// DELETE /adoptions/:id — Eliminar publicación (auth, solo owner)
```

### 2.7 Backend: `backend-node/src/routes/instapet.ts`

```typescript
// ---- InstaPet Posts ----
// GET /pets/:pet_id/instapet/posts — Listar posts (paginado)
// GET /pets/:pet_id/instapet/posts/:post_id — Detalle de post
// POST /pets/:pet_id/instapet/posts — Crear post (auth, dueño)
// DELETE /pets/:pet_id/instapet/posts/:post_id — Eliminar post (auth, autor)

// ---- Followers ----
// GET /pets/:pet_id/followers — Listar seguidores (paginado)
// POST /pets/:pet_id/follow — Seguir mascota (auth)
// DELETE /pets/:pet_id/follow — Dejar de seguir (auth)
// GET /me/following — Mascotas que sigo (auth, paginado)

// ---- Milestones ----
// GET /pets/:pet_id/milestones — Listar hitos (paginado)
// POST /pets/:pet_id/milestones — Crear hito (auth, dueño)
```

### 2.8 Backend: `backend-node/src/routes/petfriendly.ts`

```typescript
// GET /pet-friendly — Listar lugares pet-friendly (paginado, filtro por categoria)
// POST /pet-friendly — Agregar lugar (auth, con campos: nombre, categoria, lat, lng, direccion, descripcion, foto_url)
```

### 2.8a Backend: `backend-node/src/routes/users.ts`

```typescript
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";

export const usersRoutes = new Hono<{ Variables: Variables }>();

// Middleware optionalAuth: intenta autenticar pero no bloquea peticiones sin token
// Helper getIsFollowing(userId, targetProfileId): consulta user_follows

// GET /users/:userId — Perfil público con is_following, followers_count, following_count, posts_count
// GET /users/:userId/posts — Posts del usuario (paginado, incluye author y pet)
// GET /users/:userId/followers — Lista de seguidores (paginado, con is_following)
// GET /users/:userId/following — Lista de seguidos (paginado, con is_following)
// POST /users/:userId/follow — Seguir usuario (auth, no permite seguirse a sí mismo, unique)
// DELETE /users/:userId/follow — Dejar de seguir (auth)
// GET /users?q= — Búsqueda de usuarios por username o full_name (ILike, con is_following)
```

### 2.8b Backend: `backend-node/src/routes/notifications.ts`

```typescript
import { Hono } from "hono";
import { authMiddleware } from "../middleware/auth.js";
import { supabaseAdmin } from "../lib/supabase.js";
import type { Variables } from "../lib/types.js";

export const notificationsRoutes = new Hono<{ Variables: Variables }>();

// GET /notifications — Listar notificaciones del usuario autenticado (últimas 20)
// PATCH /notifications/read — Marcar todas las notificaciones no leídas como leídas
```

### 2.8c Backend: `backend-node/src/schemas/users.ts`

```typescript
import { z } from "zod";

export const UserProfile = z.object({
  id: z.string().uuid(), username: z.string(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  followers_count: z.number().int(), following_count: z.number().int(),
  posts_count: z.number().int(), is_following: z.boolean(),
});

export const UserListItem = z.object({
  id: z.string().uuid(), username: z.string(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  followers_count: z.number().int(), is_following: z.boolean(),
});

export const FollowResponse = z.object({ detail: z.string() });

export const UserSearchQuery = z.object({
  q: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(10),
});
```

### 2.9 Backend: `backend-node/src/schemas/auth.ts`

```typescript
import { z } from "zod";

export const RegisterRequest = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  username: z.string(),
});

export const LoginRequest = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const UpdateProfileRequest = z.object({
  username: z.string().optional(),
  full_name: z.string().optional().nullable(),
  avatar_url: z.string().url().optional().nullable(),
  bio: z.string().optional().nullable(),
});

export const Profile = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  username: z.string(),
  full_name: z.string().nullable().optional(),
  avatar_url: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AuthResponse = z.object({
  access_token: z.string(),
  token_type: z.string(),
  profile: Profile,
});

export const ChangePasswordRequest = z.object({ password: z.string().min(6) });
export const ChangeEmailRequest = z.object({ email: z.string().email() });
```

### 2.10 Backend: `backend-node/src/middleware/auth.ts`

```typescript
import { createMiddleware } from "hono/factory";

type Variables = { userId: string };

export const authMiddleware = createMiddleware<{ Variables: Variables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json({ detail: "No autenticado" }, 401);
    }
    const token = authHeader.slice(7);
    const { supabaseAdmin } = await import("../lib/supabase.js");
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return c.json({ detail: "No autenticado" }, 401);
    }
    const { data: profile } = await supabaseAdmin
      .from("profiles").select("id").eq("user_id", data.user.id).single();
    if (!profile) {
      return c.json({ detail: "Usuario no encontrado" }, 401);
    }
    c.set("userId", profile.id);
    await next();
  }
);
```

### 2.11 Backend: `backend-node/src/lib/supabase.ts`

```typescript
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});
```

### 2.12 Backend: `backend-node/package.json`

```json
{
  "name": "petconnect-backend",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "start": "tsx src/index.ts"
  },
  "dependencies": {
    "@hono/node-server": "^2.0.4",
    "@hono/zod-validator": "^0.4.2",
    "@supabase/supabase-js": "^2.49.1",
    "dotenv": "^17.4.2",
    "hono": "^4.7.5",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "tsx": "^4.19.3",
    "typescript": "^5.8.3"
  }
}
```

### 2.13 Backend: `backend-node/.env.example` (keys only)

```env
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY
FRONTEND_ORIGIN
PORT
```

### 2.14 Frontend: `frontend/src/App.tsx`

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const FeedPage = lazy(() => import('./pages/FeedPage'))
const PetFriendlyPage = lazy(() => import('./pages/PetFriendlyPage'))
const MyPetsPage = lazy(() => import('./pages/MyPetsPage'))
const PetDetailPage = lazy(() => import('./pages/PetDetailPage'))
const InstaPetPage = lazy(() => import('./pages/InstaPetPage'))
const FollowingPage = lazy(() => import('./pages/FollowingPage'))
const LostPetsPage = lazy(() => import('./pages/LostPetsPage'))
const LostPetDetailPage = lazy(() => import('./pages/LostPetDetailPage'))
const AdoptionsPage = lazy(() => import('./pages/AdoptionsPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'))
const SearchUsersPage = lazy(() => import('./pages/SearchUsersPage'))

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
})

function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/feed" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
              <Route path="/ranking" element={<Navigate to="/pet-friendly" replace />} />
              <Route path="/pet-friendly" element={<ProtectedRoute><PetFriendlyPage /></ProtectedRoute>} />
              <Route path="/my-pets" element={<ProtectedRoute><MyPetsPage /></ProtectedRoute>} />
              <Route path="/pets/:petId" element={<ProtectedRoute><PetDetailPage /></ProtectedRoute>} />
              <Route path="/instapet/:petId" element={<ProtectedRoute><InstaPetPage /></ProtectedRoute>} />
              <Route path="/following" element={<ProtectedRoute><FollowingPage /></ProtectedRoute>} />
              <Route path="/lost-pets/:id" element={<ProtectedRoute><LostPetDetailPage /></ProtectedRoute>} />
              <Route path="/lost-pets" element={<ProtectedRoute><LostPetsPage /></ProtectedRoute>} />
              <Route path="/adoptions" element={<ProtectedRoute><AdoptionsPage /></ProtectedRoute>} />
              <Route path="/profile/:userId" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchUsersPage /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/settings/reset-password" element={<ResetPasswordPage />} />
              <Route path="*" element={<Navigate to="/feed" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

### 2.15 Frontend pages (resumen de cada una)

**LoginPage.tsx** — Formulario de login con react-hook-form + zod. Usa `useAuthStore.login()`. Redirige a `/feed` si ya hay token. Link a `/register` y `/forgot-password`.

**RegisterPage.tsx** — Formulario de registro con username/email/password. Usa `useAuthStore.register()`. Misma redirección si hay token.

**FeedPage.tsx** — Feed principal con:
- Barra de "stories" (PetStories) con mascotas propias + siguiendo (horizontal scroll)
- Lista de posts con `PostCard`
- Botón "+ Post" que abre `CreatePostModal`
- Usa `feedApi.list()`, `petsApi.list()`, `instapetApi.listFollowing()`

**SettingsPage.tsx** — Página de configuración con 5 secciones:
- Perfil (username, full_name, bio, avatar upload)
- Cuenta (cambio de email, cambio de contraseña)
- Notificaciones (toggles placeholder — "Próximamente")
- Sesión (logout, logout all)
- Zona de peligro (eliminar cuenta con confirmación por email)
- Estilo dark theme (`bg-[#0a0a0b]`), usa lucide-react icons

**PetFriendlyPage.tsx** — Mapa Leaflet + listado de lugares pet-friendly en Buenos Aires:
- Mapa interactivo con markers
- Filtro por categoría (Todas, Cafetería, Bar/Restaurante, Hotel, Experiencia)
- Búsqueda por texto
- Detalle flotante al seleccionar marker
- Modal "Agregar lugar" con `MapLocationPicker` + formulario
- 357+ lugares precargados

**MyPetsPage.tsx** — CRUD de mascotas:
- Grid de mascotas con menú contextual (editar/eliminar)
- Modal para crear/editar mascota (`PetFormInline`)
- Subida de foto al bucket "pets"
- Links a `/pets/:petId` para ver detalle

**PetDetailPage.tsx** — Detalle de mascota con:
- Info básica (nombre, especie, raza, edad, peso)
- Sección "Visitas al Veterinario" (listado + formulario modal para crear)
- Sección "Health Tracking" / Eventos (vacunas, peso, desparasitación)

**InstaPetPage.tsx** — Perfil social de mascota:
- Header con foto, nombre, contador de seguidores, botón "Seguir"
- Grid de posts InstaPet (3 columnas)
- Sección de hitos/milestones
- Modales para crear post y crear hito

**FollowingPage.tsx** — Lista de mascotas que el usuario sigue, con links a `/instapet/:pet_id`

**LostPetsPage.tsx** — Listado de mascotas perdidas con:
- Filtro por status (Todas, Perdidas, Encontradas)
- Modal para reportar (con `MapLocationPicker` y subida de foto)
- Botón "Generar Cartel" que abre `PosterGeneratorModal`
- Links a `/lost-pets/:id`

**LostPetDetailPage.tsx** — Detalle de mascota perdida con foto, mapa (readonly), descripción, fecha

**AdoptionsPage.tsx** — Listado de adopciones con:
- Filtro por status (Todas, Disponibles, Adoptadas)
- Modal para publicar (selecciona mascota propia)
- Muestra info del pet, owner, status

**RankingPage.tsx** — Ranking semanal de mascotas (🏆 🥇 🥈 🥉 + top 20 por likes).
NOTA: La ruta `/ranking` en App.tsx redirige a `/pet-friendly`. La página existe pero no está accesible desde la navegación actual.

**ForgotPasswordPage.tsx** — Formulario de recuperación de contraseña. Usa `supabase.auth.resetPasswordForEmail()` directamente desde el frontend. Redirect a `/settings/reset-password`.

**ResetPasswordPage.tsx** — Formulario para nueva contraseña. Usa `supabase.auth.updateUser()`. Redirige a `/feed` al finalizar.

**UserProfilePage.tsx** — Perfil público de usuario con:
- Header con avatar, @username, full_name, bio
- Contadores de posts, seguidores, siguiendo (clickeables → modales)
- Botón Follow/Unfollow con FollowButton
- Si es perfil propio: botón "Editar perfil" → /settings
- Grid de 3 columnas con posts del usuario
- Modal de detalle de post al hacer click
- Modales de FollowersModal y FollowingModal

**SearchUsersPage.tsx** — Búsqueda de usuarios con:
- Input de búsqueda con autofocus y debounce (300ms)
- Sugerencias al cargar (sin query): lista de usuarios recientes
- Resultados de búsqueda por username o full_name (ILike)
- Cada fila muestra avatar, username, full_name y FollowButton
- Click en la fila navega a /profile/:userId

### 2.16 Frontend components

**Layout.tsx** — Layout principal con:
- Header sticky con logo, link "Siguiendo", icono Settings, avatar
- Navbar fija inferior con tabs: Feed, PetFriendly, Perdidos, Mis Pets
- Marquee animado ("vamos los perros dale rambo...")
- Oculta nav en `/login` y `/register`

**PostCard.tsx** — Tarjeta de post con:
- Avatar de mascota, nombre, raza, fecha
- Foto del post (o placeholder gradient)
- Botones de like (❤️/🤍) y comentarios (💬)
- Contenido del post
- Menú contextual (editar/eliminar) para el autor
- Modal de edición con cambio de foto
- Animación fadeInUp escalonada

**CreatePostModal.tsx** — Modal para crear post:
- Select de mascota del usuario
- Textarea para contenido
- Upload de foto (a bucket "pets")
- Manejo de estados: uploading, error

**CommentSection.tsx** — Sección de comentarios:
- Lista scrollable (max-h-56)
- Input + botón Enviar (Enter también envía)
- Muestra `author.username: content`

**ProtectedRoute.tsx** — Wrapper que redirige a `/login` si no hay token en `authStore`

**AvatarUpload.tsx** — Componente de subida de avatar:
- Preview circular con overlay hover
- Acepta JPG, PNG, WebP
- Validación de formato
- Usa `authApi.uploadAvatar()`

**MapLocationPicker.tsx** — Selector de ubicación con Leaflet:
- Mapa interactivo con marcador draggable
- Búsqueda de direcciones con Nominatim (OpenStreetMap)
- Modo readonly para vista de detalle
- Muestra coordenadas

**LostPetPoster.tsx** — Componente forwardRef para generar cartel de búsqueda:
- Header "SE BUSCA" en rojo
- Foto de la mascota
- Info: especie, raza, ubicación, teléfono
- Tabs recortables con teléfono
- Usado con html2canvas para descarga/imprimir

**FollowButton.tsx** — Botón Seguir/Dejar de seguir con estados:
- Props: userId, initialIsFollowing, onFollowChange callback
- Estados: "Seguir" (borde), "Siguiendo" (filled), hover "Dejar de seguir"
- Maneja el estado internamente y notifica cambios al padre

**FollowersModal.tsx** — Modal con lista de seguidores:
- Paginado (scroll infinito)
- Avatar, username, full_name, FollowButton por cada seguidor
- Click en usuario navega a /profile/:userId

**FollowingModal.tsx** — Modal con lista de seguidos:
- Misma estructura que FollowersModal
- Muestra usuarios seguidos con opción de unfollow

### 2.17 Frontend: `frontend/src/api/client.ts`

```typescript
import axios from 'axios'

const api = axios.create({ baseURL: '/api/v1' })

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('auth-storage')
    if (stored) {
      const parsed = JSON.parse(stored)
      const token = parsed?.state?.token
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
  } catch { /* localStorage corrupto */ }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default api
```

### 2.18 Frontend: `frontend/src/api/endpoints/index.ts`

Define las siguientes APIs:
- **authApi**: register, login, getMe, updateMe, changePassword, changeEmail, uploadAvatar, deleteMe
- **petsApi**: list, get, create, update, delete, uploadPhoto, listVetVisits, createVetVisit, deleteVetVisit, listEvents, createEvent, deleteEvent
- **feedApi**: list, get, create, delete, update, like, unlike, listComments, createComment, deleteComment
- **rankingApi**: get(limit)
- **communityApi**: listLostPets, getLostPet, createLostPet, updateLostPet, deleteLostPet, listAdoptions, getAdoption, createAdoption, updateAdoption, deleteAdoption
- **instapetApi**: listPosts, getPost, createPost, deletePost, listFollowers, follow, unfollow, listFollowing, listMilestones, createMilestone
- **usersApi**: getProfile, getUserPosts, getFollowers, getFollowing, follow, unfollow, search
- **notificationsApi**: list, markRead

### 2.19 Frontend: `frontend/src/api/endpoints/petFriendly.ts`

```typescript
import api from '../client'

export const petFriendlyApi = {
  listPlaces: (params?: Record<string, string | number>) => api.get('/pet-friendly', { params }),
  createPlace: (data: { nombre: string; categoria: string; lat: number; lng: number; direccion?: string; descripcion?: string; foto_url?: string }) => api.post('/pet-friendly', data),
}
```

### 2.20 Frontend: `frontend/src/stores/authStore.ts`

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi } from '../api/endpoints'
import type { Profile } from '../types'

interface AuthState {
  token: string | null
  profile: Profile | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, username: string) => Promise<void>
  logout: () => void
  setProfile: (profile: Profile) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      profile: null,
      isLoading: false,
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const res = await authApi.login({ email, password })
          set({ token: res.data.access_token, profile: res.data.profile })
        } finally { set({ isLoading: false }) }
      },
      register: async (email, password, username) => {
        set({ isLoading: true })
        try {
          const res = await authApi.register({ email, password, username })
          set({ token: res.data.access_token, profile: res.data.profile })
        } finally { set({ isLoading: false }) }
      },
      logout: () => set({ token: null, profile: null }),
      setProfile: (profile) => set({ profile }),
    }),
    { name: 'auth-storage' },
  ),
)
```

### 2.21 Frontend: `frontend/src/types/index.ts`

Define las siguientes interfaces TypeScript:
- **Profile** (id, user_id, username, full_name, avatar_url, bio, email?, created_at, updated_at)
- **Pet** (id, owner_id, name, species, breed, age, weight, photo_url, bio, created_at, updated_at)
- **Post** (id, author_id, pet_id, content, photo_url, likes_count, comments_count, created_at, updated_at, author?, pet?)
- **PostDetail** extends Post + liked_by_me
- **Comment** (id, user_id, post_id, content, created_at, updated_at, author?)
- **VetVisit** (id, pet_id, vet_name, visit_date, reason, notes)
- **PetEvent** (id, pet_id, event_type, event_date, value, notes)
- **RankingEntry** (rank, pet_id, pet_name, pet_photo_url, owner_username, likes_this_week)
- **LostPet** (id, reporter_id, name, species, breed, photo_url, last_seen_lat, last_seen_lng, last_seen_address, description, status, created_at, reporter?)
- **Adoption** (id, pet_id, owner_id, adopter_id, status, description, created_at, pet?, owner?)
- **InstaPetPost** (id, pet_id, author_id, photo_url, video_url, description, likes_count, comments_count, created_at, author?)
- **InstaPetMilestone** (id, pet_id, title, description, photo_url, milestone_date, created_at)
- **Follower** (id, follower_id, pet_id, created_at, follower?)
- **FollowingPet** (pet_id, pet_name, pet_photo_url, species, followed_at)
- **Paginated\<T\>** (items: T[], total, page, pages)
- **UserProfile** (id, username, full_name?, avatar_url?, bio?, followers_count, following_count, posts_count, is_following) — definido en UserProfilePage
- **UserItem** (id, username, full_name?, avatar_url?, is_following) — definido en SearchUsersPage
- **Notification** (id, user_id, type, data: JSON, read_at?, created_at)

### 2.22 Frontend: `frontend/package.json`

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.106.2",
    "react": "^19.2.6",
    "react-dom": "^19.2.6"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^24.12.3",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^6.0.1",
    "eslint": "^10.3.0",
    "eslint-plugin-react-hooks": "^7.1.1",
    "eslint-plugin-react-refresh": "^0.5.2",
    "globals": "^17.6.0",
    "typescript": "~6.0.2",
    "typescript-eslint": "^8.59.2",
    "vite": "^8.0.12"
  }
}
```

### 2.23 Frontend: `frontend/.env` (keys only)

```env
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### 2.24 Documentación: `docs/db_schema.sql`

(Ver sección 7 — Schema de base de datos para el detalle completo.)

Incluye 18 tablas/vistas: `profiles`, `pets`, `vet_visits`, `pet_events`, `posts`, `likes`, `comments`, `weekly_ranking`, `lost_pets`, `adoptions`, `instapet_posts`, `instapet_followers`, `instapet_milestones`, `pet_friendly_places`, `user_follows`, `notifications`, más triggers de contadores y función `update_updated_at_column()`.

### 2.25 Documentación: `docs/openapi.yaml`

(1767 líneas) — Especificación OpenAPI 3.0.3 con todos los endpoints, schemas, parámetros y respuestas documentados. Ver sección 6 para el resumen de endpoints.

### 2.26 Documentación: `docs/db_schema_petfriendly.sql`

```sql
create type pet_friendly_category as enum ('cafeteria', 'bar_restaurante', 'hotel', 'experiencia');

create table pet_friendly_places (
    id            uuid primary key default gen_random_uuid(),
    nombre        text not null,
    categoria     pet_friendly_category not null,
    lat           float8 not null,
    lng           float8 not null,
    descripcion   text,
    foto_url      text,
    fuente        text not null default 'usuario',
    verificado    boolean not null default false,
    created_by    uuid references profiles(id) on delete set null,
    created_at    timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

-- índices: idx_pf_categoria, idx_pf_coords
-- RLS: lectura pública, inserción con WITH CHECK (true)
```

### 2.27 README.md

Proporciona visión general del proyecto, tecnologías, estructura, setup, endpoints principales y agentes OpenSpec.

### 2.28 Configuración raíz

**`pnpm-workspace.yaml`:**
```yaml
packages:
  - "frontend"
  - "backend-node"
allowBuilds:
  esbuild: true
```

**`package.json` (raíz):**
```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.4.0",
    "@tanstack/react-query": "^5.100.13",
    "@types/leaflet": "^1.9.21",
    "axios": "^1.16.1",
    "html2canvas": "^1.4.1",
    "leaflet": "^1.9.4",
    "lucide-react": "^1.16.0",
    "react-hook-form": "^7.76.1",
    "react-leaflet": "^5.0.0",
    "react-router-dom": "^7.15.1",
    "zod": "^4.4.3",
    "zustand": "^5.0.13"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "tailwindcss": "^4.3.0"
  }
}
```

---

## 3. Dependencias

### Backend (`backend-node/package.json`)

| Dependencia | Versión | Propósito |
|---|---|---|
| `hono` | ^4.7.5 | Framework HTTP para API REST |
| `@hono/node-server` | ^2.0.4 | Adaptador Node.js para Hono |
| `@hono/zod-validator` | ^0.4.2 | Validación de requests con Zod en Hono |
| `@supabase/supabase-js` | ^2.49.1 | Cliente Supabase (PostgreSQL + Auth + Storage) |
| `dotenv` | ^17.4.2 | Carga variables de entorno desde `.env` |
| `zod` | ^3.24.2 | Validación de esquemas |
| `tsx` | ^4.19.3 | Ejecución de TypeScript sin compilación previa |
| `typescript` | ^5.8.3 | TypeScript compiler |
| `@types/node` | ^22.14.0 | Tipos de Node.js |

### Frontend (`frontend/package.json`)

| Dependencia | Versión | Propósito |
|---|---|---|
| `react` | ^19.2.6 | Biblioteca UI |
| `react-dom` | ^19.2.6 | Renderizado DOM para React |
| `@supabase/supabase-js` | ^2.106.2 | Cliente Supabase (para auth en frontend) |
| `vite` | ^8.0.12 | Bundler y dev server |
| `@vitejs/plugin-react` | ^6.0.1 | Plugin React para Vite |
| `typescript` | ~6.0.2 | TypeScript compiler |
| `eslint` | ^10.3.0 | Linter |

### Raíz (`package.json`) — Dependencias compartidas del workspace

| Dependencia | Versión | Propósito |
|---|---|---|
| `@hookform/resolvers` | ^5.4.0 | Integración zod con react-hook-form |
| `@tanstack/react-query` | ^5.100.13 | Data fetching y caching |
| `axios` | ^1.16.1 | Cliente HTTP |
| `react-hook-form` | ^7.76.1 | Manejo de formularios |
| `react-router-dom` | ^7.15.1 | Enrutamiento SPA |
| `zod` | ^4.4.3 | Validación de esquemas (frontend) |
| `zustand` | ^5.0.13 | State management |
| `@tailwindcss/vite` | ^4.3.0 | Plugin Tailwind para Vite |
| `tailwindcss` | ^4.3.0 | Framework CSS |
| `leaflet` | ^1.9.4 | Mapas interactivos |
| `react-leaflet` | ^5.0.0 | Componentes React para Leaflet |
| `@types/leaflet` | ^1.9.21 | Tipos de Leaflet |
| `lucide-react` | ^1.16.0 | Iconos |
| `html2canvas` | ^1.4.1 | Captura de componentes a imagen (carteles) |

---

## 4. Variables de entorno

### Backend (`backend-node/.env`)

| Key | Descripción |
|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_ANON_KEY` | API key anónima de Supabase |
| `SUPABASE_SERVICE_KEY` | API key service_role de Supabase |
| `FRONTEND_ORIGIN` | Origen del frontend para CORS |
| `PORT` | Puerto del servidor backend |

### Frontend (`frontend/.env`)

| Key | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL del proyecto Supabase (expuesta al cliente) |
| `VITE_SUPABASE_ANON_KEY` | API key anónima de Supabase (expuesta al cliente) |

---

## 5. Rutas React Router

| Path | Componente | ProtectedRoute | Lazy Loading | Descripción |
|---|---|---|---|---|
| `/login` | LoginPage | No | Sí | Inicio de sesión |
| `/register` | RegisterPage | No | Sí | Registro de usuario |
| `/feed` | FeedPage | Sí | Sí | Feed principal de posts |
| `/ranking` | Navigate → `/pet-friendly` | — | — | Redirige a PetFriendly |
| `/pet-friendly` | PetFriendlyPage | Sí | Sí | Mapa de lugares pet-friendly |
| `/my-pets` | MyPetsPage | Sí | Sí | CRUD de mascotas del usuario |
| `/pets/:petId` | PetDetailPage | Sí | Sí | Detalle de mascota + visitas/eventos |
| `/instapet/:petId` | InstaPetPage | Sí | Sí | Perfil social de mascota |
| `/following` | FollowingPage | Sí | Sí | Mascotas que sigue el usuario |
| `/lost-pets/:id` | LostPetDetailPage | Sí | Sí | Detalle de mascota perdida |
| `/lost-pets` | LostPetsPage | Sí | Sí | Listado de mascotas perdidas |
| `/adoptions` | AdoptionsPage | Sí | Sí | Listado de adopciones |
| `/profile/:userId` | UserProfilePage | Sí | Sí | Perfil público de usuario |
| `/search` | SearchUsersPage | Sí | Sí | Búsqueda de usuarios |
| `/settings` | SettingsPage | Sí | Sí | Configuración de perfil/cuenta |
| `/forgot-password` | ForgotPasswordPage | No | Sí | Recuperación de contraseña |
| `/settings/reset-password` | ResetPasswordPage | No | Sí | Establecer nueva contraseña |
| `*` (catch-all) | Navigate → `/feed` | — | — | Redirige al feed |

Todas las rutas están dentro de `<Route element={<Layout />}>`. El Layout oculta header/nav en `/login` y `/register`.

---

## 6. Endpoints API

Todos los endpoints están montados bajo `/api/v1`.

### Auth

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| POST | `/auth/register` | No | Registro de usuario | `{ email, password, username }` | `201 { access_token, token_type, profile }` |
| POST | `/auth/login` | No | Inicio de sesión | `{ email, password }` | `200 { access_token, token_type, profile }` |
| GET | `/auth/me` | Sí | Obtener perfil + email | — | `200 Profile (con email)` |
| PUT | `/auth/me` | Sí | Actualizar perfil | `{ username?, full_name?, avatar_url?, bio? }` | `200 Profile` |
| PUT | `/auth/password` | Sí | Cambiar contraseña | `{ password }` | `200 { detail }` |
| PUT | `/auth/email` | Sí | Cambiar email | `{ email }` | `200 { detail }` |
| POST | `/auth/avatar` | Sí | Subir foto de perfil | `multipart/form-data { file }` | `200 { url }` |
| DELETE | `/auth/me` | Sí | Eliminar cuenta permanentemente | — | `200 { detail }` |

### Pets

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| POST | `/pets/upload-photo` | Sí | Subir foto al bucket "pets" | `multipart { file }` | `200 { url }` |
| GET | `/pets` | No | Listar mascotas (paginado, ?species, ?owner_id) | — | `200 Paginated<Pet>` |
| POST | `/pets` | Sí | Registrar mascota | `{ name*, species*, breed?, age?, weight?, photo_url?, bio? }` | `201 Pet` |
| GET | `/pets/:pet_id` | No | Obtener mascota por ID | — | `200 Pet` |
| PUT | `/pets/:pet_id` | Sí | Actualizar mascota (solo dueño) | `{ name?, species?, breed?, age?, weight?, photo_url?, bio? }` | `200 Pet` |
| DELETE | `/pets/:pet_id` | Sí | Eliminar mascota (solo dueño) | — | `204 No Content` |
| GET | `/pets/:pet_id/vet-visits` | No | Listar visitas al veterinario (paginado) | — | `200 Paginated<VetVisit>` |
| POST | `/pets/:pet_id/vet-visits` | Sí | Registrar visita (dueño) | `{ vet_name*, visit_date*, reason*, notes? }` | `201 VetVisit` |
| PUT | `/pets/:pet_id/vet-visits/:visit_id` | Sí | Actualizar visita | `{ vet_name*, visit_date*, reason*, notes? }` | `200 VetVisit` |
| DELETE | `/pets/:pet_id/vet-visits/:visit_id` | Sí | Eliminar visita | — | `204 No Content` |
| GET | `/pets/:pet_id/events` | No | Listar eventos health tracking (paginado) | — | `200 Paginated<PetEvent>` |
| POST | `/pets/:pet_id/events` | Sí | Registrar evento (dueño) | `{ event_type*, event_date*, value?, notes? }` | `201 PetEvent` |
| PUT | `/pets/:pet_id/events/:event_id` | Sí | Actualizar evento | `{ event_type*, event_date*, value?, notes? }` | `200 PetEvent` |
| DELETE | `/pets/:pet_id/events/:event_id` | Sí | Eliminar evento | — | `204 No Content` |

### Feed

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/feed` | No | Feed de posts (paginado, incluye author y pet) | — | `200 Paginated<Post>` |
| GET | `/feed/:post_id` | Sí | Detalle de post (con liked_by_me) | — | `200 PostDetail` |
| POST | `/feed` | Sí | Crear post (verifica propiedad de mascota) | `{ pet_id*, content?, photo_url? }` | `201 Post` |
| DELETE | `/feed/:post_id` | Sí | Eliminar post (solo autor) | — | `204 No Content` |
| PUT | `/feed/:post_id` | Sí | Actualizar post (solo autor) | `{ content?, photo_url? }` | `200 Post` |
| POST | `/feed/:post_id/like` | Sí | Dar like (unique user_id+post_id) | — | `201 Created` |
| DELETE | `/feed/:post_id/like` | Sí | Quitar like | — | `204 No Content` |
| GET | `/feed/:post_id/comments` | No | Listar comentarios (paginado, incluye author) | — | `200 Paginated<Comment>` |
| POST | `/feed/:post_id/comments` | Sí | Comentar en post | `{ content* }` | `201 Comment` |
| DELETE | `/feed/:post_id/comments/:comment_id` | Sí | Eliminar comentario (solo autor) | — | `204 No Content` |

### Ranking

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/ranking` | No | Ranking semanal (?limit, max 100) | — | `200 { items: RankingEntry[], updated_at }` |

### Community (Lost Pets + Adoptions)

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/lost-pets` | No | Listar mascotas perdidas (paginado, ?status) | — | `200 Paginated<LostPet>` |
| GET | `/lost-pets/:id` | No | Detalle con reporter | — | `200 LostPetDetail` |
| POST | `/lost-pets` | Sí | Reportar mascota perdida | `{ name*, species*, last_seen_lat*, last_seen_lng*, breed?, photo_url?, last_seen_address?, description? }` | `201 LostPet` |
| PUT | `/lost-pets/:id` | Sí | Actualizar reporte (solo reporter) | `{ name?, species?, status?, ... }` | `200 LostPet` |
| DELETE | `/lost-pets/:id` | Sí | Eliminar reporte (solo reporter) | — | `204 No Content` |
| GET | `/adoptions` | No | Listar adopciones (paginado, ?status) | — | `200 Paginated<Adoption>` |
| GET | `/adoptions/:id` | No | Detalle con pet, owner, adopter | — | `200 AdoptionDetail` |
| POST | `/adoptions` | Sí | Publicar mascota en adopción | `{ pet_id*, description? }` | `201 Adoption` |
| PUT | `/adoptions/:id` | Sí | Actualizar adopción (solo owner) | `{ status?, adopter_id?, description? }` | `200 Adoption` |
| DELETE | `/adoptions/:id` | Sí | Eliminar adopción (solo owner) | — | `204 No Content` |

### InstaPet

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/pets/:pet_id/instapet/posts` | No | Listar posts del perfil InstaPet (paginado) | — | `200 Paginated<InstaPetPost>` |
| GET | `/pets/:pet_id/instapet/posts/:post_id` | No | Detalle de post InstaPet | — | `200 InstaPetPostDetail` |
| POST | `/pets/:pet_id/instapet/posts` | Sí | Publicar en perfil InstaPet (dueño) | `{ photo_url?, video_url?, description? }` | `201 InstaPetPost` |
| DELETE | `/pets/:pet_id/instapet/posts/:post_id` | Sí | Eliminar post InstaPet (autor) | — | `204 No Content` |
| GET | `/pets/:pet_id/followers` | No | Listar seguidores (paginado) | — | `200 Paginated<Follower>` |
| POST | `/pets/:pet_id/follow` | Sí | Seguir mascota | — | `201 { detail }` |
| DELETE | `/pets/:pet_id/follow` | Sí | Dejar de seguir | — | `204 No Content` |
| GET | `/me/following` | Sí | Mascotas que sigo (paginado) | — | `200 Paginated<FollowingPet>` |
| GET | `/pets/:pet_id/milestones` | No | Listar hitos (paginado) | — | `200 Paginated<Milestone>` |
| POST | `/pets/:pet_id/milestones` | Sí | Crear hito (dueño) | `{ title*, milestone_date*, description?, photo_url? }` | `201 Milestone` |

### PetFriendly

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/pet-friendly` | No | Listar lugares (paginado, ?categoria, limit default 50, máx 200) | — | `200 Paginated<Place>` |
| POST | `/pet-friendly` | Sí | Agregar lugar | `{ nombre*, categoria*, lat*, lng*, direccion?, descripcion?, foto_url? }` | `201 Place` |

### Social (Users + Notifications)

| Método | Ruta | Auth | Descripción | Request Body | Response |
|---|---|---|---|---|---|
| GET | `/users/:userId` | Opcional | Perfil público con is_following, followers_count, following_count, posts_count | — | `200 UserProfile` |
| GET | `/users/:userId/posts` | No | Posts del usuario (paginado, incluye author y pet) | — | `200 Paginated<Post>` |
| GET | `/users/:userId/followers` | Opcional | Lista de seguidores (paginado, con is_following) | — | `200 Paginated<UserListItem>` |
| GET | `/users/:userId/following` | Opcional | Lista de seguidos (paginado, con is_following) | — | `200 Paginated<UserListItem>` |
| POST | `/users/:userId/follow` | Sí | Seguir usuario (no permite seguirse a sí mismo) | — | `201 { detail }` |
| DELETE | `/users/:userId/follow` | Sí | Dejar de seguir | — | `200 { detail }` |
| GET | `/users?q=` | Opcional | Buscar usuarios por username o full_name (ILike) | — | `200 { items: UserListItem[] }` |
| GET | `/notifications` | Sí | Listar notificaciones del usuario (últimas 20) | — | `200 { items: Notification[] }` |
| PATCH | `/notifications/read` | Sí | Marcar todas las no leídas como leídas | — | `200 { read: number }` |

---

## 7. Schema de base de datos

### 7.1 Tabla: `profiles`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → auth.users(id) ON DELETE CASCADE, UNIQUE NOT NULL |
| username | text | UNIQUE NOT NULL |
| full_name | text | — (agregado con ALTER TABLE) |
| avatar_url | text | nullable |
| bio | text | nullable |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| updated_at | timestamptz | NOT NULL DEFAULT now() |

**Índices:** idx_profiles_username

**Triggers:** trg_profiles_updated_at (BEFORE UPDATE), on_auth_user_created (AFTER INSERT ON auth.users)

**RLS:** SELECT público, INSERT/UPDATE solo propio perfil

### 7.2 Tabla: `pets`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| owner_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| name | text | NOT NULL |
| species | text | NOT NULL |
| breed | text | nullable |
| age | integer | nullable |
| weight | decimal(5,2) | nullable |
| photo_url | text | nullable |
| bio | text | nullable |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_pets_owner_id, idx_pets_species

**RLS:** SELECT público, INSERT/UPDATE/DELETE solo dueño (via profiles.user_id = auth.uid())

### 7.3 Tabla: `vet_visits`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| pet_id | uuid | FK → pets(id) ON DELETE CASCADE NOT NULL |
| vet_name | text | NOT NULL |
| visit_date | date | NOT NULL |
| reason | text | NOT NULL |
| notes | text | nullable |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_vet_visits_pet_id, idx_vet_visits_date

**RLS:** Solo dueño de la mascota (SELECT/INSERT/UPDATE/DELETE)

### 7.4 Tabla: `pet_events`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| pet_id | uuid | FK → pets(id) ON DELETE CASCADE NOT NULL |
| event_type | text | NOT NULL, CHECK IN ('vaccination','weight','deworming','medication','other') |
| event_date | date | NOT NULL |
| value | text | nullable |
| notes | text | nullable |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_pet_events_pet_id, idx_pet_events_date

**RLS:** Solo dueño de la mascota

### 7.5 Tabla: `posts`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| author_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| pet_id | uuid | FK → pets(id) ON DELETE CASCADE NOT NULL |
| content | text | nullable |
| photo_url | text | nullable |
| likes_count | integer | DEFAULT 0 NOT NULL |
| comments_count | integer | DEFAULT 0 NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_posts_author_id, idx_posts_pet_id, idx_posts_created_at

**RLS:** SELECT público, INSERT/UPDATE/DELETE solo autor

### 7.6 Tabla: `likes`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| post_id | uuid | FK → posts(id) ON DELETE CASCADE NOT NULL |
| created_at | timestamptz | NOT NULL |
| — | — | UNIQUE(user_id, post_id) |

**Índices:** idx_likes_post_id, idx_likes_user_id

**Triggers:** trg_likes_count (AFTER INSERT/DELETE → actualiza posts.likes_count)

**RLS:** SELECT público, INSERT/DELETE solo propio

### 7.7 Tabla: `comments`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| post_id | uuid | FK → posts(id) ON DELETE CASCADE NOT NULL |
| content | text | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_comments_post_id, idx_comments_user_id

**Triggers:** trg_comments_count (AFTER INSERT/DELETE → actualiza posts.comments_count)

**RLS:** SELECT público, INSERT/DELETE solo autor

### 7.8 Materialized View: `weekly_ranking`
| Columna | Tipo | Descripción |
|---|---|---|
| rank | bigint | Posición (row_number) |
| pet_id | uuid | ID de la mascota |
| pet_name | text | Nombre de la mascota |
| pet_photo_url | text | Foto de la mascota |
| owner_username | text | Username del dueño |
| likes_this_week | bigint | Cantidad de likes en últimos 7 días |
| updated_at | timestamptz | Timestamp de actualización |

**Índices:** idx_weekly_ranking_pet_id (unique), idx_weekly_ranking_rank

NOTA: Es una vista materializada que debe refrescarse manualmente (no hay trigger de refresh automático).

### 7.9 Tabla: `lost_pets`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| reporter_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| name | text | NOT NULL |
| species | text | NOT NULL |
| breed | text | nullable |
| photo_url | text | nullable |
| last_seen_lat | decimal(10,7) | NOT NULL |
| last_seen_lng | decimal(10,7) | NOT NULL |
| last_seen_address | text | nullable |
| description | text | nullable |
| status | text | DEFAULT 'lost' NOT NULL, CHECK IN ('lost','found') |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_lost_pets_reporter_id, idx_lost_pets_status, idx_lost_pets_coords

**RLS:** SELECT público, INSERT/UPDATE/DELETE con WITH CHECK (true) — backend valida auth

### 7.10 Tabla: `adoptions`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| pet_id | uuid | FK → pets(id) ON DELETE CASCADE NOT NULL |
| owner_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| adopter_id | uuid | FK → profiles(id) ON DELETE SET NULL |
| status | text | DEFAULT 'available' NOT NULL, CHECK IN ('available','pending','adopted') |
| description | text | nullable |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_adoptions_pet_id, idx_adoptions_owner_id, idx_adoptions_status

**RLS:** SELECT solo disponibles/pending, INSERT/UPDATE/DELETE solo dueño

### 7.11 Tabla: `instapet_posts`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| pet_id | uuid | FK → pets(id) ON DELETE CASCADE NOT NULL |
| author_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| photo_url | text | nullable |
| video_url | text | nullable |
| description | text | nullable |
| likes_count | integer | DEFAULT 0 NOT NULL |
| comments_count | integer | DEFAULT 0 NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_instapet_posts_pet_id, idx_instapet_posts_author_id, idx_instapet_posts_created_at

**RLS:** SELECT público, INSERT/UPDATE/DELETE solo autor

### 7.12 Tabla: `instapet_followers`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| follower_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| pet_id | uuid | FK → pets(id) ON DELETE CASCADE NOT NULL |
| created_at | timestamptz | NOT NULL |
| — | — | UNIQUE(follower_id, pet_id) |

**Índices:** idx_instapet_followers_follower_id, idx_instapet_followers_pet_id

**RLS:** SELECT público, INSERT/DELETE solo propio perfil

### 7.13 Tabla: `instapet_milestones`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| pet_id | uuid | FK → pets(id) ON DELETE CASCADE NOT NULL |
| title | text | NOT NULL |
| description | text | nullable |
| photo_url | text | nullable |
| milestone_date | date | NOT NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**Índices:** idx_instapet_milestones_pet_id, idx_instapet_milestones_date

**RLS:** SELECT público, INSERT/UPDATE/DELETE solo dueño de la mascota

### 7.14 Tabla: `pet_friendly_places`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK |
| nombre | text | NOT NULL |
| categoria | pet_friendly_category (enum) | NOT NULL |
| lat | float8 | NOT NULL |
| lng | float8 | NOT NULL |
| descripcion | text | nullable |
| foto_url | text | nullable |
| fuente | text | DEFAULT 'usuario' NOT NULL |
| verificado | boolean | DEFAULT false NOT NULL |
| created_by | uuid | FK → profiles(id) ON DELETE SET NULL |
| created_at | timestamptz | NOT NULL |
| updated_at | timestamptz | NOT NULL |

**ENUM:** `pet_friendly_category` = ('cafeteria', 'bar_restaurante', 'hotel', 'experiencia')

**Índices:** idx_pf_categoria, idx_pf_coords

**RLS:** SELECT público, INSERT con WITH CHECK (true) — backend valida auth

### 7.15 Tabla: `user_follows`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| follower_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| following_id | uuid | FK → profiles(id) ON DELETE CASCADE NOT NULL |
| created_at | timestamptz | NOT NULL DEFAULT now() |
| — | — | UNIQUE(follower_id, following_id) |

**Índices:** idx_user_follows_follower, idx_user_follows_following

**Triggers:** trigger_follow_counts (AFTER INSERT/DELETE → actualiza contadores en profiles), trigger_notify_follower (AFTER INSERT → crea notificación de "new_follower")

**RLS:** SELECT/INSERT/DELETE con WITH CHECK (true) — backend usa service_role

### 7.16 Tabla: `notifications`
| Columna | Tipo | Constraints |
|---|---|---|
| id | uuid | PK, default gen_random_uuid() |
| user_id | uuid | FK → auth.users(id) ON DELETE CASCADE NOT NULL |
| type | text | NOT NULL, CHECK IN ('new_follower') |
| data | jsonb | NOT NULL DEFAULT '{}' |
| read_at | timestamptz | nullable |
| created_at | timestamptz | NOT NULL DEFAULT now() |

**Índices:** idx_notifications_user (user_id, created_at DESC), idx_notifications_unread (user_id) WHERE read_at IS NULL

**RLS:** SELECT/INSERT/UPDATE con WITH CHECK (true) — backend usa service_role

### Funciones y triggers globales

- `update_updated_at_column()` — Actualiza `updated_at = now()` en BEFORE UPDATE
- `handle_new_user()` — Auto-crea perfil al registrarse en auth.users
- `update_likes_count()` — Actualiza posts.likes_count en INSERT/DELETE de likes
- `update_comments_count()` — Actualiza posts.comments_count en INSERT/DELETE de comments

---

## 8. Estado actual por módulo

### 8.1 Auth

**Endpoints backend (8):**
- POST `/auth/register` ✅
- POST `/auth/login` ✅
- GET `/auth/me` ✅
- PUT `/auth/me` ✅
- PUT `/auth/password` ✅
- PUT `/auth/email` ✅
- POST `/auth/avatar` ✅
- DELETE `/auth/me` ✅

**Páginas/componentes frontend:**
- LoginPage ✅
- RegisterPage ✅
- ForgotPasswordPage ✅ (usa Supabase directo, no backend)
- ResetPasswordPage ✅ (usa Supabase directo, no backend)
- SettingsPage ✅ (perfil, avatar, email, password, logout, delete account)
- ProtectedRoute ✅
- AvatarUpload ✅
- authStore (Zustand) ✅

**¿Qué está completo?** El módulo Auth está **completo**. Registro, login, perfil, cambio de email, cambio de contraseña, avatar, y eliminación de cuenta están implementados tanto en backend como en frontend.

**¿Qué falta?** Nada crítico. Los endpoints de forgot-password y reset-password no existen en el backend (se usa Supabase Auth directamente desde el frontend).

### 8.2 Feed

**Endpoints backend (10):**
- GET `/feed` ✅
- GET `/feed/:post_id` ✅
- POST `/feed` ✅
- PUT `/feed/:post_id` ✅
- DELETE `/feed/:post_id` ✅
- POST `/feed/:post_id/like` ✅
- DELETE `/feed/:post_id/like` ✅
- GET `/feed/:post_id/comments` ✅
- POST `/feed/:post_id/comments` ✅
- DELETE `/feed/:post_id/comments/:comment_id` ✅

**Páginas/componentes frontend:**
- FeedPage ✅ (con stories de mascotas)
- PostCard ✅ (like, comentarios, editar, eliminar)
- CreatePostModal ✅
- CommentSection ✅

**¿Qué está completo?** El módulo Feed está **completo**. CRUD de posts, likes, y comentarios con UI completa.

**¿Qué falta?** Nada.

### 8.3 Pets

**Endpoints backend (14):**
- POST `/pets/upload-photo` ✅
- GET `/pets` ✅
- POST `/pets` ✅
- GET `/pets/:pet_id` ✅
- PUT `/pets/:pet_id` ✅
- DELETE `/pets/:pet_id` ✅
- GET `/pets/:pet_id/vet-visits` ✅
- POST `/pets/:pet_id/vet-visits` ✅
- PUT `/pets/:pet_id/vet-visits/:visit_id` ✅
- DELETE `/pets/:pet_id/vet-visits/:visit_id` ✅
- GET `/pets/:pet_id/events` ✅
- POST `/pets/:pet_id/events` ✅
- PUT `/pets/:pet_id/events/:event_id` ✅
- DELETE `/pets/:pet_id/events/:event_id` ✅

**Páginas/componentes frontend:**
- MyPetsPage ✅ (CRUD con subida de foto)
- PetDetailPage ✅ (visitas al veterinario + health tracking)

**¿Qué está completo?** El módulo Pets está **completo**. CRUD de mascotas, visitas al veterinario y eventos health tracking.

**¿Qué falta?** Nada.

### 8.4 Ranking

**Endpoints backend (1):**
- GET `/ranking` ✅

**Páginas/componentes frontend:**
- RankingPage ✅ (existe pero **no accesible** — la ruta `/ranking` redirige a `/pet-friendly`)

**¿Qué está completo?** El endpoint del backend funciona. La página de ranking existe pero está **deshabilitada en el router**. Se redirige a PetFriendly.

**¿Qué falta?** Restaurar la ruta en App.tsx si se desea mostrar el ranking.

### 8.5 Community / LostPets / Adoptions

**Endpoints backend (10):**
- LostPets: GET list, GET detail, POST, PUT, DELETE ✅
- Adoptions: GET list, GET detail, POST, PUT, DELETE ✅

**Páginas/componentes frontend:**
- LostPetsPage ✅ (con reporte, filtro, generador de carteles)
- LostPetDetailPage ✅ (con mapa readonly)
- AdoptionsPage ✅ (con filtro, publicación)
- LostPetPoster ✅ (cartel de búsqueda con html2canvas)
- MapLocationPicker ✅ (selector de ubicación con Leaflet)

**¿Qué está completo?** El módulo Community está **completo**.

**¿Qué falta?** Nada crítico.

### 8.6 InstaPet

**Endpoints backend (10):**
- InstaPet Posts: GET list, GET detail, POST, DELETE ✅
- Followers: GET list, POST follow, DELETE unfollow, GET /me/following ✅
- Milestones: GET list, POST ✅

**Páginas/componentes frontend:**
- InstaPetPage ✅ (perfil, posts, hitos, seguir)
- FollowingPage ✅ (lista de mascotas que sigo)

**¿Qué está completo?** El módulo InstaPet está **completo** en lo básico. Tiene posts, seguidores, y milestones.

**¿Qué falta?** No hay DELETE para milestones en el backend ni UI. Faltan likes/comentarios en posts de InstaPet (los campos existen en la tabla pero no hay endpoints).

### 8.7 PetFriendly

**Endpoints backend (2):**
- GET `/pet-friendly` ✅
- POST `/pet-friendly` ✅

**Páginas/componentes frontend:**
- PetFriendlyPage ✅ (mapa, listado, filtros, búsqueda, formulario para agregar)

**¿Qué está completo?** El módulo PetFriendly está **completo**.

**¿Qué falta?** No hay endpoints para actualizar o eliminar lugares pet-friendly.

### 8.8 Settings / Perfil

Integrado en el módulo Auth y cubierto en SettingsPage. Completo: perfil, avatar, email, contraseña, logout, eliminación de cuenta. Las notificaciones son placeholders ("Próximamente").

### 8.9 Social (Users + Notifications)

**Endpoints backend (9):**
- GET `/users/:userId` ✅
- GET `/users/:userId/posts` ✅
- GET `/users/:userId/followers` ✅
- GET `/users/:userId/following` ✅
- POST `/users/:userId/follow` ✅
- DELETE `/users/:userId/follow` ✅
- GET `/users?q=` ✅
- GET `/notifications` ✅
- PATCH `/notifications/read` ✅

**Páginas/componentes frontend:**
- UserProfilePage ✅ (perfil público, grid de posts, seguidores/seguidos modales)
- SearchUsersPage ✅ (búsqueda con debounce, sugerencias, FollowButton)
- FollowButton ✅ (botón seguir/dejar de seguir con estados)
- FollowersModal ✅ (lista de seguidores con FollowButton)
- FollowingModal ✅ (lista de seguidos con FollowButton)
- usersApi (client) ✅
- notificationsApi (client) ✅

**¿Qué está completo?** El módulo Social está **completo** con perfiles públicos, follow/unfollow, búsqueda de usuarios y notificaciones básicas (new_follower).

**¿Qué falta?** No hay UI de notificaciones en el frontend (campanita/badge). Solo existe el tipo `new_follower`; no hay notificaciones para likes, comentarios, etc. No hay endpoints DELETE/PUT para milestones de InstaPet.

---

## 9. Agentes OpenSpec

El proyecto usa OpenSpec para gestión de cambios. Agentes disponibles según `README.md` y `openspec/config.yaml`:

| Agente | Función |
|---|---|
| `orchestrator` | Coordina y delega tareas al resto de agentes |
| `db-agent` | Diseña schema PostgreSQL para Supabase |
| `openapi-agent` | Genera `docs/openapi.yaml` |
| `backend-agent` | Implementa backend (originalmente FastAPI, legacy) |
| `frontend-agent` | Implementa frontend React |
| `designer` | Define paleta de colores, tipografía, componentes UI |
| `documenter` | Genera documentación técnica y CHECKLIST |
| `tester` | Tests para backend (pytest) y frontend (vitest) |
| `reviewer` | Revisa código, detecta errores, sugiere mejoras |

**Flujo de trabajo OpenSpec:**
1. `/opsx-propose <nombre>` — Crear propuesta de cambio
2. `/opsx-apply` — Implementar tareas
3. `/opsx-archive` — Archivar cambio completado

**Skills disponibles en `.opencode/skills/`:**
- `openspec-propose` — Proponer nuevo cambio
- `openspec-apply-change` — Implementar tareas de un cambio
- `openspec-archive-change` — Archivar cambio completado
- `openspec-explore` — Modo exploración para investigar problemas

**Skills adicionales en `.agents/skills/`:**
- `brandkit` — Generación de brand-kit
- `design-taste-frontend` — UI/UX engineering
- `frontend-design` — Interfaces frontend con alta calidad de diseño
- `full-output-enforcement` — Evita truncamiento de output
- `gpt-taste` — UX/UI avanzado con GSAP
- `high-end-visual-design` — Diseño visual premium
- `image-to-code` — Conversión de imágenes de diseño a código
- `imagegen-frontend-mobile` — Generación de imágenes de diseño mobile
- `imagegen-frontend-web` — Generación de imágenes de diseño web
- `industrial-brutalist-ui` — Estilo brutalista industrial
- `minimalist-ui` — Estilo editorial minimalista
- `redesign-existing-projects` — Rediseño de proyectos existentes
- `stitch-design-taste` — Sistema de diseño semántico

El config de OpenSpec (`openspec/config.yaml`) define:
- Schema: `spec-driven`
- Stack backend documentado como FastAPI (desactualizado — ahora es Hono/Node)
- Paleta de colores: Primary `#D946EF`, Secondary `#F0ABFC`, Accent `#F59E0B`
- Convenciones: UUID PKs, timestamps, paginación, errores HTTP
- Nota crítica sobre RLS y supabase-py (aplica también a supabase-js con service_role)
