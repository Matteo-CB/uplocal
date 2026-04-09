import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return _stripe;
}

export const PRICE_IDS = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID || "",
  PRO_YEARLY: process.env.STRIPE_PRO_YEARLY_PRICE_ID || "",
  STUDIO_MONTHLY: process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID || "",
  STUDIO_YEARLY: process.env.STRIPE_STUDIO_YEARLY_PRICE_ID || "",
};

export function getPlanFromPriceId(priceId: string): "PRO" | "STUDIO" | "FREE" {
  if (
    priceId === PRICE_IDS.PRO_MONTHLY ||
    priceId === PRICE_IDS.PRO_YEARLY
  ) {
    return "PRO";
  }
  if (
    priceId === PRICE_IDS.STUDIO_MONTHLY ||
    priceId === PRICE_IDS.STUDIO_YEARLY
  ) {
    return "STUDIO";
  }
  return "FREE";
}
