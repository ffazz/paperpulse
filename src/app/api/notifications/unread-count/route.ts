import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Cache unread count for 30 seconds
const countCache = new Map<string, { count: number; timestamp: number }>();

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check cache
    const cached = countCache.get(session.user.id);
    if (cached && Date.now() - cached.timestamp < 30000) {
      return NextResponse.json(
        { success: true, data: { count: cached.count } },
        { status: 200 }
      );
    }

    const count = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    });

    // Cache the result
    countCache.set(session.user.id, { count, timestamp: Date.now() });

    return NextResponse.json(
      { success: true, data: { count } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch unread count" },
      { status: 500 }
    );
  }
}
