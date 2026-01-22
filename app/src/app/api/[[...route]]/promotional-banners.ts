import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { eq, desc, and } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { promotionalBanners, promotionalBannersInsertSchema } from "@/db/schema";

const app = new Hono()
    .get("/", async (c) => {
        try {
            const data = await db
                .select()
                .from(promotionalBanners)
                .orderBy(desc(promotionalBanners.displayOrder));

            return c.json({ data });
        } catch (error) {
            return c.json({ error: "Failed to fetch banners" }, 500);
        }
    })
    .post(
        "/",
        zValidator(
            "json",
            promotionalBannersInsertSchema.omit({
                id: true,
                createdAt: true,
                updatedAt: true,
            })
        ),
        async (c) => {
            try {
                const values = c.req.valid("json");

                const id = crypto.randomUUID();
                const now = new Date();

                const [data] = await db
                    .insert(promotionalBanners)
                    .values({
                        ...values,
                        id,
                        createdAt: now,
                        updatedAt: now,
                    })
                    .returning();

                return c.json({ data });
            } catch (error) {
                return c.json({ error: "Failed to create banner" }, 500);
            }
        }
    )
    .patch(
        "/:id",
        zValidator(
            "json",
            promotionalBannersInsertSchema.partial().omit({
                id: true,
                createdAt: true,
            })
        ),
        async (c) => {
            try {
                const { id } = c.req.param();
                const values = c.req.valid("json");

                const [data] = await db
                    .update(promotionalBanners)
                    .set({
                        ...values,
                        updatedAt: new Date(),
                    })
                    .where(eq(promotionalBanners.id, id))
                    .returning();

                if (!data) {
                    return c.json({ error: "Banner not found" }, 404);
                }

                return c.json({ data });
            } catch (error) {
                return c.json({ error: "Failed to update banner" }, 500);
            }
        }
    )
    .delete("/:id", async (c) => {
        try {
            const { id } = c.req.param();

            const [data] = await db
                .delete(promotionalBanners)
                .where(eq(promotionalBanners.id, id))
                .returning();

            if (!data) {
                return c.json({ error: "Banner not found" }, 404);
            }

            return c.json({ data });
        } catch (error) {
            return c.json({ error: "Failed to delete banner" }, 500);
        }
    });

export default app;
