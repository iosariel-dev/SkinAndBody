import type { ReactElement } from "react";
import type { Metadata } from "next";

import { ShopBrandsPage } from "@/widgets/Pages/Shop/ShopBrandsPage";

export const metadata: Metadata = {
	title: "Skin&Body — Магазин косметики для домашнего ухода в Ульяновске",
	description:
		"Профессиональная косметика из студии Skin&Body для ухода дома — бренды Skin Synergy и Angiopharm. Подобрано косметологом. Самовывоз и доставка.",
	robots: { index: true, follow: true },
	alternates: {
		canonical: "/shop/",
	},
	openGraph: {
		title: "Skin&Body — Магазин косметики для домашнего ухода",
		description:
			"Профессиональная косметика из студии для ухода дома. Бренды Skin Synergy и Angiopharm.",
		url: "/shop/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function Shop(): ReactElement {
	return <ShopBrandsPage />;
}
