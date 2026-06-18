import type { ReactElement } from "react";

import type { Metadata } from "next";

import { PrivacyPage } from "@/widgets/Pages/Privacy/PrivacyPage";
import { JsonLd, getBreadcrumbsSchema } from "@/shared/seo";

export const metadata: Metadata = {
  title: "Skin&Body — Политика конфиденциальности",
  description:
    "Политика обработки персональных данных ИП Иванова Анна Сергеевна. Условия использования сайта skinandbody.ru.",
  alternates: {
    canonical: "/privacy/",
  },
  openGraph: {
    title: "Skin&Body — Политика конфиденциальности",
    description:
      "Политика обработки персональных данных на сайте Skin&Body.",
    url: "/privacy/",
    type: "website",
    images: [{ url: "/images/og-image.png", width: 1200, height: 630, alt: "Skin&Body" }],
  },
};

export default function Privacy(): ReactElement {
  return (
    <>
      <JsonLd
        data={getBreadcrumbsSchema([
          { name: "Главная", url: "/" },
          { name: "Политика конфиденциальности", url: "/privacy" },
        ])}
      />
      <PrivacyPage />
    </>
  );
}
