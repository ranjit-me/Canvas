import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";
import { db } from "@/db/drizzle";
import { users, creatorApplications, htmlTemplates, webProjects, templateReviews, webTemplates } from "@/db/schema";
import { eq, and, sql, count } from "drizzle-orm";

const app = new Hono()
    // Get all creators with summary statistics
    .get("/", verifyAuth(), async (c) => {
        try {
            // Get all approved creators with their applications
            const creatorsData = await db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    image: users.image,
                    creatorStatus: users.creatorStatus,
                    applicationId: creatorApplications.id,
                    fullName: creatorApplications.fullName,
                    country: creatorApplications.country,
                    state: creatorApplications.state,
                    profilePhotoUrl: creatorApplications.profilePhotoUrl,
                    specialization: creatorApplications.specialization,
                })
                .from(users)
                .leftJoin(creatorApplications, eq(users.id, creatorApplications.userId))
                .where(eq(users.creatorStatus, "approved"));

            // For each creator, get their template counts and earnings
            const creatorsWithStats = await Promise.all(
                creatorsData.map(async (creator) => {
                    // Count HTML templates
                    const htmlTemplateCount = await db
                        .select({ count: count() })
                        .from(htmlTemplates)
                        .where(eq(htmlTemplates.creatorId, creator.id));

                    // Count Web/React templates - DISABLED: webTemplates doesn't have creatorId yet
                    // const webTemplateCount = await db
                    //     .select({ count: count() })
                    //     .from(webTemplates)
                    //     .where(eq(webTemplates.creatorId, creator.id));

                    const totalTemplates = (htmlTemplateCount[0]?.count || 0);

                    // Get sales data from webProjects (paid projects)
                    const salesData = await db
                        .select({
                            count: count(),
                            totalEarnings: sql<number>`SUM(CAST(${webProjects.pricePaid} AS DECIMAL))`,
                        })
                        .from(webProjects)
                        .innerJoin(htmlTemplates, eq(webProjects.templateId, htmlTemplates.id))
                        .where(
                            and(
                                eq(htmlTemplates.creatorId, creator.id),
                                eq(webProjects.paymentStatus, "paid")
                            )
                        );

                    const totalSales = (salesData[0]?.count || 0);
                    const totalEarnings = (salesData[0]?.totalEarnings || 0);

                    // Get aggregated rating
                    // This is complex to aggregate across all templates efficiently in one query without a join to a union
                    // For summary, we might just want to show average of averages or fetch all reviews for creator's templates
                    // For now, let's keep the summary simple or we can calculate it if needed. 
                    // The user requirement didn't explicitly ask for rating in the list view, but typically it is good.
                    // Let's leave rating out of the list view for now to keep it fast, or add it later if requested.
                    // The detailed view is where it matters most.

                    return {
                        id: creator.id,
                        name: creator.fullName || creator.name,
                        email: creator.email,
                        country: creator.country,
                        state: creator.state,
                        profilePhotoUrl: creator.profilePhotoUrl || creator.image,
                        specialization: creator.specialization,
                        stats: {
                            totalTemplates,
                            totalSales,
                            totalEarnings: Number(totalEarnings) || 0,
                        },
                    };
                })
            );

            return c.json({ creators: creatorsWithStats });
        } catch (error) {
            console.error("Error fetching creator analytics:", error);
            return c.json({ error: "Failed to fetch creator analytics" }, 500);
        }
    })

    // Get detailed statistics for a single creator
    .get("/:creatorId", verifyAuth(), async (c) => {
        try {
            const { creatorId } = c.req.param();

            // Get creator profile
            const creatorData = await db
                .select({
                    id: users.id,
                    name: users.name,
                    email: users.email,
                    image: users.image,
                    fullName: creatorApplications.fullName,
                    country: creatorApplications.country,
                    state: creatorApplications.state,
                    profilePhotoUrl: creatorApplications.profilePhotoUrl,
                    specialization: creatorApplications.specialization,
                    bio: creatorApplications.bio,
                })
                .from(users)
                .leftJoin(creatorApplications, eq(users.id, creatorApplications.userId))
                .where(eq(users.id, creatorId))
                .limit(1);

            if (!creatorData.length) {
                return c.json({ error: "Creator not found" }, 404);
            }

            const creator = creatorData[0];

            // Get all HTML templates with their sales
            const htmlTemplatesWithSales = await db
                .select({
                    id: htmlTemplates.id,
                    name: htmlTemplates.name,
                    category: htmlTemplates.category,
                    thumbnail: htmlTemplates.thumbnail,
                    price: htmlTemplates.price,
                    pricingByCountry: htmlTemplates.pricingByCountry,
                    isActive: htmlTemplates.isActive,
                    status: htmlTemplates.status,
                    isFree: htmlTemplates.isFree,
                })
                .from(htmlTemplates)
                .where(eq(htmlTemplates.creatorId, creatorId));

            // Get sales data for each HTML template
            const htmlTemplatesData = await Promise.all(
                htmlTemplatesWithSales.map(async (template) => {
                    const salesData = await db
                        .select({
                            count: count(),
                            totalEarnings: sql<number>`SUM(CAST(${webProjects.pricePaid} AS DECIMAL))`,
                        })
                        .from(webProjects)
                        .where(
                            and(
                                eq(webProjects.templateId, template.id),
                                eq(webProjects.paymentStatus, "paid")
                            )
                        );

                    // Get rating data
                    const ratingData = await db
                        .select({
                            averageRating: sql<number>`AVG(${templateReviews.rating})`,
                            totalReviews: count(),
                        })
                        .from(templateReviews)
                        .where(eq(templateReviews.templateId, template.id));

                    const averageRating = ratingData[0]?.averageRating
                        ? parseFloat(parseFloat(ratingData[0].averageRating.toString()).toFixed(1))
                        : 0;

                    return {
                        ...template,
                        type: "html",
                        sales: salesData[0]?.count || 0,
                        earnings: Number(salesData[0]?.totalEarnings) || 0,
                        averageRating,
                        totalReviews: ratingData[0]?.totalReviews || 0,
                    };
                })
            );

            // Since webTemplates doesn't have creatorId yet, we return empty list or just what we can find via other means
            // For now, let's just use htmlTemplates
            const webTemplatesData: any[] = [];

            const allTemplates = [...htmlTemplatesData, ...webTemplatesData];

            // Sort by earnings (or maybe recent?) - let's do recent if we had date, but for now earnings or name.
            // Actually schema has createdAt, but I didn't select it.
            // Let's add createdAt to selection if we want to sort.

            // Calculate location-based earnings
            const totalEarnings = allTemplates.reduce((sum, t) => sum + t.earnings, 0);

            // Calculate overall average rating
            const totalRatingSum = allTemplates.reduce((sum, t) => sum + (t.averageRating * t.totalReviews), 0);
            const totalReviewsCount = allTemplates.reduce((sum, t) => sum + t.totalReviews, 0);
            const overallAverageRating = totalReviewsCount > 0
                ? parseFloat((totalRatingSum / totalReviewsCount).toFixed(1))
                : 0;

            const earningsByCountry = {
                [creator.country || "Unknown"]: totalEarnings,
            };
            const earningsByState = {
                [creator.state || "Unknown"]: totalEarnings,
            };

            return c.json({
                creator: {
                    id: creator.id,
                    name: creator.fullName || creator.name,
                    email: creator.email,
                    country: creator.country,
                    state: creator.state,
                    profilePhotoUrl: creator.profilePhotoUrl || creator.image,
                    specialization: creator.specialization,
                    bio: creator.bio,
                },
                stats: {
                    totalTemplates: allTemplates.length,
                    totalSales: allTemplates.reduce((sum, t) => sum + t.sales, 0),
                    totalEarnings,
                    averageRating: overallAverageRating,
                    totalReviews: totalReviewsCount,
                    earningsByCountry,
                    earningsByState,
                    templates: allTemplates,
                },
            });
        } catch (error) {
            console.error("Error fetching creator details:", error);
            return c.json({ error: "Failed to fetch creator details" }, 500);
        }
    });

export default app;
