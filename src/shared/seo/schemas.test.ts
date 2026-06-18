import { describe, it, expect } from "vitest";

import {
	getServiceSchema,
	getBreadcrumbsSchema,
	getOrganizationSchema,
} from "./schemas";

describe("getServiceSchema", () => {
	it("базовая схема Service с провайдером и абсолютным url", () => {
		const s = getServiceSchema("Лазерная эпиляция", "Удаление волос", "epilation");
		expect(s["@type"]).toBe("Service");
		expect(s.name).toBe("Лазерная эпиляция");
		expect(s.url).toBe("https://skinandbody.ru/epilation");
		expect(s.provider).toMatchObject({ "@type": "BeautySalon" });
		expect(s.offers).toBeUndefined();
	});

	it("строит AggregateOffer и парсит цены вида «3 500 ₽»", () => {
		const s = getServiceSchema("X", "Y", "x", [
			{ name: "A", price: "3 500 ₽" },
			{ name: "B", price: "от 1 700 ₽" },
			{ name: "C", price: "12 000 ₽" },
		]);
		expect(s.offers).toMatchObject({
			"@type": "AggregateOffer",
			priceCurrency: "RUB",
			lowPrice: 1700,
			highPrice: 12000,
			offerCount: 3,
		});
	});

	it("игнорирует позиции без распознаваемой цены", () => {
		const s = getServiceSchema("X", "Y", "x", [
			{ name: "A", price: "1 000 ₽" },
			{ name: "B", price: "по запросу" },
		]);
		expect((s.offers as { offerCount: number }).offerCount).toBe(1);
	});
});

describe("getBreadcrumbsSchema", () => {
	it("нумерует позиции и резолвит относительные url в абсолютные", () => {
		const s = getBreadcrumbsSchema([
			{ name: "Главная", url: "/" },
			{ name: "Услуги", url: "/#services" },
		]);
		expect(s["@type"]).toBe("BreadcrumbList");
		const items = s.itemListElement as Array<{ position: number; item: string }>;
		expect(items[0].position).toBe(1);
		expect(items[1].position).toBe(2);
		expect(items[0].item).toMatch(/^https:\/\/skinandbody\.ru/);
	});
});

describe("getOrganizationSchema", () => {
	it("возвращает Organization с абсолютным логотипом", () => {
		const s = getOrganizationSchema();
		expect(s.url).toBe("https://skinandbody.ru");
		expect(s.logo).toBe("https://skinandbody.ru/icon-512.png");
	});
});
