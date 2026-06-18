import type { ReactElement } from "react";
import type { Metadata } from "next";

import { OrderResultPage } from "@/widgets/Pages/Shop/OrderResultPage";

export const metadata: Metadata = {
	title: "Заказ оплачен — Skin&Body",
	robots: { index: false, follow: false },
};

export default function Success(): ReactElement {
	return <OrderResultPage variant="success" />;
}
