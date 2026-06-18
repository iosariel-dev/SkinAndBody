// Генерирует public/catalog.json из entities/product/data/products.json.
// Это СЕРВЕРНЫЙ источник цен для create-payment.php — суммы платежа
// пересчитываются на сервере по нему, цене из браузера не доверяем.
// Запускается перед `next build`.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(process.cwd());
const SRC = resolve(ROOT, "src/entities/product/data/products.json");
const OUT = resolve(ROOT, "public/catalog.json");

function parsePrice(price) {
	const digits = String(price).replace(/\D+/g, "");
	const n = parseInt(digits, 10);
	return Number.isFinite(n) ? n : 0;
}

const products = JSON.parse(readFileSync(SRC, "utf8"));

const catalog = {};
for (const p of products) {
	const entry = {
		name: p.name,
		brand: p.brand,
		price: parsePrice(p.price), // рубли, целое (основной вариант)
		availability: p.availability === "on_order" ? "on_order" : "in_stock",
	};
	// Цены вариантов по объёму — для серверной валидации выбранного объёма.
	if (Array.isArray(p.variants) && p.variants.length > 0) {
		entry.variants = {};
		for (const v of p.variants) entry.variants[v.volume] = parsePrice(v.price);
	}
	catalog[p.slug] = entry;
}

writeFileSync(OUT, JSON.stringify(catalog, null, 2) + "\n", "utf8");
console.log(`catalog.json: ${Object.keys(catalog).length} товаров → ${OUT}`);
