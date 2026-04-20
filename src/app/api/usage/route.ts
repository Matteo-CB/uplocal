import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { recordUsage } from "@/lib/usage";
import { usageRecordSchema } from "@/types/stripe";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = usageRecordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    await recordUsage(session.user.id, parsed.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Usage recording error:", error);
    return NextResponse.json(
      { error: "Failed to record usage" },
      { status: 500 }
    );
  }
}
