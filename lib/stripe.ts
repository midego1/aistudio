import Stripe from "stripe";

// Stripe client singleton
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

// Stripe configuration constants
export const STRIPE_CONFIG = {
  // Product and Price IDs (created via Stripe MCP)
  PRICE_PROJECT_USD:
    process.env.STRIPE_PRICE_PROJECT_USD || "price_1SneD7KOzkjqB2nyMT5KWVAb",

  // Pricing (in cents)
  PROJECT_PRICE_USD_CENTS: 9900, // $99 USD
  PROJECT_PRICE_NOK_ORE: 100_000, // 1000 NOK (in ore for consistency with Fiken)

  // URLs
  SUCCESS_URL: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
  CANCEL_URL: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
} as const;

// Helper to get the base URL for redirects
export function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
