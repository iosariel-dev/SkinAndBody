import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "EMS-миостимуляция в Ульяновске — от 1 000 ₽",
	description:
		"Аппаратная методика коррекции фигуры. Стимуляция мышц и липолиз. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/ems/",
	},
	openGraph: {
		title: "EMS-миостимуляция в Ульяновске — от 1 000 ₽",
		description:
			"Аппаратная методика коррекции фигуры. Стимуляция мышц и липолиз. Студия косметологии Skin&Body в Ульяновске.",
		url: "/ems/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function EmsPage(): ReactElement {
	const data = getServiceData("ems")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"EMS",
					"Аппаратная методика коррекции фигуры. Стимуляция мышц и липолиз. Студия косметологии Skin&Body в Ульяновске.",
					"ems",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
