import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Пилинги для лица в Ульяновске — от 1 700 ₽",
	description:
		"Процедура обновления, лифтинга и очистки кожи с помощью косметических средств с кислотой в составе. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/peelings/",
	},
	openGraph: {
		title: "Пилинги для лица в Ульяновске — от 1 700 ₽",
		description:
			"Процедура обновления, лифтинга и очистки кожи с помощью косметических средств с кислотой в составе. Студия косметологии Skin&Body в Ульяновске.",
		url: "/peelings/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function PeelingsPage(): ReactElement {
	const data = getServiceData("peelings")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"Пилинги",
					"Процедура обновления, лифтинга и очистки кожи с помощью косметических средств с кислотой в составе. Студия косметологии Skin&Body в Ульяновске.",
					"peelings",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
