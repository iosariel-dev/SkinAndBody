export type { ServiceData, PriceItem, PriceTier } from "./types";

import type { ServiceData } from "./types";

import cleansingData from "./data/cleansing.json";
import depilationData from "./data/depilation.json";
import emsData from "./data/ems.json";
import epilationData from "./data/epilation.json";
import lpgData from "./data/lpg.json";
import microcurrenttherapyData from "./data/microcurrenttherapy.json";
import peelingsData from "./data/peelings.json";
import rfliftingData from "./data/rflifting.json";
import vacuumData from "./data/vacuum.json";

const services: Record<string, ServiceData> = {
	cleansing: cleansingData as ServiceData,
	depilation: depilationData as ServiceData,
	ems: emsData as ServiceData,
	epilation: epilationData as ServiceData,
	lpg: lpgData as ServiceData,
	microcurrenttherapy: microcurrenttherapyData as ServiceData,
	peelings: peelingsData as ServiceData,
	rflifting: rfliftingData as ServiceData,
	vacuum: vacuumData as ServiceData,
};

export function getServiceData(slug: string): ServiceData | undefined {
	return services[slug];
}

export function getAllServices(): ServiceData[] {
	return Object.values(services);
}

export function getAllServiceSlugs(): string[] {
	return Object.keys(services);
}

// ===== Цены — единый источник =====
// Прайс услуги живёт только в data/<slug>.json. Сводки «от X ₽» (например на
// главной) выводятся отсюда, чтобы не дублировать и не дрейфовать при изменении
// цен (плавающий рубль → правим один JSON).

function parsePrice(price: string): number | null {
	const digits = price.replace(/\D+/g, "");
	return digits ? parseInt(digits, 10) : null;
}

// Разделитель тысяч — обычный пробел (как в исходных строках прайса).
function formatRub(n: number): string {
	return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Минимальная цена услуги (число) по всем тарифам/позициям, либо null. */
export function getServiceMinPrice(slug: string): number | null {
	const data = services[slug];
	if (!data) return null;
	const prices = data.prices
		.flatMap((tier) => tier.items)
		.map((item) => parsePrice(item.price))
		.filter((n): n is number => n !== null);
	return prices.length ? Math.min(...prices) : null;
}

/** Сводка «от X ₽» для услуги (пустая строка, если цен нет). */
export function getServiceFromPrice(slug: string): string {
	const min = getServiceMinPrice(slug);
	return min === null ? "" : `от ${formatRub(min)} ₽`;
}

// ===== Консультации — единый источник цен/длительностей =====
export const consultations = {
	general: { price: "500 ₽", duration: "30 мин" },
	acne: { price: "1 500 ₽", duration: "45-60 мин" },
} as const;
