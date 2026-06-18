import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Вакуумный массаж + RF-лифтинг в Ульяновске — от 1 500 ₽",
	description:
		"Аппаратная методика коррекции фигуры. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/vacuum/",
	},
	openGraph: {
		title: "Вакуумный массаж + RF-лифтинг в Ульяновске — от 1 500 ₽",
		description:
			"Аппаратная методика коррекции фигуры. Студия косметологии Skin&Body в Ульяновске.",
		url: "/vacuum/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function VacuumPage(): ReactElement {
	const data = getServiceData("vacuum")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"Вакуум + RFлифтинг",
					"Аппаратная методика коррекции фигуры. Студия косметологии Skin&Body в Ульяновске.",
					"vacuum",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
