import type { ReactElement } from "react";
import type { Metadata } from "next";

import { ShopBrandsPage } from "@/widgets/Pages/Shop/ShopBrandsPage";

export const metadata: Metadata = {
	title: "Магазин — Skin&Body",
	description: "Выбор бренда (режим формирования ссылки на корзину).",
	robots: { index: false, follow: false },
	alternates: { canonical: "/shop/share/" },
};

export default function ShareShop(): ReactElement {
	return <ShopBrandsPage shareMode />;
}
