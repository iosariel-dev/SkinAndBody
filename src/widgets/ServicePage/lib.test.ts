import { describe, it, expect } from "vitest";

import { ROMAN, splitTitleAccent, splitPriceItems } from "./lib";
import type { PriceTier } from "@/entities/service";

describe("splitTitleAccent", () => {
	it("отделяет последнее слово (акцент) от остального", () => {
		expect(splitTitleAccent("Лазерная эпиляция")).toEqual({
			rest: "Лазерная",
			last: "эпиляция",
		});
	});

	it("для одного слова rest пустой", () => {
		expect(splitTitleAccent("LPG")).toEqual({ rest: "", last: "LPG" });
	});

	it("сохраняет несколько слов в rest", () => {
		expect(splitTitleAccent("Коррекция и моделирование")).toEqual({
			rest: "Коррекция и",
			last: "моделирование",
		});
	});

	it("пустая строка → пустые части", () => {
		expect(splitTitleAccent("")).toEqual({ rest: "", last: "" });
	});
});

describe("splitPriceItems", () => {
	const tier: PriceTier = {
		label: "Базовый",
		items: [
			{ name: "Подмышки + голени", description: "комбо зон", price: "1 500 ₽" },
			{ name: "Абонемент 5 процедур", description: "−20%", price: "5 000 ₽" },
			{ name: "Подмышки", price: "600 ₽" },
		],
	};

	it("раскладывает на комплексы / абонементы / одиночные", () => {
		const { complexItems, subscriptionItems, singleItems } = splitPriceItems(tier);
		expect(complexItems.map((i) => i.name)).toEqual(["Подмышки + голени"]);
		expect(subscriptionItems.map((i) => i.name)).toEqual(["Абонемент 5 процедур"]);
		expect(singleItems.map((i) => i.name)).toEqual(["Подмышки"]);
	});

	it("абонемент с описанием не попадает в комплексы (по ключевым словам)", () => {
		const { complexItems, subscriptionItems } = splitPriceItems(tier);
		expect(complexItems).toHaveLength(1);
		expect(subscriptionItems).toHaveLength(1);
	});

	it("undefined-тариф → все массивы пустые", () => {
		expect(splitPriceItems(undefined)).toEqual({
			complexItems: [],
			subscriptionItems: [],
			singleItems: [],
		});
	});
});

describe("ROMAN", () => {
	it("начинается с I и индексируется с нуля", () => {
		expect(ROMAN[0]).toBe("I");
		expect(ROMAN[4]).toBe("V");
	});
});
