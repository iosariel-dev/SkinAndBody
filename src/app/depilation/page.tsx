import type { ReactElement } from "react";

import type { Metadata } from "next";

import { getServiceData } from "@/entities/service";
import { ServicePage } from "@/widgets/ServicePage";
import { JsonLd, getServicePageSchemas } from "@/shared/seo";

export const metadata: Metadata = {
	title: "Депиляция и шугаринг в Ульяновске — от 250 ₽",
	description:
		"Сахарная, восковая и полимерная депиляция. Студия косметологии Skin&Body в Ульяновске.",
	alternates: {
		canonical: "/depilation/",
	},
	openGraph: {
		title: "Депиляция и шугаринг в Ульяновске — от 250 ₽",
		description:
			"Сахарная, восковая и полимерная депиляция. Студия косметологии Skin&Body в Ульяновске.",
		url: "/depilation/",
		type: "website",
		images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
	},
};

export default function DepilationPage(): ReactElement {
	const data = getServiceData("depilation")!;

	return (
		<>
			<JsonLd
				data={getServicePageSchemas(
					"Депиляция",
					"Сахарная, восковая и полимерная депиляция. Студия косметологии Skin&Body в Ульяновске.",
					"depilation",
					{ offers: data.prices[0]?.items },
				)}
			/>
			<ServicePage data={data} />
		</>
	);
}
