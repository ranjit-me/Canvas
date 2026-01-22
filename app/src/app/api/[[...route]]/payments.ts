import { z } from "zod";
import { Hono } from "hono";
import Razorpay from "razorpay";
import crypto from "crypto";
import { verifyAuth } from "@hono/auth-js";
import { zValidator } from "@hono/zod-validator";
import { eq, and } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { webProjects } from "@/db/schema";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRATE!,
});

const app = new Hono()
    .post(
        "/create-order",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                amount: z.number(),
                currency: z.string().default("INR"),
                projectId: z.string(),
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { amount, currency, projectId } = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                const options = {
                    amount: amount * 100, // razorpay expects amount in paise
                    currency,
                    receipt: `rcpt_${projectId.slice(0, 30)}`,
                };

                const order = await razorpay.orders.create(options);

                await db
                    .update(webProjects)
                    .set({
                        razorpayOrderId: order.id,
                        pricePaid: amount,
                    })
                    .where(
                        and(
                            eq(webProjects.id, projectId),
                            eq(webProjects.userId, auth.token.id)
                        )
                    );

                return c.json({ data: order });
            } catch (error) {
                console.error("RAZORPAY_ORDER_ERROR", error);
                return c.json({ error: "Failed to create order" }, 500);
            }
        }
    )
    .post(
        "/verify",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                razorpay_order_id: z.string(),
                razorpay_payment_id: z.string(),
                razorpay_signature: z.string(),
                projectId: z.string(),
            }),
        ),
        async (c) => {
            const auth = c.get("authUser");
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, projectId } = c.req.valid("json");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac("sha256", process.env.RAZORPAY_KEY_SECRATE!)
                .update(body.toString())
                .digest("hex");

            const isAuthentic = expectedSignature === razorpay_signature;

            if (isAuthentic) {
                const data = await db
                    .update(webProjects)
                    .set({
                        paymentStatus: "paid",
                        razorpayPaymentId: razorpay_payment_id,
                        purchasedAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .where(
                        and(
                            eq(webProjects.id, projectId),
                            eq(webProjects.userId, auth.token.id)
                        )
                    )
                    .returning();

                if (data.length === 0) {
                    return c.json({ error: "Project not found or unauthorized" }, 404);
                }

                return c.json({ data: data[0] });
            } else {
                return c.json({ error: "Invalid signature" }, 400);
            }
        }
    );

export default app;
