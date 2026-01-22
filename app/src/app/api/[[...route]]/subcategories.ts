import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { subcategories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const app = new Hono()
    // Create a new subcategory (admin only)
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                categoryId: z.string().min(1),
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

                const { categoryId, name, description, icon, displayOrder } = c.req.valid("json");

                const id = `${categoryId}-${name.toLowerCase().replace(/\s+/g, "-")}`;
                const now = new Date();

                const [newSubcategory] = await db
                    .insert(subcategories)
                    .values({
                        id,
                        categoryId,
                        name,
                        description,
                        icon,
                        displayOrder: displayOrder ?? 0,
                        createdAt: now,
                        updatedAt: now,
                    })
                    .returning();

                return c.json({ data: newSubcategory });
            } catch (error) {
                console.error("Error creating subcategory:", error);
                return c.json({ error: "Failed to create subcategory" }, 500);
            }
        }
    )
    // Update a subcategory (admin only)
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

                const [updatedSubcategory] = await db
                    .update(subcategories)
                    .set({
                        ...updates,
                        updatedAt: new Date(),
                    })
                    .where(eq(subcategories.id, id))
                    .returning();

                if (!updatedSubcategory) {
                    return c.json({ error: "Subcategory not found" }, 404);
                }

                return c.json({ data: updatedSubcategory });
            } catch (error) {
                console.error("Error updating subcategory:", error);
                return c.json({ error: "Failed to update subcategory" }, 500);
            }
        }
    )
    // Delete a subcategory (admin only)
    .delete("/:id", verifyAuth(), async (c) => {
        try {
            const auth = c.get("authUser");
            if (!auth.session?.user) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const id = c.req.param("id");

            await db.delete(subcategories).where(eq(subcategories.id, id));

            return c.json({ success: true });
        } catch (error) {
            console.error("Error deleting subcategory:", error);
            return c.json({ error: "Failed to delete subcategory" }, 500);
        }
    });

export default app;
