import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json(
      { success: true, data: { count: result.count } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return NextResponse.json(
      { success: false, error: "Failed to mark all notifications as read" },
      { status: 500 }
    );
  }
}
