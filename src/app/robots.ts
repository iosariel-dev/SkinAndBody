import type { MetadataRoute } from "next";

import { config } from "@/shared/config";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			// honeypot для парсеров + служебный путь шаринга корзины
			disallow: ["/trap.php", "/shop/share/"],
		},
		sitemap: `${config.SITE_URL}/sitemap.xml`,
		host: config.SITE_URL,
	};
}
