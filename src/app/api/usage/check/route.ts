import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkUsageLimit } from "@/lib/usage";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({
        canUpscale: true,
        remainingToday: 1,
        maxScale: 2,
        maxFileSize: 5 * 1024 * 1024,
        batchLimit: 1,
        plan: "FREE",
        allowedFormats: ["png", "jpeg"],
        customDimensions: false,
        patchSize: 32,
      });
    }

    const status = await checkUsageLimit(session.user.id, session.user.email);
    return NextResponse.json(status);
  } catch (error) {
    console.error("Usage check error:", error);
    return NextResponse.json(
      { error: "Failed to check usage" },
      { status: 500 }
    );
  }
}
