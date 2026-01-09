import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { htmlTemplates, templateAssets, templateCustomizations } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { translationService } from "@/lib/translation-service";

const app = new Hono()
    // Get all HTML templates (with optional filters)
    .get("/", async (c) => {
        try {
            const status = c.req.query("status"); // draft, pending, approved, rejected
            const category = c.req.query("category");
            const creatorId = c.req.query("creatorId");
            const isActive = c.req.query("isActive");

            let conditions = [];

            if (status) {
                conditions.push(eq(htmlTemplates.status, status));
            }
            if (category) {
                conditions.push(eq(htmlTemplates.category, category));
            }
            if (creatorId) {
                conditions.push(eq(htmlTemplates.creatorId, creatorId));
            }
            if (isActive !== undefined) {
                conditions.push(eq(htmlTemplates.isActive, isActive === "true"));
            }

            const templates = await db
                .select()
                .from(htmlTemplates)
                .where(conditions.length > 0 ? and(...conditions) : undefined)
                .orderBy(desc(htmlTemplates.createdAt));

            return c.json({ templates });
        } catch (error) {
            console.error("Error fetching HTML templates:", error);
            return c.json({ error: "Failed to fetch templates" }, 500);
        }
    })

    // Get single HTML template by ID
    .get("/:id", async (c) => {
        try {
            const { id } = c.req.param();

            const template = await db.query.htmlTemplates.findFirst({
                where: eq(htmlTemplates.id, id),
                with: {
                    creator: {
                        columns: {
                            id: true,
                            name: true,
                            email: true,
                            image: true,
                        },
                    },
                    assets: true,
                },
            });

            if (!template) {
                return c.json({ error: "Template not found" }, 404);
            }

            return c.json({ template });
        } catch (error) {
            console.error("Error fetching template:", error);
            return c.json({ error: "Failed to fetch template" }, 500);
        }
    })

    // Create new HTML template
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                id: z.string(),
                name: z.string().min(1),
                description: z.string().optional(),
                htmlCode: z.string().min(1),
                cssCode: z.string().optional(),
                jsCode: z.string().optional(),
                category: z.string(),
                categoryId: z.string().optional(),
                subcategoryId: z.string().optional(),
                thumbnail: z.string().optional(),
                price: z.number().optional(),
                isFree: z.boolean().optional(),
                editableFields: z.string().optional(), // JSON string
                slug: z.string().optional(),
                isPublished: z.boolean().optional(),
            })
        ),
        async (c) => {
            try {
                const auth = c.get("authUser");
                if (!auth.token?.id) {
                    return c.json({ error: "Unauthorized" }, 401);
                }

                const data = c.req.valid("json");

                // AUTO-TRANSLATE: Extract and translate template content to all languages
                let translations = null;
                try {
                    const translationResult = await translationService.translateTemplate(data.htmlCode);
                    translations = JSON.stringify(translationResult);
                    console.log('✅ Template auto-translated to 14 languages');
                } catch (error) {
                    console.error('Translation failed, template will be saved without translations:', error);
                }

                const newTemplate = await db
                    .insert(htmlTemplates)
                    .values({
                        ...data,
                        creatorId: auth.token.id,
                        status: "draft",
                        isActive: false,
                        translations, // Store translations
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                return c.json({ template: newTemplate[0] }, 201);
            } catch (error) {
                console.error("Error creating template:", error);
                return c.json({ error: "Failed to create template" }, 500);
            }
        }
    )

    // Update HTML template
    .patch(
        "/:id",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                htmlCode: z.string().optional(),
                cssCode: z.string().optional(),
                jsCode: z.string().optional(),
                category: z.string().optional(),
                categoryId: z.string().optional(),
                subcategoryId: z.string().optional(),
                thumbnail: z.string().optional(),
                price: z.number().optional(),
                pricingByCountry: z.string().optional(),
                isFree: z.boolean().optional(),
                isActive: z.boolean().optional(),
                status: z.string().optional(),
                editableFields: z.string().optional(),
                slug: z.string().optional(),
                isPublished: z.boolean().optional(),
            })
        ),
        async (c) => {
            try {
                const auth = c.get("authUser");
                const { id } = c.req.param();
                const data = c.req.valid("json");

                // Check if template exists and user owns it (or is admin)
                const existing = await db.query.htmlTemplates.findFirst({
                    where: eq(htmlTemplates.id, id),
                });

                if (!existing) {
                    return c.json({ error: "Template not found" }, 404);
                }

                // Only allow creator or admin to update
                if (existing.creatorId !== auth.token?.id) {
                    return c.json({ error: "Unauthorized" }, 401);
                }

                // If updating slug, check for duplicates
                if (data.slug && data.slug !== existing.slug) {
                    const slugExists = await db.query.htmlTemplates.findFirst({
                        where: eq(htmlTemplates.slug, data.slug),
                    });
                    if (slugExists) {
                        return c.json({ error: "Slug already taken. Please choose another one." }, 400);
                    }
                }

                const updated = await db
                    .update(htmlTemplates)
                    .set({
                        ...data,
                        updatedAt: new Date(),
                    })
                    .where(eq(htmlTemplates.id, id))
                    .returning();

                return c.json({ template: updated[0] });
            } catch (error) {
                console.error("Error updating template:", error);
                return c.json({ error: "Failed to update template" }, 500);
            }
        }
    )

    // Delete HTML template
    .delete("/:id", verifyAuth(), async (c) => {
        try {
            const auth = c.get("authUser");
            const { id } = c.req.param();

            const existing = await db.query.htmlTemplates.findFirst({
                where: eq(htmlTemplates.id, id),
            });

            if (!existing) {
                return c.json({ error: "Template not found" }, 404);
            }

            if (existing.creatorId !== auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            await db.delete(htmlTemplates).where(eq(htmlTemplates.id, id));

            return c.json({ success: true });
        } catch (error) {
            console.error("Error deleting template:", error);
            return c.json({ error: "Failed to delete template" }, 500);
        }
    })

    // Publish template (submit for approval)
    .post("/:id/publish", verifyAuth(), async (c) => {
        try {
            const auth = c.get("authUser");
            const { id } = c.req.param();

            const existing = await db.query.htmlTemplates.findFirst({
                where: eq(htmlTemplates.id, id),
            });

            if (!existing) {
                return c.json({ error: "Template not found" }, 404);
            }

            if (existing.creatorId !== auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            // AUTO-TRANSLATE: If no translations exist, generate them now
            let translations = existing.translations;
            if (!translations) {
                try {
                    const translationResult = await translationService.translateTemplate(existing.htmlCode);
                    translations = JSON.stringify(translationResult);
                    console.log('✅ Template auto-translated on publish');
                } catch (error) {
                    console.error('Translation failed on publish:', error);
                }
            }

            const updated = await db
                .update(htmlTemplates)
                .set({
                    status: "pending",
                    translations, // Update translations if generated
                    updatedAt: new Date(),
                })
                .where(eq(htmlTemplates.id, id))
                .returning();

            return c.json({ template: updated[0] });
        } catch (error) {
            console.error("Error publishing template:", error);
            return c.json({ error: "Failed to publish template" }, 500);
        }
    })

    // Admin: Approve template
    .post("/:id/approve", verifyAuth(), async (c) => {
        try {
            const { id } = c.req.param();

            // TODO: Add admin check here

            const updated = await db
                .update(htmlTemplates)
                .set({
                    status: "approved",
                    isActive: true,
                    updatedAt: new Date(),
                })
                .where(eq(htmlTemplates.id, id))
                .returning();

            return c.json({ template: updated[0] });
        } catch (error) {
            console.error("Error approving template:", error);
            return c.json({ error: "Failed to approve template" }, 500);
        }
    })

    // Admin: Reject template
    .post("/:id/reject", verifyAuth(), async (c) => {
        try {
            const { id } = c.req.param();

            // TODO: Add admin check here

            const updated = await db
                .update(htmlTemplates)
                .set({
                    status: "rejected",
                    isActive: false,
                    updatedAt: new Date(),
                })
                .where(eq(htmlTemplates.id, id))
                .returning();

            return c.json({ template: updated[0] });
        } catch (error) {
            console.error("Error rejecting template:", error);
            return c.json({ error: "Failed to reject template" }, 500);
        }
    })

    // Get HTML template by slug (public endpoint)
    .get("/public/:slug", async (c) => {
        try {
            const { slug } = c.req.param();

            const template = await db.query.htmlTemplates.findFirst({
                where: and(
                    eq(htmlTemplates.slug, slug),
                    eq(htmlTemplates.isPublished, true),
                    eq(htmlTemplates.status, "approved")
                ),
            });

            if (!template) {
                return c.json({ error: "Template not found or not published" }, 404);
            }

            return c.json({ data: template, type: "html" });
        } catch (error) {
            console.error("Error fetching public template:", error);
            return c.json({ error: "Failed to fetch template" }, 500);
        }
    });

export default app;
