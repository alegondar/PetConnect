import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRoutes } from "./routes/auth.js";
import { petsRoutes } from "./routes/pets.js";
import { feedRoutes } from "./routes/feed.js";
import { rankingRoutes } from "./routes/ranking.js";
import { communityRoutes } from "./routes/community.js";
import { instapetRoutes } from "./routes/instapet.js";
import { petfriendlyRoutes } from "./routes/petfriendly.js";
import { usersRoutes } from "./routes/users.js";
import { notificationsRoutes } from "./routes/notifications.js";
import { servicesRoutes } from "./routes/services.js";
import { veterinariasRoutes } from "./routes/veterinarias.js";

export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_KEY: string;
  FRONTEND_ORIGIN: string;
};

const app = new Hono<{ Bindings: Bindings; Variables: { userId: string } }>();

app.use(logger());
app.use("*", async (c, next) => {
  const origin = c.env.FRONTEND_ORIGIN || "http://localhost:5173";
  return cors({
    origin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })(c, next);
});

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
app.route("/api/v1", servicesRoutes);
app.route("/api/v1", veterinariasRoutes);

app.get("/", (c) => c.json({ message: "PetConnect API is running" }));

export default app;
