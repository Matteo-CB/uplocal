import { z } from "zod";

export const checkoutSchema = z.object({
  priceId: z.string().min(1),
  locale: z.string().optional(),
});

export const usageRecordSchema = z.object({
  scale: z.union([z.literal(2), z.literal(4), z.literal(8)]),
  inputWidth: z.number().int().positive(),
  inputHeight: z.number().int().positive(),
  outputWidth: z.number().int().positive(),
  outputHeight: z.number().int().positive(),
  inputFormat: z.string().min(1),
  outputFormat: z.string().min(1),
  processingTime: z.number().int().nonnegative(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type UsageRecordInput = z.infer<typeof usageRecordSchema>;
