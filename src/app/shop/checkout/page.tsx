import type { ReactElement } from "react";
import type { Metadata } from "next";

import { CheckoutForm } from "@/features/checkout/CheckoutForm";

export const metadata: Metadata = {
	title: "Оформление заказа — Skin&Body",
	description: "Оформление заказа в магазине Skin&Body.",
	robots: { index: false, follow: false },
	alternates: {
		canonical: "/shop/checkout/",
	},
};

export default function Checkout(): ReactElement {
	return <CheckoutForm />;
}
