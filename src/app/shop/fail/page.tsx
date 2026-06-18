import type { ReactElement } from "react";
import type { Metadata } from "next";

import { OrderResultPage } from "@/widgets/Pages/Shop/OrderResultPage";

export const metadata: Metadata = {
	title: "Оплата не завершена — Skin&Body",
	robots: { index: false, follow: false },
};

export default function Fail(): ReactElement {
	return <OrderResultPage variant="fail" />;
}
