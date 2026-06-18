import type { ReactElement } from "react";
import type { Metadata } from "next";

import { SertifikatyPage } from "@/widgets/Pages/Sertifikaty/SertifikatyPage";
import { JsonLd, getBreadcrumbsSchema } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Подарочные сертификаты в студию эстетики — Ульяновск",
	description:
		"Подарочные сертификаты студии эстетики Skin&Body в Ульяновске. На любой номинал, услугу или комплекс. Действуют 6 месяцев, можно онлайн или бумажный.",
	alternates: {
		canonical: "/sertifikaty/",
	},
	openGraph: {
		title: "Подарочные сертификаты в студию эстетики — Ульяновск",
		description:
			"Подарок на любой номинал, услугу или комплекс. Действует 6 месяцев. Онлайн или бумажный в фирменной обложке.",
		url: "/sertifikaty/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function Sertifikaty(): ReactElement {
	return (
		<>
			<JsonLd
				data={getBreadcrumbsSchema([
					{ name: "Главная", url: "/" },
					{ name: "Сертификаты", url: "/sertifikaty" },
				])}
			/>
			<SertifikatyPage />
		</>
	);
}
