import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { categories, subcategories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
    // Get all categories with their subcategories
    .get("/", async (c) => {
        try {
            const data = await db.query.categories.findMany({
                with: {
                    subcategories: {
                        orderBy: (subcategories, { asc }) => [asc(subcategories.displayOrder)],
                    },
                },
                orderBy: (categories, { asc }) => [asc(categories.displayOrder)],
            });

            return c.json({ data });
        } catch (error) {
            console.error("Error fetching categories:", error);
            return c.json({ error: "Failed to fetch categories" }, 500);
        }
    })
    // Create a new category (admin only)
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                name: z.string().min(1),
                description: z.string().optional(),
                icon: z.string().optional(),
                displayOrder: z.number().optional(),
            })
        ),
        async (c) => {
            try {
                const auth = c.get("authUser");
                if (!auth.session?.user) {
                    return c.json({ error: "Unauthorized" }, 401);
                }

                const { name, description, icon, displayOrder } = c.req.valid("json");

                const id = name.toLowerCase().replace(/\s+/g, "-");
                const now = new Date();

                const [newCategory] = await db
                    .insert(categories)
                    .values({
                        id,
                        name,
                        description,
                        icon,
                        displayOrder: displayOrder ?? 0,
                        createdAt: now,
                        updatedAt: now,
                    })
                    .returning();

                return c.json({ data: newCategory });
            } catch (error) {
                console.error("Error creating category:", error);
                return c.json({ error: "Failed to create category" }, 500);
            }
        }
    )
    // Update a category (admin only)
    .put(
        "/:id",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                name: z.string().min(1).optional(),
                description: z.string().optional(),
                icon: z.string().optional(),
                displayOrder: z.number().optional(),
            })
        ),
        async (c) => {
            try {
                const auth = c.get("authUser");
                if (!auth.session?.user) {
                    return c.json({ error: "Unauthorized" }, 401);
                }

                const id = c.req.param("id");
                const updates = c.req.valid("json");

                const [updatedCategory] = await db
                    .update(categories)
                    .set({
                        ...updates,
                        updatedAt: new Date(),
                    })
                    .where(eq(categories.id, id))
                    .returning();

                if (!updatedCategory) {
                    return c.json({ error: "Category not found" }, 404);
                }

                return c.json({ data: updatedCategory });
            } catch (error) {
                console.error("Error updating category:", error);
                return c.json({ error: "Failed to update category" }, 500);
            }
        }
    )
    // Delete a category (admin only)
    .delete("/:id", verifyAuth(), async (c) => {
        try {
            const auth = c.get("authUser");
            if (!auth.session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const id = c.req.param("id");

            await db.delete(categories).where(eq(categories.id, id));

            return c.json({ success: true });
        } catch (error) {
            console.error("Error deleting category:", error);
            return c.json({ error: "Failed to delete category" }, 500);
        }
    });

export default app;
