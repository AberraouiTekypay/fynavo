import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  amount: number,
  currency: string = "MAD",
  options?: { compact?: boolean; minimumFractionDigits?: number }
): string {
  const { compact = false, minimumFractionDigits = 0 } = options || {};

  if (compact) {
    if (Math.abs(amount) >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(2).replace(/\.00$/, "")} M ${currency}`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${(amount / 1_000).toFixed(0)} K ${currency}`;
    }
  }

  const formatted = new Intl.NumberFormat("fr-MA", {
    style: "decimal",
    minimumFractionDigits,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${currency}`;
}

export function formatPercent(value: number, includeSign: boolean = false): string {
  const sign = includeSign && value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} %`;
}
