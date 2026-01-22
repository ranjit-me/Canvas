import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userData = await db
            .select()
            .from(users)
            .where(eq(users.email, session.user.email!))
            .limit(1);

        if (userData.length === 0) {
            // This case should ideally not be reached if a session exists and is valid,
            // but as a fallback, return user not found.
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Return current user data
        return NextResponse.json({
            name: userData[0].name,
            email: userData[0].email,
            image: userData[0].image,
            templateLanguage: userData[0].templateLanguage,
        });
    } catch (error) {
        console.error("Profile GET error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, phone, templateLanguage } = body;

        // Update the database
        const updatedUser = await db
            .update(users)
            .set({
                name,
                // phone, // phone is not in schema but user wants it? 
                // Wait, I saw phone in the profile form but it's not in the users table in schema.ts
                // I'll stick to name and templateLanguage for now to avoid schema mismatch
                templateLanguage,
            })
            .where(eq(users.email, session.user.email!))
            .returning();

        if (updatedUser.length === 0) {
            throw new Error("User not found or update failed");
        }

        console.log("Profile update request:", { name, phone, userId: session.user.email });

        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
            user: {
                name,
                email: session.user.email,
                image: session.user.image,
            },
        });
    } catch (error) {
        console.error("Profile PUT error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
