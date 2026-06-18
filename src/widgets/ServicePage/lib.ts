import type { PriceItem, PriceTier } from "@/entities/service";

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];

export function splitTitleAccent(title: string): { rest: string; last: string } {
  const parts = title.split(" ");
  const last = parts.pop() ?? "";
  return { rest: parts.join(" "), last };
}

// Абонементы определяем по названию позиции (многосеансовые / посещения).
const isSubscription = (item: { name: string; description?: string }) =>
  /процедур|посещени|абонемент/i.test(item.name);

export interface SplitPriceItems {
  complexItems: PriceItem[];
  subscriptionItems: PriceItem[];
  singleItems: PriceItem[];
}

// Разбивка позиций тарифа на комплексы (наборы зон), абонементы и одиночные зоны.
export function splitPriceItems(tier: PriceTier | undefined): SplitPriceItems {
  if (!tier) return { complexItems: [], subscriptionItems: [], singleItems: [] };
  return {
    complexItems: tier.items.filter((item) => item.description && !isSubscription(item)),
    subscriptionItems: tier.items.filter((item) => item.description && isSubscription(item)),
    singleItems: tier.items.filter((item) => !item.description),
  };
}
