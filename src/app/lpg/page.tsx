import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "LPG-массаж в Ульяновске — от 1 000 ₽",
	description:
		"Аппаратная методика коррекции фигуры. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/lpg/",
	},
	openGraph: {
		title: "LPG-массаж в Ульяновске — от 1 000 ₽",
		description:
			"Аппаратная методика коррекции фигуры. Студия косметологии Skin&Body в Ульяновске.",
		url: "/lpg/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function LpgPage(): ReactElement {
	const data = getServiceData("lpg")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"LPG",
					"Аппаратная методика коррекции фигуры. Студия косметологии Skin&Body в Ульяновске.",
					"lpg",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
