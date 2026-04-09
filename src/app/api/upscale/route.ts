import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkUsageLimit, recordUsage } from "@/lib/usage";

// Studio API endpoint for programmatic upscaling
// This validates the user has Studio plan access
// The actual upscaling still happens client-side (browser required for TensorFlow.js)
// This endpoint handles: authentication, authorization, and usage tracking

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = await checkUsageLimit(session.user.id, session.user.email);

    if (status.plan !== "STUDIO") {
      return NextResponse.json(
        { error: "API access requires a Studio plan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    // Validate usage before upscale
    if (action === "check") {
      return NextResponse.json({
        canUpscale: status.canUpscale,
        maxScale: status.maxScale,
        maxFileSize: status.maxFileSize,
        batchLimit: status.batchLimit,
        allowedFormats: status.allowedFormats,
        customDimensions: status.customDimensions,
      });
    }

    // Record completed upscale
    if (action === "record") {
      const { scale, inputWidth, inputHeight, outputWidth, outputHeight, inputFormat, outputFormat, processingTime } = body;

      if (!scale || !inputWidth || !inputHeight || !outputWidth || !outputHeight) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }

      await recordUsage(session.user.id, {
        scale,
        inputWidth,
        inputHeight,
        outputWidth,
        outputHeight,
        inputFormat: inputFormat || "png",
        outputFormat: outputFormat || "png",
        processingTime: processingTime || 0,
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API upscale error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// API documentation endpoint
export async function GET() {
  return NextResponse.json({
    name: "Uplocal API",
    version: "1.0",
    description: "Uplocal Studio API for programmatic image upscaling. The actual AI processing runs client-side via TensorFlow.js. This API handles authentication, plan validation, and usage tracking.",
    endpoints: {
      "POST /api/upscale": {
        description: "Check access or record upscale usage",
        authentication: "Session cookie (Google OAuth)",
        requiredPlan: "Studio",
        actions: {
          check: {
            description: "Check if the authenticated user can upscale",
            body: { action: "check" },
            response: { canUpscale: true, maxScale: 8, maxFileSize: 10485760, batchLimit: 50, allowedFormats: ["png", "jpeg", "webp"], customDimensions: true },
          },
          record: {
            description: "Record a completed upscale for usage tracking",
            body: {
              action: "record",
              scale: 4,
              inputWidth: 1920,
              inputHeight: 1080,
              outputWidth: 7680,
              outputHeight: 4320,
              inputFormat: "png",
              outputFormat: "webp",
              processingTime: 5000,
            },
            response: { success: true },
          },
        },
      },
    },
  });
}
