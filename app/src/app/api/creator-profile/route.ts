import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await db.query.users.findFirst({
            where: eq(users.id, session.user.id),
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            profile: {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                bio: user.bio || "",
                portfolioUrl: user.portfolioUrl || "",
                socialLinks: user.socialLinks ? JSON.parse(user.socialLinks) : {},
            }
        });
    } catch (error) {
        console.error("Error fetching creator profile:", error);
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { name, bio, portfolioUrl, socialLinks } = body;

        await db
            .update(users)
            .set({
                name: name || undefined,
                bio: bio || undefined,
                portfolioUrl: portfolioUrl || undefined,
                socialLinks: socialLinks ? JSON.stringify(socialLinks) : undefined,
            })
            .where(eq(users.id, session.user.id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating creator profile:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
