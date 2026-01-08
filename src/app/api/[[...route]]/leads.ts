import { z } from "zod";
import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";

import { v4 as uuid } from "uuid";

import { db } from "@/db/drizzle";
import { userLeads, userLeadsInsertSchema } from "@/db/schema";

const app = new Hono()
    .get(
        "/",
        verifyAuth(),
        async (c) => {
            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const [data] = await db
                    .select()
                    .from(userLeads)
                    .where(eq(userLeads.userId, auth.token.id));

                return c.json({ data: data || null });
            } catch (error) {
                console.error("GET /api/leads error:", error);
                return c.json({ error: "Internal Server Error" }, 500);
            }
        }
    )
    .get(
        "/all",
        async (c) => {
            // Admin endpoint to fetch all leads
            try {
                const data = await db
                    .select()
                    .from(userLeads)
                    .orderBy(userLeads.createdAt);

                return c.json({ data });
            } catch (error) {
                console.error("GET /api/leads/all error:", error);
                return c.json({ error: "Internal Server Error" }, 500);
            }
        }
    )
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            userLeadsInsertSchema.pick({
                name: true,
                email: true,
                mobile: true,
                whatsapp: true,
                country: true,
                state: true,
                interests: true,
            })
        ),
        async (c) => {
            const auth = c.get("authUser");
            const values = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const [existing] = await db
                    .select()
                    .from(userLeads)
                    .where(eq(userLeads.userId, auth.token.id));

                if (existing) {
                    const [data] = await db
                        .update(userLeads)
                        .set({
                            ...values,
                            updatedAt: new Date(),
                        })
                        .where(eq(userLeads.id, existing.id))
                        .returning();

                    return c.json({ data });
                }

                const [data] = await db
                    .insert(userLeads)
                    .values({
                        id: uuid(),
                        userId: auth.token.id,
                        ...values,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                return c.json({ data });
            } catch (error) {
                console.error("POST /api/leads error:", error);
                return c.json({ error: "Internal Server Error" }, 500);
            }
        }
    )
    .delete(
        "/:id",
        async (c) => {
            const { id } = c.req.param();

            try {
                const [data] = await db
                    .delete(userLeads)
                    .where(eq(userLeads.id, id))
                    .returning();

                if (!data) {
                    return c.json({ error: "Lead not found" }, 404);
                }

                return c.json({ data });
            } catch (error) {
                console.error("DELETE /api/leads/:id error:", error);
                return c.json({ error: "Internal Server Error" }, 500);
            }
        }
    );

export default app;
