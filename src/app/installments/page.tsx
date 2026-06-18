import type { ReactElement } from "react";
import type { Metadata } from "next";

import { InstallmentsPage } from "@/widgets/Pages/Installments/InstallmentsPage";
import { JsonLd, getBreadcrumbsSchema } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Рассрочка на курсы процедур в Ульяновске",
	description:
		"Внутренняя рассрочка на абонементы Skin&Body — лазерная эпиляция, LPG, RF-лифтинг, EMS, микротоковая терапия, вакуум. 2 или 3 платежа без процентов и переплат, без банков, по письменному договору.",
	alternates: {
		canonical: "/installments/",
	},
	openGraph: {
		title: "Рассрочка на курсы процедур в Ульяновске",
		description:
			"Абонемент в рассрочку без процентов и без банков. 2 или 3 платежа по внутреннему договору.",
		url: "/installments/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function Installments(): ReactElement {
	return (
		<>
			<JsonLd
				data={getBreadcrumbsSchema([
					{ name: "Главная", url: "/" },
					{ name: "Рассрочка", url: "/installments" },
				])}
			/>
			<InstallmentsPage />
		</>
	);
}
