import { db } from "@/db/drizzle";
import { webProjects, users, webTemplates } from "@/db/schema";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status"); // completed, pending, failed
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        // Build filter conditions
        const conditions = [];

        if (status && status !== "all") {
            conditions.push(eq(webProjects.paymentStatus, status));
        }

        if (startDate) {
            conditions.push(gte(webProjects.purchasedAt, new Date(startDate)));
        }

        if (endDate) {
            conditions.push(lte(webProjects.purchasedAt, new Date(endDate)));
        }

        // Fetch all payments with user and template information
        const payments = await db
            .select({
                id: webProjects.id,
                name: webProjects.name,
                templateId: webProjects.templateId,
                paymentStatus: webProjects.paymentStatus,
                pricePaid: webProjects.pricePaid,
                country: webProjects.country,
                razorpayOrderId: webProjects.razorpayOrderId,
                razorpayPaymentId: webProjects.razorpayPaymentId,
                purchasedAt: webProjects.purchasedAt,
                createdAt: webProjects.createdAt,
                userId: users.id,
                userName: users.name,
                userEmail: users.email,
            })
            .from(webProjects)
            .leftJoin(users, eq(webProjects.userId, users.id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(webProjects.purchasedAt));

        // Calculate statistics
        const stats = await db
            .select({
                totalRevenue: sql<number>`SUM(CASE WHEN ${webProjects.paymentStatus} = 'completed' THEN ${webProjects.pricePaid} ELSE 0 END)`,
                totalOrders: sql<number>`COUNT(*)`,
                completedOrders: sql<number>`SUM(CASE WHEN ${webProjects.paymentStatus} = 'completed' THEN 1 ELSE 0 END)`,
                pendingOrders: sql<number>`SUM(CASE WHEN ${webProjects.paymentStatus} = 'pending' THEN 1 ELSE 0 END)`,
                failedOrders: sql<number>`SUM(CASE WHEN ${webProjects.paymentStatus} = 'failed' THEN 1 ELSE 0 END)`,
            })
            .from(webProjects);

        return NextResponse.json({
            success: true,
            payments,
            stats: stats[0] || {
                totalRevenue: 0,
                totalOrders: 0,
                completedOrders: 0,
                pendingOrders: 0,
                failedOrders: 0,
            },
        });
    } catch (error) {
        console.error("Error fetching payments:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch payments" },
            { status: 500 }
        );
    }
}
