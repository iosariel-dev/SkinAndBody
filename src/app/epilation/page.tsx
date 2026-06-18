import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Лазерная эпиляция в Ульяновске — от 600 ₽",
	description:
		"Аппаратная методика удаления волос. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/epilation/",
	},
	openGraph: {
		title: "Лазерная эпиляция в Ульяновске — от 600 ₽",
		description:
			"Аппаратная методика удаления волос. Студия косметологии Skin&Body в Ульяновске.",
		url: "/epilation/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function EpilationPage(): ReactElement {
	const data = getServiceData("epilation")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"Лазерная эпиляция",
					"Аппаратная методика удаления волос. Студия косметологии Skin&Body в Ульяновске.",
					"epilation",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
