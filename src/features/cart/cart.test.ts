import { describe, it, expect } from "vitest";

import { formatPrice, encodeCart, decodeCart, mergeCarts } from "./CartProvider";
import type { CartLine } from "./CartProvider";
import { getAllProductSlugs, getProduct } from "@/entities/product";

// Реальный товар из каталога — чтобы тесты совпадали с боевой валидацией decode.
const slug = getAllProductSlugs()[0];
const product = getProduct(slug)!;

// toLocaleString("ru-RU") использует неразрывный пробел в разделителе тысяч.
const norm = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");

describe("formatPrice", () => {
	it("форматирует число в рубли с разделителем тысяч", () => {
		expect(norm(formatPrice(0))).toBe("0 ₽");
		expect(norm(formatPrice(1500))).toBe("1 500 ₽");
		expect(norm(formatPrice(120000))).toBe("120 000 ₽");
	});
});

describe("encodeCart / decodeCart (round-trip)", () => {
	it("обычный товар (1 шт, основной объём) кодируется как просто slug", () => {
		const items: CartLine[] = [{ slug, volume: product.volume, qty: 1 }];
		expect(encodeCart(items)).toBe(slug);
	});

	it("round-trip сохраняет состав корзины", () => {
		const items: CartLine[] = [{ slug, volume: product.volume, qty: 3 }];
		const decoded = decodeCart(encodeCart(items));
		expect(decoded).toEqual(items);
	});

	it("отбрасывает несуществующие товары", () => {
		expect(decodeCart("nesuschestvuyuschiy-slug-xyz")).toEqual([]);
	});

	it("ограничивает количество сверху (≤99)", () => {
		const decoded = decodeCart(`${slug}~250~0`);
		expect(decoded[0]?.qty).toBe(99);
	});

	it("поддерживает старый формат slug:объём:qty", () => {
		const decoded = decodeCart(`${slug}:${product.volume}:2`);
		expect(decoded).toEqual([{ slug, volume: product.volume, qty: 2 }]);
	});

	it("пустая строка → пустая корзина", () => {
		expect(decodeCart("")).toEqual([]);
	});
});

describe("mergeCarts", () => {
	it("суммирует количества одинаковых позиций", () => {
		const a: CartLine[] = [{ slug, volume: product.volume, qty: 2 }];
		const b: CartLine[] = [{ slug, volume: product.volume, qty: 3 }];
		expect(mergeCarts(a, b)).toEqual([{ slug, volume: product.volume, qty: 5 }]);
	});

	it("кап суммы на 99", () => {
		const a: CartLine[] = [{ slug, volume: product.volume, qty: 80 }];
		const b: CartLine[] = [{ slug, volume: product.volume, qty: 80 }];
		expect(mergeCarts(a, b)[0].qty).toBe(99);
	});

	it("добавляет новые позиции", () => {
		const merged = mergeCarts([], [{ slug, volume: product.volume, qty: 1 }]);
		expect(merged).toHaveLength(1);
	});
});
