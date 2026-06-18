import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "RF-лифтинг лица в Ульяновске — от 1 000 ₽",
	description:
		"Аппаратная методика омоложения. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/rflifting/",
	},
	openGraph: {
		title: "RF-лифтинг лица в Ульяновске — от 1 000 ₽",
		description:
			"Аппаратная методика омоложения. Студия косметологии Skin&Body в Ульяновске.",
		url: "/rflifting/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function RfliftingPage(): ReactElement {
	const data = getServiceData("rflifting")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"RF-лифтинг лица",
					"Аппаратная методика омоложения. Студия косметологии Skin&Body в Ульяновске.",
					"rflifting",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
