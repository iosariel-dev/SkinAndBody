import type { ReactElement } from "react";

import type { Metadata } from "next";

import { DocumentPage } from "@/widgets/Pages/Document/DocumentPage";
import { JsonLd, getBreadcrumbsSchema } from "@/shared/seo";

export const metadata: Metadata = {
  title: "Skin&Body — Документы и сертификаты",
  description:
    "Сертификаты соответствия оборудования студии эстетики Skin&Body. Документы на аппараты лазерной эпиляции, LPG, RF-лифтинга, микротоковой терапии.",
  alternates: {
    canonical: "/document/",
  },
  openGraph: {
    title: "Skin&Body — Документы и сертификаты",
    description:
      "Сертификаты соответствия оборудования студии Skin&Body.",
    url: "/document/",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
  },
};

export default function Document(): ReactElement {
  return (
    <>
      <JsonLd
        data={getBreadcrumbsSchema([
          { name: "Главная", url: "/" },
          { name: "Документы", url: "/document" },
        ])}
      />
      <DocumentPage />
    </>
  );
}
