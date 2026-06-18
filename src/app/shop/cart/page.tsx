import type { ReactElement } from "react";
import type { Metadata } from "next";

import { CartPage } from "@/widgets/Pages/Shop/CartPage";

export const metadata: Metadata = {
	title: "Корзина — Skin&Body",
	description: "Ваша корзина в магазине домашнего ухода Skin&Body.",
	robots: { index: false, follow: true },
	alternates: {
		canonical: "/shop/cart/",
	},
};

export default function Cart(): ReactElement {
	return <CartPage />;
}
