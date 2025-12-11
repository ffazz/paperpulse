import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ notificationId: string }> }
): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { notificationId } = await context.params;

    // Verify ownership
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
