import { config } from "@/shared/config";

const SITE_URL = config.SITE_URL;

export interface JsonLdSchema {
	"@context": string;
	"@type": string;
	[key: string]: unknown;
}

export function getOrganizationSchema(): JsonLdSchema {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Skin&Body",
		url: SITE_URL,
		logo: `${SITE_URL}/icon-512.png`,
		// Совокупный рейтинг бренда — соответствует видимому на сайте (Я.Карты).
		// На уровень филиалов не дублируем (нет точных по-филиальных чисел).
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "5.0",
			reviewCount: "295",
			bestRating: "5",
			worstRating: "1",
		},
		contactPoint: {
			"@type": "ContactPoint",
			telephone: "+7-900-000-00-00",
			contactType: "customer service",
			availableLanguage: "Russian",
		},
		sameAs: [
			"https://t.me/example",
			"https://t.me/example",
			"https://www.instagram.com/skinlab_ulyanovsk",
			"https://vk.com/example",
			"https://wa.me/79000000000",
		],
	};
}

export function getLocalBusinessSchema(location: "red" | "okt"): JsonLdSchema {
	const locations = {
		red: {
			name: "Skin&Body — Примерная",
			address: "г. Ульяновск, ул. Примерная, 1",
			latitude: 54.314418,
			longitude: 48.392517,
			mapUrl: "https://yandex.ru/maps/-/CDrMeYlY",
		},
		okt: {
			name: "Skin&Body — Образцовая",
			address: "г. Ульяновск, ул. Образцовая, 2",
			latitude: 54.304101,
			longitude: 48.350679,
			mapUrl: "https://yandex.ru/maps/-/CDrv7ZZi",
		},
	};

	const loc = locations[location];

	return {
		"@context": "https://schema.org",
		"@type": "BeautySalon",
		name: loc.name,
		url: SITE_URL,
		telephone: "+7-900-000-00-00",
		email: "info@example.com",
		image: `${SITE_URL}/icon-512.png`,
		priceRange: "₽₽",
		address: {
			"@type": "PostalAddress",
			streetAddress: loc.address,
			addressLocality: "Ульяновск",
			addressRegion: "Ульяновская область",
			postalCode: "432000",
			addressCountry: "RU",
		},
		geo: {
			"@type": "GeoCoordinates",
			latitude: loc.latitude,
			longitude: loc.longitude,
		},
		hasMap: loc.mapUrl,
		openingHoursSpecification: {
			"@type": "OpeningHoursSpecification",
			dayOfWeek: [
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Saturday",
				"Sunday",
			],
			opens: "09:00",
			closes: "21:00",
		},
	};
}

export interface ServiceOfferInput {
	name: string;
	description?: string;
	price: string;
}

function parsePrice(price: string): number | null {
	const digits = price.replace(/\D+/g, "");
	if (!digits) return null;
	const n = parseInt(digits, 10);
	return Number.isFinite(n) ? n : null;
}

export function getServiceSchema(
	name: string,
	description: string,
	url: string,
	offers?: ServiceOfferInput[],
): JsonLdSchema {
	const schema: JsonLdSchema = {
		"@context": "https://schema.org",
		"@type": "Service",
		name,
		description,
		url: `${SITE_URL}/${url}`,
		provider: {
			"@type": "BeautySalon",
			name: "Skin&Body",
			url: SITE_URL,
		},
		areaServed: {
			"@type": "City",
			name: "Ульяновск",
		},
	};

	const validOffers = offers
		?.map((o) => {
			const price = parsePrice(o.price);
			return price === null
				? null
				: {
						"@type": "Offer",
						name: o.name,
						...(o.description ? { description: o.description } : {}),
						price,
						priceCurrency: "RUB",
						availability: "https://schema.org/InStock",
					};
		})
		.filter((o): o is NonNullable<typeof o> => o !== null);

	if (validOffers && validOffers.length > 0) {
		const prices = validOffers.map((o) => o.price);
		schema.offers = {
			"@type": "AggregateOffer",
			priceCurrency: "RUB",
			lowPrice: Math.min(...prices),
			highPrice: Math.max(...prices),
			offerCount: validOffers.length,
			offers: validOffers,
		};
	}

	return schema;
}

export function getBreadcrumbsSchema(
	items: Array<{ name: string; url: string }>,
): JsonLdSchema {
	return {
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		itemListElement: items.map((item, index) => ({
			"@type": "ListItem",
			position: index + 1,
			name: item.name,
			item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
		})),
	};
}

export function getServicePageSchemas(
	name: string,
	description: string,
	slug: string,
	options?: {
		breadcrumbName?: string;
		offers?: ServiceOfferInput[];
	},
): JsonLdSchema[] {
	return [
		getServiceSchema(name, description, slug, options?.offers),
		getBreadcrumbsSchema([
			{ name: "Главная", url: "/" },
			{ name: options?.breadcrumbName ?? name, url: `/${slug}` },
		]),
	];
}

// ============================================
// Shop / Product schemas
// FSD: shared/seo не импортирует entities — данные передаются явно.
// ============================================

export interface ProductSchemaInput {
	slug: string;
	name: string;
	brand: string;
	description: string;
	price: string;
	image?: string;
	inStock: boolean;
}

export function getProductSchema(product: ProductSchemaInput): JsonLdSchema {
	const price = parsePrice(product.price);
	const schema: JsonLdSchema = {
		"@context": "https://schema.org",
		"@type": "Product",
		name: product.name,
		brand: { "@type": "Brand", name: product.brand },
		description: product.description,
		url: `${SITE_URL}/shop/${product.slug}/`,
	};

	if (product.image) {
		schema.image = product.image.startsWith("http")
			? product.image
			: `${SITE_URL}${product.image}`;
	}

	if (price !== null) {
		schema.offers = {
			"@type": "Offer",
			price,
			priceCurrency: "RUB",
			availability: product.inStock
				? "https://schema.org/InStock"
				: "https://schema.org/PreOrder",
			url: `${SITE_URL}/shop/${product.slug}/`,
		};
	}

	return schema;
}

export function getProductPageSchemas(
	product: ProductSchemaInput,
	category: { title: string; key: string },
): JsonLdSchema[] {
	return [
		getProductSchema(product),
		getBreadcrumbsSchema([
			{ name: "Главная", url: "/" },
			{ name: "Магазин", url: "/shop" },
			{ name: category.title, url: `/shop#cat-${category.key}` },
			{ name: product.name, url: `/shop/${product.slug}` },
		]),
	];
}

export interface CatalogItemInput {
	slug: string;
	name: string;
}

export function getShopPageSchemas(items: CatalogItemInput[]): JsonLdSchema[] {
	return [
		{
			"@context": "https://schema.org",
			"@type": "ItemList",
			name: "Магазин — домашний уход",
			itemListElement: items.map((item, index) => ({
				"@type": "ListItem",
				position: index + 1,
				name: item.name,
				url: `${SITE_URL}/shop/${item.slug}/`,
			})),
		},
		getBreadcrumbsSchema([
			{ name: "Главная", url: "/" },
			{ name: "Магазин", url: "/shop" },
		]),
	];
}
