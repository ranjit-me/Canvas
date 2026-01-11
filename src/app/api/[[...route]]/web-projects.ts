import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc, ne } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { v4 as uuid } from "uuid";

import { db } from "@/db/drizzle";
import { webProjects, webTemplates, webProjectsInsertSchema, users } from "@/db/schema";

const app = new Hono()
    .get(
        "/public/:slug",
        zValidator("param", z.object({ slug: z.string() })),
        async (c) => {
            const { slug } = c.req.valid("param");

            // First, try to find in webProjects
            const webProject = await db
                .select({
                    project: webProjects,
                    ownerLanguage: users.templateLanguage
                })
                .from(webProjects)
                .leftJoin(users, eq(webProjects.userId, users.id))
                .where(
                    and(
                        eq(webProjects.slug, slug),
                        eq(webProjects.isPublished, true)
                    )
                );

            if (webProject.length > 0) {
                return c.json({
                    data: webProject[0].project,
                    type: "react",
                    templateLanguage: webProject[0].ownerLanguage
                });
            }

            // If not found in webProjects, try htmlTemplates
            const { htmlTemplates } = await import("@/db/schema");
            const htmlTemplate = await db
                .select({
                    template: htmlTemplates,
                    ownerLanguage: users.templateLanguage
                })
                .from(htmlTemplates)
                .leftJoin(users, eq(htmlTemplates.creatorId, users.id))
                .where(
                    and(
                        eq(htmlTemplates.slug, slug),
                        eq(htmlTemplates.isPublished, true),
                        eq(htmlTemplates.status, "approved")
                    )
                );

            if (htmlTemplate.length > 0) {
                return c.json({
                    data: htmlTemplate[0].template,
                    type: "html",
                    templateLanguage: htmlTemplate[0].ownerLanguage
                });
            }

            return c.json({ error: "Not found" }, 404);
        }
    )
    .get(
        "/",
        verifyAuth(),
        zValidator(
            "query",
            z.object({
                page: z.coerce.number(),
                limit: z.coerce.number(),
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { page, limit } = c.req.valid("query");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .select()
                .from(webProjects)
                .where(
                    and(
                        eq(webProjects.userId, auth.token.id),
                        eq(webProjects.paymentStatus, "paid")
                    )
                )
                .limit(limit)
                .offset((page - 1) * limit)
                .orderBy(desc(webProjects.updatedAt))

            return c.json({
                data,
                nextPage: data.length === limit ? page + 1 : null,
            });
        },
    )
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            webProjectsInsertSchema.pick({
                name: true,
                json: true,
                templateId: true,
                thumbnailUrl: true,
                slug: true,
                isPublished: true,
                country: true,
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { name, json, templateId, thumbnailUrl, slug, isPublished, country } = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            if (slug) {
                const existingSlug = await db
                    .select()
                    .from(webProjects)
                    .where(eq(webProjects.slug, slug))
                    .limit(1);

                if (existingSlug.length > 0) {
                    return c.json({ error: "Slug already taken" }, 400);
                }
            }

            const data = await db
                .insert(webProjects)
                .values({
                    id: uuid(),
                    name,
                    json,
                    templateId,
                    thumbnailUrl,
                    slug,
                    isPublished,
                    country,
                    userId: auth.token.id,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                })
                .returning();

            if (!data[0]) {
                return c.json({ error: "Something went wrong" }, 400);
            }

            return c.json({ data: data[0] });
        },
    )
    .patch(
        "/:id",
        verifyAuth(),
        zValidator(
            "param",
            z.object({ id: z.string() }),
        ),
        zValidator(
            "json",
            webProjectsInsertSchema
                .omit({
                    id: true,
                    userId: true,
                    createdAt: true,
                    updatedAt: true,
                })
                .extend({
                    slug: z.string().optional(),
                    isPublished: z.boolean().optional(),
                    country: z.string().optional(),
                })
                .partial()
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");
            const values = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            if (values.slug) {
                const existingSlug = await db
                    .select()
                    .from(webProjects)
                    .where(
                        and(
                            eq(webProjects.slug, values.slug),
                            ne(webProjects.id, id)
                        )
                    )
                    .limit(1);

                if (existingSlug.length > 0) {
                    return c.json({ error: "Slug already taken. Please choose another one." }, 400);
                }
            }

            const data = await db
                .update(webProjects)
                .set({
                    ...values,
                    updatedAt: new Date(),
                })
                .where(
                    and(
                        eq(webProjects.id, id),
                        eq(webProjects.userId, auth.token.id),
                    ),
                )
                .returning();

            if (data.length === 0) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            return c.json({ data: data[0] });
        },
    )
    .get(
        "/:id",
        verifyAuth(),
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const [project] = await db
                .select({
                    id: webProjects.id,
                    name: webProjects.name,
                    json: webProjects.json,
                    templateId: webProjects.templateId,
                    thumbnailUrl: webProjects.thumbnailUrl,
                    slug: webProjects.slug,
                    isPublished: webProjects.isPublished,
                    country: webProjects.country,
                    paymentStatus: webProjects.paymentStatus,
                    pricePaid: webProjects.pricePaid,
                    templatePrice: webTemplates.price,
                })
                .from(webProjects)
                .leftJoin(webTemplates, eq(webProjects.templateId, webTemplates.id))
                .where(
                    and(
                        eq(webProjects.id, id),
                        eq(webProjects.userId, auth.token.id)
                    )
                );

            if (!project) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data: project });
        },
    )
    .delete(
        "/:id",
        verifyAuth(),
        zValidator("param", z.object({ id: z.string() })),
        async (c) => {
            const auth = c.get("authUser");
            const { id } = c.req.valid("param");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const data = await db
                .delete(webProjects)
                .where(
                    and(
                        eq(webProjects.id, id),
                        eq(webProjects.userId, auth.token.id),
                    ),
                )
                .returning();

            if (data.length === 0) {
                return c.json({ error: "Not found" }, 404);
            }

            return c.json({ data: { id } });
        },
    );

export default app;
