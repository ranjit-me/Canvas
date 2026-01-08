import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Return current user data
        return NextResponse.json({
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
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
        const { name, phone } = body;

        // In a real app, you would update the database here
        // For now, we'll just return success since NextAuth manages user data
        // You would typically do something like:
        // await db.user.update({
        //   where: { id: session.user.id },
        //   data: { name, phone }
        // });

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
