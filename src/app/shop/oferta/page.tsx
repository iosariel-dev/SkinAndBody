import type { ReactElement } from "react";
import type { Metadata } from "next";

import { OfertaPage } from "@/widgets/Pages/Shop/OfertaPage";

export const metadata: Metadata = {
	title: "Публичная оферта магазина — Skin&Body",
	description:
		"Публичная оферта о продаже товаров дистанционным способом в интернет-магазине Skin&Body: оформление заказа, оплата, доставка, возврат.",
	robots: { index: true, follow: true },
	alternates: {
		canonical: "/shop/oferta/",
	},
};

export default function Oferta(): ReactElement {
	return <OfertaPage />;
}
