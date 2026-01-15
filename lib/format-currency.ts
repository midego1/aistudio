/**
 * Currency formatting utilities
 */

export type Currency = "EUR" | "USD";

export interface FormatCurrencyOptions {
  currency?: Currency;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format an amount in minor currency units (cents) to a formatted currency string
 * @param amountCents - Amount in cents (e.g., 9900 for €99.00)
 * @param options - Formatting options
 * @returns Formatted currency string (e.g., "€99")
 */
export function formatCurrency(
  amountCents: number,
  options: FormatCurrencyOptions = {}
): string {
  const {
    currency = "EUR",
    locale = "nl-NL",
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options;

  const amount = amountCents / 100;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Format EUR amount (for Netherlands/Dutch market)
 * @param amountCents - Amount in cents
 * @returns Formatted EUR string (e.g., "€ 99")
 */
export function formatEUR(amountCents: number): string {
  return formatCurrency(amountCents, {
    currency: "EUR",
    locale: "nl-NL",
  });
}

/**
 * Format USD amount
 * @param amountCents - Amount in cents
 * @returns Formatted USD string (e.g., "$99")
 */
export function formatUSD(amountCents: number): string {
  return formatCurrency(amountCents, {
    currency: "USD",
    locale: "en-US",
  });
}
