import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { templateReviews } from "@/db/schema";
import { zValidator } from "@hono/zod-validator";
import { verifyAuth } from "@hono/auth-js";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";

const app = new Hono()
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                templateId: z.string(),
                rating: z.number().min(1).max(5),
                reviewText: z.string().optional(),
            })
        ),
        async (c) => {
            const { templateId, rating, reviewText } = c.req.valid("json");
            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                // Check if user already has a review for this template
                const existingReview = await db
                    .select()
                    .from(templateReviews)
                    .where(
                        sql`${templateReviews.userId} = ${auth.token.id} AND ${templateReviews.templateId} = ${templateId}`
                    )
                    .limit(1);

                if (existingReview.length > 0) {
                    return c.json(
                        {
                            error: "You have already reviewed this template",
                            existingReview: existingReview[0],
                        },
                        409
                    );
                }

                const review = await db
                    .insert(templateReviews)
                    .values({
                        id: crypto.randomUUID(),
                        templateId,
                        userId: auth.token.id,
                        userName: auth.token.name || "Anonymous",
                        userEmail: auth.token.email || "",
                        rating,
                        reviewText: reviewText || null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    })
                    .returning();

                return c.json(review[0], 201);
            } catch (error) {
                console.error("Error creating review:", error);
                return c.json({ error: "Failed to create review" }, 500);
            }
        }
    )
    .get("/:templateId", async (c) => {
        const { templateId } = c.req.param();
        const limit = parseInt(c.req.query("limit") || "10");
        const offset = parseInt(c.req.query("offset") || "0");

        try {
            // Fetch reviews with pagination
            const reviews = await db
                .select()
                .from(templateReviews)
                .where(eq(templateReviews.templateId, templateId))
                .orderBy(sql`${templateReviews.createdAt} DESC`)
                .limit(limit)
                .offset(offset);

            // Calculate average rating and total count
            const stats = await db
                .select({
                    averageRating: sql<number>`AVG(${templateReviews.rating})`,
                    totalReviews: sql<number>`COUNT(*)`,
                })
                .from(templateReviews)
                .where(eq(templateReviews.templateId, templateId));

            return c.json({
                reviews,
                averageRating: stats[0]?.averageRating
                    ? parseFloat(parseFloat(stats[0].averageRating.toString()).toFixed(1))
                    : 0,
                totalReviews: parseInt(stats[0]?.totalReviews?.toString() || "0"),
            });
        } catch (error) {
            console.error("Error fetching reviews:", error);
            return c.json({ error: "Failed to fetch reviews" }, 500);
        }
    })
    .put(
        "/:reviewId",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                rating: z.number().min(1).max(5).optional(),
                reviewText: z.string().optional(),
            })
        ),
        async (c) => {
            const { reviewId } = c.req.param();
            const { rating, reviewText } = c.req.valid("json");
            const auth = c.get("authUser");

            if (!auth.token?.id) {
                return c.json({ error: "Unauthorized" }, 401);
            }

            try {
                // Check if review exists and user owns it
                const existingReview = await db
                    .select()
                    .from(templateReviews)
                    .where(eq(templateReviews.id, reviewId))
                    .limit(1);

                if (existingReview.length === 0) {
                    return c.json({ error: "Review not found" }, 404);
                }

                if (existingReview[0].userId !== auth.token.id) {
                    return c.json({ error: "You can only edit your own reviews" }, 403);
                }

                // Update the review
                const updatedReview = await db
                    .update(templateReviews)
                    .set({
                        rating: rating ?? existingReview[0].rating,
                        reviewText: reviewText ?? existingReview[0].reviewText,
                        updatedAt: new Date(),
                    })
                    .where(eq(templateReviews.id, reviewId))
                    .returning();

                return c.json(updatedReview[0]);
            } catch (error) {
                console.error("Error updating review:", error);
                return c.json({ error: "Failed to update review" }, 500);
            }
        }
    )
    .delete("/:reviewId", verifyAuth(), async (c) => {
        const { reviewId } = c.req.param();
        const auth = c.get("authUser");

        if (!auth.token?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        try {
            // Check if review exists and user owns it
            const existingReview = await db
                .select()
                .from(templateReviews)
                .where(eq(templateReviews.id, reviewId))
                .limit(1);

            if (existingReview.length === 0) {
                return c.json({ error: "Review not found" }, 404);
            }

            if (existingReview[0].userId !== auth.token.id) {
                return c.json({ error: "You can only delete your own reviews" }, 403);
            }

            // Delete the review
            await db
                .delete(templateReviews)
                .where(eq(templateReviews.id, reviewId));

            return c.json({ message: "Review deleted successfully" }, 200);
        } catch (error) {
            console.error("Error deleting review:", error);
            return c.json({ error: "Failed to delete review" }, 500);
        }
    });

export default app;
