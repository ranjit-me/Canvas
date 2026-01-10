import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/db/drizzle";
import { creatorApplications, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

import { verifyAuth } from "@hono/auth-js";

const app = new Hono()
    // Submit creator application
    .post(
        "/",
        verifyAuth(),
        zValidator(
            "json",
            z.object({
                fullName: z.string(),
                email: z.string().email(),
                mobile: z.string().length(10),
                country: z.string(),
                state: z.string(),
                qualification: z.string(),
                portfolioUrl: z.string().optional(),
                bio: z.string().optional(),
                specialization: z.string().optional(),
                resumeUrl: z.string().optional(), // Will be uploaded separately
                profilePhotoUrl: z.string().optional(), // Will be uploaded separately
            })
        ),
        async (c) => {
            try {
                const data = c.req.valid("json");
                const auth = c.get("authUser");

                if (!auth.token?.id) {
                    return c.json({ error: "Unauthorized" }, 401);
                }

                const userId = auth.token.id;

                // Check if user already applied
                const existingApplication = await db
                    .select()
                    .from(creatorApplications)
                    .where(eq(creatorApplications.userId, userId));

                if (existingApplication.length > 0) {
                    return c.json({ error: "Application already submitted" }, 400);
                }

                // Create application
                const [application] = await db
                    .insert(creatorApplications)
                    .values({
                        userId: userId,
                        fullName: data.fullName,
                        email: data.email,
                        mobile: data.mobile,
                        country: data.country,
                        state: data.state,
                        qualification: data.qualification,
                        portfolioUrl: data.portfolioUrl,
                        bio: data.bio,
                        specialization: data.specialization,
                        resumeUrl: data.resumeUrl || "",
                        profilePhotoUrl: data.profilePhotoUrl || "",
                        status: "pending",
                        submittedAt: new Date(),
                    })
                    .returning();

                // Update user's creatorStatus
                await db
                    .update(users)
                    .set({ creatorStatus: "pending" })
                    .where(eq(users.id, userId));

                return c.json({ application });
            } catch (error) {
                console.error("Error submitting application:", error);
                return c.json({ error: "Failed to submit application" }, 500);
            }
        }
    )
    // Get all applications (admin only)
    .get("/", async (c) => {
        try {
            const applications = await db
                .select({
                    id: creatorApplications.id,
                    userId: creatorApplications.userId,
                    fullName: creatorApplications.fullName,
                    email: creatorApplications.email,
                    mobile: creatorApplications.mobile,
                    country: creatorApplications.country,
                    state: creatorApplications.state,
                    qualification: creatorApplications.qualification,
                    portfolioUrl: creatorApplications.portfolioUrl,
                    bio: creatorApplications.bio,
                    specialization: creatorApplications.specialization,
                    resumeUrl: creatorApplications.resumeUrl,
                    profilePhotoUrl: creatorApplications.profilePhotoUrl,
                    status: creatorApplications.status,
                    adminNotes: creatorApplications.adminNotes,
                    submittedAt: creatorApplications.submittedAt,
                    reviewedAt: creatorApplications.reviewedAt,
                })
                .from(creatorApplications)
                .orderBy(desc(creatorApplications.submittedAt));

            return c.json({ applications });
        } catch (error: any) {
            console.error("Error fetching applications:", error);
            return c.json({ error: "Failed to fetch applications", details: error.message }, 500);
        }
    })
    // Update application status (admin only)
    .patch(
        "/:id",
        zValidator(
            "json",
            z.object({
                status: z.enum(["pending", "approved", "rejected"]),
                adminNotes: z.string().optional(),
            })
        ),
        async (c) => {
            try {
                const id = c.req.param("id");
                const data = c.req.valid("json");

                // Get application
                const [application] = await db
                    .select()
                    .from(creatorApplications)
                    .where(eq(creatorApplications.id, id));

                if (!application) {
                    return c.json({ error: "Application not found" }, 404);
                }

                // Update application
                const [updated] = await db
                    .update(creatorApplications)
                    .set({
                        status: data.status,
                        adminNotes: data.adminNotes,
                        reviewedAt: new Date(),
                    })
                    .where(eq(creatorApplications.id, id))
                    .returning();

                // Update user's creatorStatus
                await db
                    .update(users)
                    .set({ creatorStatus: data.status })
                    .where(eq(users.id, application.userId));

                return c.json({ application: updated });
            } catch (error) {
                console.error("Error updating application:", error);
                return c.json({ error: "Failed to update application" }, 500);
            }
        }
    );

export default app;
