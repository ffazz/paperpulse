import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(): Promise<NextResponse> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await prisma.notification.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      { success: true, data: { count: result.count } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting all notifications:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete all notifications" },
      { status: 500 }
    );
  }
}
