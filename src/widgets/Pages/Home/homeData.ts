import type { CSSProperties } from "react";

import promosData from "@/entities/promo/data/promos.json";
import specialistsData from "@/entities/specialist/data/specialists.json";
import locationsData from "@/entities/location/data/locations.json";
import brandsData from "@/entities/product/data/brands.json";

import { getServiceFromPrice } from "@/entities/service";
import type { Promo } from "@/entities/promo/types";
import type { Specialist } from "@/entities/specialist/types";
import type { Location } from "@/entities/location/types";

export const promos = promosData as Promo[];
export const locations = locationsData as Location[];
export const specialists = specialistsData as Record<string, Specialist[]>;
export const shopBrands = brandsData as { slug: string; title: string; logo: string }[];

// Контент-обзор услуг на главной. Цена НЕ хранится здесь — выводится из прайса
// услуги (entities/service) по slug из href → единый источник, без дрейфа.
const servicesRaw = [
	{
		label: "Удаление волос",
		title: "Лазер и депиляция",
		items: [
			{ name: "Лазерная эпиляция", desc: "Диодный лазер, постоянный результат, все типы кожи", unit: "за зону", href: "/epilation/" },
			{ name: "Депиляция", desc: "Воск, паста, мягкие материалы — любая зона", unit: "за зону", href: "/depilation/" },
		],
	},
	{
		label: "Уход за лицом",
		title: "Чистота и сияние",
		items: [
			{ name: "Чистка лица", desc: "Ультразвуковая, механическая, комбинированная", unit: "за процедуру", href: "/cleansing/" },
			{ name: "Пилинги", desc: "Mediderma, BioRePeelCl3, PRX-T, Peach Peel", unit: "за процедуру", href: "/peelings/" },
			{ name: "Микротоковая терапия", desc: "Лифтинг, тонус, улучшение цвета лица", unit: "за процедуру", href: "/microcurrenttherapy/" },
			{ name: "RF-лифтинг лица", desc: "Радиочастотное омоложение, подтяжка контура", unit: "за процедуру", href: "/rflifting/" },
		],
	},
	{
		label: "Тело",
		title: "Коррекция и моделирование",
		items: [
			{ name: "LPG", desc: "Аппаратный массаж, моделирование силуэта", unit: "за сеанс", href: "/lpg/" },
			{ name: "Вакуум + RF", desc: "Комбинированный аппарат, избавление от целлюлита и дряблости", unit: "за сеанс", href: "/vacuum/" },
			{ name: "EMS", desc: "Электромиостимуляция мышц, достижение рельефа и тонуса", unit: "за сеанс", href: "/ems/" },
		],
	},
];

export const services = servicesRaw.map((cat) => ({
	...cat,
	items: cat.items.map((it) => ({
		...it,
		price: getServiceFromPrice(it.href.replace(/\//g, "")),
	})),
}));

export const galleryImages = Array.from({ length: 24 }, (_, i) =>
	`/images/gallery/g${String(i + 1).padStart(2, "0")}.webp`,
);

// Per-file overrides для object-position (борьба со срезанием композиции).
// Дефолт CSS — `50% 50%`. Заполняй только проблемные файлы.
// - string: одна позиция на все брейкпойнты ("50% 25%")
// - объект: разные позиции per breakpoint (если slot меняет пропорции)
//   { default, tablet?, mobile? } — tablet/mobile fallback на default.
type PhotoPosition = string | { default?: string; tablet?: string; mobile?: string };

const photoPositions: Record<string, PhotoPosition> = {
	// Стартовые значения из аудита 2026-05-12 (Chrome Claude composition pass).
	// Точные проценты — догадка по описанию композиции; подкручивай по
	// фактическому рендеру.
	g02: "50% 30%",
	g07: "50% 20%",
	g09: "50% 30%",
	g10: "50% 20%",
	g12: "50% 30%",
	g13: { default: "50% 50%", tablet: "50% 10%", mobile: "50% 10%" },
	g14: "50% 35%",
	g18: { default: "50% 50%", tablet: "50% 15%" },
	g20: "50% 15%",
	g23: { default: "50% 50%", tablet: "50% 80%" },
};

export function getPhotoStyle(src: string): CSSProperties | undefined {
	const match = src.match(/\/([^/]+)\.webp$/);
	const key = match?.[1];
	if (!key) return undefined;
	const cfg = photoPositions[key];
	if (!cfg) return undefined;
	if (typeof cfg === "string") return { objectPosition: cfg };
	const vars: CSSProperties & Record<string, string> = {};
	if (cfg.default) vars["--op-default"] = cfg.default;
	if (cfg.tablet) vars["--op-tablet"] = cfg.tablet;
	if (cfg.mobile) vars["--op-mobile"] = cfg.mobile;
	return vars;
}

export const GALLERY_PER_PAGE = 5;
export const GALLERY_PAGE_COUNT = Math.ceil(galleryImages.length / GALLERY_PER_PAGE);

export interface GallerySlot {
	src: string;
	globalIndex: number;
}

// Same 5-slot partition concept on every viewport — на мобиле меняется только
// CSS-раскладка внутри партии (см. .gallery__grid / .gallery__item--N в SCSS).
export const galleryPages: GallerySlot[][] = Array.from({ length: GALLERY_PAGE_COUNT }, (_, p) => {
	const slots: GallerySlot[] = [];
	for (let s = 0; s < GALLERY_PER_PAGE; s++) {
		const absolute = p * GALLERY_PER_PAGE + s;
		const wrapped = absolute % galleryImages.length;
		slots.push({ src: galleryImages[wrapped], globalIndex: wrapped });
	}
	return slots;
});

export const locationKeys = ["red", "okt"] as const;
