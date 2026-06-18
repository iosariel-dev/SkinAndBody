import { describe, it, expect } from "vitest";

import {
	getAllProductSlugs,
	getProduct,
	getBrands,
	getAllBrandSlugs,
	getProductsByCategory,
} from "./index";

describe("product entity (на реальном каталоге)", () => {
	it("каталог непустой и slug'и уникальны", () => {
		const slugs = getAllProductSlugs();
		expect(slugs.length).toBeGreaterThan(0);
		expect(new Set(slugs).size).toBe(slugs.length);
	});

	it("getProduct по существующему slug возвращает консистентный товар", () => {
		const slug = getAllProductSlugs()[0];
		const product = getProduct(slug);
		expect(product).toBeDefined();
		expect(product!.slug).toBe(slug);
		expect(typeof product!.name).toBe("string");
		expect(typeof product!.price).toBe("string");
		expect(typeof product!.volume).toBe("string");
	});

	it("getProduct по несуществующему slug → undefined", () => {
		expect(getProduct("net-takogo-tovara-xyz")).toBeUndefined();
	});

	it("бренды непустые, slug'и брендов уникальны", () => {
		const brands = getBrands();
		expect(brands.length).toBeGreaterThan(0);
		const brandSlugs = getAllBrandSlugs();
		expect(new Set(brandSlugs).size).toBe(brandSlugs.length);
	});

	it("сумма товаров по категориям == размеру каталога", () => {
		const total = getProductsByCategory().reduce((n, g) => n + g.items.length, 0);
		expect(total).toBe(getAllProductSlugs().length);
	});
});
