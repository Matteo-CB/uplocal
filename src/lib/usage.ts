import { prisma } from "./prisma";
import type { UsageStatus, Plan, OutputFormat } from "@/types";

const VIP_EMAILS = [
  "daiki.ajwad@gmail.com",
  "matteo.biyikli3224@gmail.com",
];

function isVipUser(email: string | null | undefined): boolean {
  if (!email) return false;
  return VIP_EMAILS.includes(email.toLowerCase());
}

const PLAN_LIMITS: Record<Plan, {
  dailyLimit: number;
  maxScale: number;
  maxFileSize: number;
  batchLimit: number;
  allowedFormats: OutputFormat[];
  customDimensions: boolean;
  patchSize: number;
}> = {
  FREE: {
    dailyLimit: 1,
    maxScale: 2,
    maxFileSize: 5 * 1024 * 1024,
    batchLimit: 1,
    allowedFormats: ["png", "jpeg"],
    customDimensions: false,
    patchSize: 32,
  },
  PRO: {
    dailyLimit: -1,
    maxScale: 4,
    maxFileSize: 10 * 1024 * 1024,
    batchLimit: 10,
    allowedFormats: ["png", "jpeg", "webp"],
    customDimensions: false,
    patchSize: 64,
  },
  STUDIO: {
    dailyLimit: -1,
    maxScale: 8,
    maxFileSize: 10 * 1024 * 1024,
    batchLimit: 50,
    allowedFormats: ["png", "jpeg", "webp"],
    customDimensions: true,
    patchSize: 64,
  },
};

const VIP_STATUS: UsageStatus = {
  canUpscale: true,
  remainingToday: -1,
  maxScale: 8,
  maxFileSize: 10 * 1024 * 1024,
  batchLimit: 50,
  plan: "STUDIO",
  allowedFormats: ["png", "jpeg", "webp"],
  customDimensions: true,
  patchSize: 64,
};

export async function getUserPlan(userId: string, email?: string | null): Promise<Plan> {
  if (isVipUser(email)) return "STUDIO";

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (!subscription || subscription.status !== "ACTIVE") {
    return "FREE";
  }

  return subscription.plan as Plan;
}

export async function checkUsageLimit(userId: string, email?: string | null): Promise<UsageStatus> {
  if (isVipUser(email)) return VIP_STATUS;

  const plan = await getUserPlan(userId, email);
  const limits = PLAN_LIMITS[plan];

  if (limits.dailyLimit === -1) {
    return {
      canUpscale: true,
      remainingToday: -1,
      maxScale: limits.maxScale,
      maxFileSize: limits.maxFileSize,
      batchLimit: limits.batchLimit,
      plan,
      allowedFormats: limits.allowedFormats,
      customDimensions: limits.customDimensions,
      patchSize: limits.patchSize,
    };
  }

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const todayCount = await prisma.usageRecord.count({
    where: {
      userId,
      createdAt: { gte: todayStart },
    },
  });

  const remaining = Math.max(0, limits.dailyLimit - todayCount);

  return {
    canUpscale: remaining > 0,
    remainingToday: remaining,
    maxScale: limits.maxScale,
    maxFileSize: limits.maxFileSize,
    batchLimit: limits.batchLimit,
    plan,
    allowedFormats: limits.allowedFormats,
    customDimensions: limits.customDimensions,
    patchSize: limits.patchSize,
  };
}

export async function recordUsage(
  userId: string,
  data: {
    scale: number;
    inputWidth: number;
    inputHeight: number;
    outputWidth: number;
    outputHeight: number;
    inputFormat: string;
    outputFormat: string;
    processingTime: number;
  }
) {
  return prisma.usageRecord.create({
    data: {
      userId,
      action: "upscale",
      ...data,
    },
  });
}

export async function getUsageStats(userId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const records = await prisma.usageRecord.findMany({
    where: {
      userId,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "asc" },
  });

  const dailyCounts: Record<string, number> = {};
  let totalTime = 0;

  for (const record of records) {
    const day = record.createdAt.toISOString().split("T")[0];
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    totalTime += record.processingTime;
  }

  return {
    total: records.length,
    averageTime: records.length > 0 ? Math.round(totalTime / records.length) : 0,
    dailyCounts,
  };
}
