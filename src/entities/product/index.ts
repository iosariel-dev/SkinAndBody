export type { ProductData, ProductCategory, ProductBrand } from "./types";

import type { ProductData, ProductCategory, ProductBrand } from "./types";

import categoriesData from "./data/categories.json";
import productsData from "./data/products.json";
import brandsData from "./data/brands.json";

const products = productsData as ProductData[];
const categories = categoriesData as ProductCategory[];
const brands = brandsData as ProductBrand[];

export interface BrandWithCount extends ProductBrand {
	count: number;
}

// Бренды с количеством товаров (пустые отбрасываются), в порядке brands.json.
export function getBrands(): BrandWithCount[] {
	return brands
		.map((brand) => ({
			...brand,
			count: products.filter((p) => p.brand === brand.name).length,
		}))
		.filter((brand) => brand.count > 0);
}

export function getBrandBySlug(slug: string): ProductBrand | undefined {
	return brands.find((b) => b.slug === slug);
}

export function getAllBrandSlugs(): string[] {
	return getBrands().map((b) => b.slug);
}

// Slug бренда по названию (ProductData.brand) — для ссылок с карточки товара.
export function getBrandSlugByName(name: string): string | undefined {
	return brands.find((b) => b.name === name)?.slug;
}

export function getAllProducts(): ProductData[] {
	return products;
}

export function getProduct(slug: string): ProductData | undefined {
	return products.find((p) => p.slug === slug);
}

export function getAllProductSlugs(): string[] {
	return products.map((p) => p.slug);
}

export function getCategories(): ProductCategory[] {
	return categories;
}

export interface CategoryGroup {
	category: ProductCategory;
	items: ProductData[];
}

// Товары, сгруппированные по категориям в порядке categories.json.
// brandName (опц.) — ограничить одним брендом (для товарного листа бренда).
// Пустые категории отбрасываются — секция не рендерится.
export function getProductsByCategory(brandName?: string): CategoryGroup[] {
	const pool = brandName
		? products.filter((p) => p.brand === brandName)
		: products;
	return categories
		.map((category) => ({
			category,
			// Хиты — всегда вверху секции (стабильная сортировка сохраняет
			// исходный порядок остальных товаров).
			items: pool
				.filter((p) => p.category === category.key)
				.sort(
					(a, b) =>
						(b.badge === "hit" ? 1 : 0) - (a.badge === "hit" ? 1 : 0),
				),
		}))
		.filter((group) => group.items.length > 0);
}

export function getCategoryTitle(key: string): string {
	return categories.find((c) => c.key === key)?.title ?? key;
}

// «С этим покупают»: явный список related или fallback — соседи по категории.
// «С этим покупают»: какие категории дополняют текущую (логика ухода).
// SPF добавляется всегда отдельно (см. ниже) — здесь его не указываем.
const COMPLEMENTARY_CATEGORIES: Record<string, string[]> = {
	cleansing: ["toning", "hydration"],
	toning: ["hydration", "sensitive"],
	hydration: ["cleansing", "eye"],
	lipid: ["hydration", "sensitive"],
	sensitive: ["cleansing", "hydration"],
	couperose: ["sensitive", "toning"],
	antioxidant: ["hydration", "antiage"],
	eye: ["hydration", "antiage"],
	lips: ["hydration", "eye"],
	pigment: ["cleansing", "antiage"],
	antiage: ["hydration", "eye"],
	acne: ["cleansing", "toning"],
	lymph: ["eye", "antiage"],
	peels: ["hydration", "cleansing"],
	spf: ["hydration", "antiage"],
	masks: ["hydration", "cleansing"],
	sets: ["spf", "hydration"],
	// Heliocare (вся линия — солнцезащита): связи внутри бренда
	"hc-kids": ["hc-body", "hc-sticks"],
	"hc-body": ["hc-sticks", "hc-oily"],
	"hc-sticks": ["hc-body", "hc-kids"],
	"hc-sensitive": ["hc-antiage", "hc-dry"],
	"hc-dry": ["hc-sensitive", "hc-tone"],
	"hc-oily": ["hc-acne", "hc-tone"],
	"hc-tone": ["hc-oily", "hc-antiage"],
	"hc-acne": ["hc-oily", "hc-sensitive"],
	"hc-antiage": ["hc-pigment", "hc-tone"],
	"hc-pigment": ["hc-antiage", "hc-sensitive"],
	// Dermatime (связи внутри бренда)
	"dt-acidcure": ["dt-pure-perfect", "dt-sensi-well"],
	"dt-aloe-v": ["dt-sensi-well", "dt-c-time"],
	"dt-caviar": ["dt-elastense", "dt-lift-del-mar"],
	"dt-c-time": ["dt-iretinol", "dt-caviar"],
	"dt-cotton-clean": ["dt-sensi-well", "dt-aloe-v"],
	"dt-elastense": ["dt-lift-del-mar", "dt-caviar"],
	"dt-iretinol": ["dt-c-time", "dt-acidcure"],
	"dt-lift-del-mar": ["dt-elastense", "dt-caviar"],
	"dt-pure-perfect": ["dt-acidcure", "dt-cotton-clean"],
	"dt-sensi-well": ["dt-aloe-v", "dt-cotton-clean"],
	// Endocare (связи внутри бренда)
	"ec-cleansing": ["ec-serum", "ec-cream"],
	"ec-serum": ["ec-cream", "ec-eye"],
	"ec-cream": ["ec-serum", "ec-eye"],
	"ec-eye": ["ec-serum", "ec-cream"],
	"ec-mask": ["ec-serum", "ec-cleansing"],
	// Neoretin (связи внутри бренда)
	"nr-serum": ["nr-cream", "nr-eye"],
	"nr-cream": ["nr-serum", "nr-eye"],
	"nr-eye": ["nr-serum", "nr-cream"],
	"nr-peel": ["nr-serum", "nr-cream"],
	"nr-body": ["nr-cream", "nr-serum"],
};

export function getRelatedProducts(slug: string, limit = 4): ProductData[] {
	const product = getProduct(slug);
	if (!product) return [];

	// Явная привязка у товара (related) имеет приоритет.
	if (product.related?.length) {
		return product.related
			.map(getProduct)
			.filter((p): p is ProductData => p !== undefined)
			.slice(0, limit);
	}

	const result: ProductData[] = [];
	const seen = new Set<string>([slug]);

	// «С этим покупают» — в рамках того же бренда (единая линейка ухода).
	const pickFrom = (category: string, max: number): void => {
		let added = 0;
		for (const p of products) {
			if (result.length >= limit || added >= max) break;
			if (
				p.brand === product.brand &&
				p.category === category &&
				!seen.has(p.slug)
			) {
				result.push(p);
				seen.add(p.slug);
				added++;
			}
		}
	};

	// SPF — всегда и везде (кроме самих SPF-товаров), приоритетно.
	if (product.category !== "spf") pickFrom("spf", 1);

	// Дополняющие категории по логике ухода; если для категории нет явной
	// карты — берём соседей по той же категории/линейке (актуально для Sesderma).
	for (const category of COMPLEMENTARY_CATEGORIES[product.category] ?? [
		product.category,
	]) {
		if (result.length >= limit) break;
		pickFrom(category, 2);
	}

	return result.slice(0, limit);
}
