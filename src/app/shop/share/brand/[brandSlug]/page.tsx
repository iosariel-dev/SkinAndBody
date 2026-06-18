import type { ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ShopPage } from "@/widgets/Pages/Shop/ShopPage";
import { getBrandBySlug, getAllBrandSlugs } from "@/entities/product";

interface BrandRouteProps {
	params: Promise<{ brandSlug: string }>;
}

export function generateStaticParams(): Array<{ brandSlug: string }> {
	return getAllBrandSlugs().map((brandSlug) => ({ brandSlug }));
}

export const metadata: Metadata = {
	title: "Магазин — Skin&Body",
	description: "Каталог бренда (режим формирования ссылки на корзину).",
	robots: { index: false, follow: false },
};

export default async function ShareBrandRoute({
	params,
}: BrandRouteProps): Promise<ReactElement> {
	const { brandSlug } = await params;
	const brand = getBrandBySlug(brandSlug);
	if (!brand) notFound();
	return <ShopPage brand={brand} shareMode />;
}
