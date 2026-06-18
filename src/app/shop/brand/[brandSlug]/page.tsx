import type { ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShopPage } from "@/widgets/Pages/Shop/ShopPage";
import { JsonLd, getShopPageSchemas } from "@/shared/seo";
import {
	getBrandBySlug,
	getAllBrandSlugs,
	getProductsByCategory,
} from "@/entities/product";

interface BrandRouteProps {
	params: Promise<{ brandSlug: string }>;
}

export function generateStaticParams(): Array<{ brandSlug: string }> {
	return getAllBrandSlugs().map((brandSlug) => ({ brandSlug }));
}

export async function generateMetadata({
	params,
}: BrandRouteProps): Promise<Metadata> {
	const { brandSlug } = await params;
	const brand = getBrandBySlug(brandSlug);

	if (!brand) {
		return { title: "Бренд не найден — Skin&Body" };
	}

	const title = `${brand.title} — косметика для домашнего ухода | Skin&Body`;
	const url = `/shop/brand/${brand.slug}/`;

	return {
		title,
		description: brand.description,
		robots: { index: true, follow: true },
		alternates: { canonical: url },
		openGraph: {
			title,
			description: brand.description,
			url,
			type: "website",
			images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: brand.title }],
		},
	};
}

export default async function BrandRoute({
	params,
}: BrandRouteProps): Promise<ReactElement> {
	const { brandSlug } = await params;
	const brand = getBrandBySlug(brandSlug);

	if (!brand) {
		notFound();
	}

	const items = getProductsByCategory(brand.name)
		.flatMap((g) => g.items)
		.map((p) => ({ slug: p.slug, name: p.name }));

	return (
		<>
			<JsonLd data={getShopPageSchemas(items)} />
			<ShopPage brand={brand} />
		</>
	);
}
