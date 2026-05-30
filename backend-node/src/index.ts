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

app.get("/", (c) => c.json({ message: "PetConnect API is running" }));

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`  PetConnect API v0.1.0`);
  console.log(`  URL:  http://localhost:${info.port}`);
  console.log(`  CORS: ${FRONTEND_ORIGIN}`);
  console.log(`  Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
});
