import type { ReactElement } from "react";
import type { Metadata } from "next";

import { ConsentPage } from "@/widgets/Pages/Consent/ConsentPage";
import { JsonLd, getBreadcrumbsSchema } from "@/shared/seo";

export const metadata: Metadata = {
  title: "Skin&Body — Согласие на обработку ПД",
  description:
    "Согласие субъекта персональных данных на обработку данных оператором ИП Иванова Анна Сергеевна (skinandbody.ru).",
  alternates: {
    canonical: "/consent/",
  },
  openGraph: {
    title: "Skin&Body — Согласие на обработку ПД",
    description: "Согласие субъекта персональных данных на сайте Skin&Body.",
    url: "/consent/",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
  },
};

export default function Consent(): ReactElement {
  return (
    <>
      <JsonLd
        data={getBreadcrumbsSchema([
          { name: "Главная", url: "/" },
          { name: "Согласие на обработку персональных данных", url: "/consent" },
        ])}
      />
      <ConsentPage />
    </>
  );
}
