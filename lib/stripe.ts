import Stripe from "stripe";

// Stripe client singleton
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

// Stripe configuration constants
export const STRIPE_CONFIG = {
  // Product and Price IDs (created via Stripe MCP)
  PRICE_PROJECT_EUR:
    process.env.STRIPE_PRICE_PROJECT_EUR || process.env.STRIPE_PRICE_PROJECT_USD || "price_1SpNvKDYyMjWDXQGKyx2Hkno",

  // Pricing (in cents)
  // Launch price 2026: €24.50 (50% off €49 regular price)
  // Regular price starting 2027: €49
  PROJECT_PRICE_EUR_CENTS: 2450, // €24.50 launch price (50% off €49)

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
