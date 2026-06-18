import { execSync } from "node:child_process";
import { statSync } from "node:fs";
import { resolve } from "node:path";

import type { MetadataRoute } from "next";

import { getAllBrandSlugs, getAllProductSlugs } from "@/entities/product";
import { config } from "@/shared/config";

export const dynamic = "force-static";

const SITE_URL = config.SITE_URL;
const PROJECT_ROOT = resolve(process.cwd());

function fileMtime(relPath: string): Date | null {
	const abs = resolve(PROJECT_ROOT, relPath);
	try {
		const gitOut = execSync(`git log -1 --format=%cI -- "${relPath}"`, {
			cwd: PROJECT_ROOT,
			stdio: ["ignore", "pipe", "ignore"],
		})
			.toString()
			.trim();
		if (gitOut) return new Date(gitOut);
	} catch {
		// fall through to fs
	}
	try {
		return statSync(abs).mtime;
	} catch {
		return null;
	}
}

function maxMtime(...paths: string[]): Date {
	const stamps = paths
		.map(fileMtime)
		.filter((d): d is Date => d !== null);
	if (stamps.length === 0) return new Date();
	return new Date(Math.max(...stamps.map((d) => d.getTime())));
}

export default function sitemap(): MetadataRoute.Sitemap {
	const services = [
		"epilation",
		"depilation",
		"cleansing",
		"peelings",
		"rflifting",
		"microcurrenttherapy",
		"lpg",
		"vacuum",
		"ems",
	];

	// trailingSlash:true в next.config — URL должны заканчиваться на `/`,
	// иначе Google при заходе с sitemap получит 308 редирект.
	const staticPages = [
		{
			url: `${SITE_URL}/`,
			priority: 1.0,
			changeFrequency: "weekly" as const,
			lastModified: maxMtime(
				"src/app/page.tsx",
				"src/widgets/Pages/Home/HomePage.tsx",
				"src/widgets/Pages/Home/HomePage.module.scss",
			),
		},
		{
			url: `${SITE_URL}/privacy/`,
			priority: 0.3,
			changeFrequency: "yearly" as const,
			lastModified: maxMtime(
				"src/app/privacy/page.tsx",
				"src/widgets/Pages/Privacy/PrivacyPage.tsx",
			),
		},
		{
			url: `${SITE_URL}/document/`,
			priority: 0.3,
			changeFrequency: "yearly" as const,
			lastModified: maxMtime(
				"src/app/document/page.tsx",
				"src/widgets/Pages/Document/DocumentPage.tsx",
			),
		},
		{
			url: `${SITE_URL}/installments/`,
			priority: 0.7,
			changeFrequency: "monthly" as const,
			lastModified: maxMtime(
				"src/app/installments/page.tsx",
				"src/widgets/Pages/Installments/InstallmentsPage.tsx",
				"src/widgets/Pages/Installments/InstallmentsPage.module.scss",
			),
		},
		{
			url: `${SITE_URL}/abonementy/`,
			priority: 0.7,
			changeFrequency: "monthly" as const,
			lastModified: maxMtime(
				"src/app/abonementy/page.tsx",
				"src/widgets/Pages/Abonementy/AbonementyPage.tsx",
				"src/widgets/Pages/Abonementy/AbonementyPage.module.scss",
			),
		},
		{
			url: `${SITE_URL}/sertifikaty/`,
			priority: 0.7,
			changeFrequency: "monthly" as const,
			lastModified: maxMtime(
				"src/app/sertifikaty/page.tsx",
				"src/widgets/Pages/Sertifikaty/SertifikatyPage.tsx",
				"src/widgets/Pages/Sertifikaty/SertifikatyPage.module.scss",
			),
		},
		{
			url: `${SITE_URL}/consent/`,
			priority: 0.3,
			changeFrequency: "yearly" as const,
			lastModified: maxMtime(
				"src/app/consent/page.tsx",
				"src/widgets/Pages/Consent/ConsentPage.tsx",
			),
		},
	];

	const servicePages = services.map((slug) => ({
		url: `${SITE_URL}/${slug}/`,
		priority: 0.8,
		changeFrequency: "monthly" as const,
		lastModified: maxMtime(
			`src/app/${slug}/page.tsx`,
			`src/entities/service/data/${slug}.json`,
		),
	}));

	// Магазин (открыт к индексации): витрина брендов, бренд-каталоги, товары,
	// оферта. Корзина/checkout/success/fail остаются noindex и вне sitemap.
	const catalogMtime = maxMtime("src/entities/product/data/products.json");
	const shopPages = [
		{
			url: `${SITE_URL}/shop/`,
			priority: 0.8,
			changeFrequency: "weekly" as const,
			lastModified: catalogMtime,
		},
		...getAllBrandSlugs().map((slug) => ({
			url: `${SITE_URL}/shop/brand/${slug}/`,
			priority: 0.8,
			changeFrequency: "weekly" as const,
			lastModified: catalogMtime,
		})),
		{
			url: `${SITE_URL}/shop/oferta/`,
			priority: 0.3,
			changeFrequency: "yearly" as const,
			lastModified: maxMtime("src/widgets/Pages/Shop/OfertaPage.tsx"),
		},
		...getAllProductSlugs().map((slug) => ({
			url: `${SITE_URL}/shop/${slug}/`,
			priority: 0.6,
			changeFrequency: "monthly" as const,
			lastModified: catalogMtime,
		})),
	];

	return [...staticPages, ...servicePages, ...shopPages];
}
