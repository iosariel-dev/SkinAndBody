import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Микротоковая терапия в Ульяновске — от 1 000 ₽",
	description:
		"Аппаратная методика омоложения. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/microcurrenttherapy/",
	},
	openGraph: {
		title: "Микротоковая терапия в Ульяновске — от 1 000 ₽",
		description:
			"Аппаратная методика омоложения. Студия косметологии Skin&Body в Ульяновске.",
		url: "/microcurrenttherapy/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function MicrocurrenttherapyPage(): ReactElement {
	const data = getServiceData("microcurrenttherapy")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"Микротоковая терапия",
					"Аппаратная методика омоложения. Студия косметологии Skin&Body в Ульяновске.",
					"microcurrenttherapy",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
