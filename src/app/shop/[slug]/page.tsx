import type { ReactElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductPage } from "@/widgets/Pages/Shop/ProductPage";
import { JsonLd, getProductPageSchemas } from "@/shared/seo";
import {
	getProduct,
	getAllProductSlugs,
	getCategories,
} from "@/entities/product";

interface ProductRouteProps {
	params: Promise<{ slug: string }>;
}

export function generateStaticParams(): Array<{ slug: string }> {
	return getAllProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
	params,
}: ProductRouteProps): Promise<Metadata> {
	const { slug } = await params;
	const product = getProduct(slug);

	if (!product) {
		return { title: "Товар не найден — Skin&Body" };
	}

	const title = `${product.name} — ${product.brand} | Skin&Body`;
	const url = `/shop/${product.slug}/`;

	return {
		title,
		description: product.description,
		robots: { index: true, follow: true },
		alternates: { canonical: url },
		openGraph: {
			title,
			description: product.description,
			url,
			type: "website",
			images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: product.name }],
		},
	};
}

export default async function ProductRoute({
	params,
}: ProductRouteProps): Promise<ReactElement> {
	const { slug } = await params;
	const product = getProduct(slug);

	if (!product) {
		notFound();
	}

	const category = getCategories().find((c) => c.key === product.category) ?? {
		key: product.category,
		title: product.category,
	};

	return (
		<>
			<JsonLd
				data={getProductPageSchemas(
					{
						slug: product.slug,
						name: product.name,
						brand: product.brand,
						description: product.description,
						price: product.price,
						image: product.images[0],
						inStock: product.availability !== "on_order",
					},
					category,
				)}
			/>
			<ProductPage product={product} />
		</>
	);
}
