import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import { AuthConfig, initAuthConfig } from "@hono/auth-js";

import users from "./users";
import webProjects from "./web-projects";
import webTemplates from "./web-templates";
import subscriptions from "./subscriptions";
import leads from "./leads";
import payments from "./payments";
import promotionalBanners from "./promotional-banners";
import templateReviews from "./template-reviews";
import htmlTemplates from "./html-templates";
import categories from "./categories";
import subcategories from "./subcategories";
import migrate from "./migrate";
import migrateThumbnails from "./migrate-thumbnails";

import authConfig from "@/auth.config";

// Revert to "edge" if planning on running on the edge
export const runtime = "nodejs";

function getAuthConfig(c: Context): AuthConfig {
  return {
    secret: process.env.AUTH_SECRET,
    ...authConfig
  };
};

const app = new Hono().basePath("/api");

app.use("*", initAuthConfig(getAuthConfig));

const routes = app
  .route("/users", users)
  .route("/web-projects", webProjects)
  .route("/web-templates", webTemplates)
  .route("/subscriptions", subscriptions)
  .route("/leads", leads)
  .route("/payments", payments)
  .route("/promotional-banners", promotionalBanners)
  .route("/template-reviews", templateReviews)
  .route("/html-templates", htmlTemplates)
  .route("/categories", categories)
  .route("/subcategories", subcategories)
  .route("/migrate", migrate)
  .route("/migrate-thumbnails", migrateThumbnails);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
