import type { ReactElement } from "react";
import type { Metadata } from "next";

import { AbonementyPage } from "@/widgets/Pages/Abonementy/AbonementyPage";
import { JsonLd, getBreadcrumbsSchema } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Абонементы на процедуры со скидкой до 20% в Ульяновске",
	description:
		"Абонементы на курсы процедур в студии эстетики Skin&Body — лазерная эпиляция, LPG, RF-лифтинг, EMS, микротоковая терапия, вакуум. Курсы 5, 10 и 15 процедур со скидкой до 20%. Можно оформить в рассрочку.",
	alternates: {
		canonical: "/abonementy/",
	},
	openGraph: {
		title: "Абонементы на процедуры со скидкой до 20% в Ульяновске",
		description:
			"Курсы процедур 5, 10 и 15 сеансов со скидкой до 20%. Возможна рассрочка.",
		url: "/abonementy/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function Abonementy(): ReactElement {
	return (
		<>
			<JsonLd
				data={getBreadcrumbsSchema([
					{ name: "Главная", url: "/" },
					{ name: "Абонементы", url: "/abonementy" },
				])}
			/>
			<AbonementyPage />
		</>
	);
}
