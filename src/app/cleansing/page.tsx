import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Чистка лица в Ульяновске — от 1 700 ₽",
	description:
		"Это глубокое очищение кожи от различных загрязнений, отмерших клеток, забитых сальных желез, жира. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/cleansing/",
	},
	openGraph: {
		title: "Чистка лица в Ульяновске — от 1 700 ₽",
		description:
			"Это глубокое очищение кожи от различных загрязнений, отмерших клеток, забитых сальных желез, жира. Студия косметологии Skin&Body в Ульяновске.",
		url: "/cleansing/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function CleansingPage(): ReactElement {
	const data = getServiceData("cleansing")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"Чистки",
					"Это глубокое очищение кожи от различных загрязнений, отмерших клеток, забитых сальных желез, жира. Студия косметологии Skin&Body в Ульяновске.",
					"cleansing",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
