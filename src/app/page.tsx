import type { ReactElement } from "react";

import { HomePage } from "@/widgets/Pages/Home/HomePage";
import {
  JsonLd,
  getOrganizationSchema,
  getLocalBusinessSchema,
} from "@/shared/seo";

export default function Page(): ReactElement {
  return (
    <>
      <JsonLd
        data={[
          getOrganizationSchema(),
          getLocalBusinessSchema("red"),
          getLocalBusinessSchema("okt"),
        ]}
      />
      <HomePage />
    </>
  );
}
