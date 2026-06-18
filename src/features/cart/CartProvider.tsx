"use client";

import type { ReactNode, ReactElement, CSSProperties } from "react";
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import { getProduct } from "@/entities/product";
import type { ProductData } from "@/entities/product";

const STORAGE_KEY = "sb_cart_v2";

export interface CartLine {
	slug: string;
	volume: string; // выбранный объём (для товаров без вариантов = основной объём)
	qty: number;
}

export interface CartLineDetailed {
	product: ProductData;
	volume: string;
	qty: number;
	unitPrice: number;
	lineTotal: number;
}

interface CartContextValue {
	items: CartLine[];
	detailed: CartLineDetailed[];
	count: number;
	total: number;
	totalFormatted: string;
	hydrated: boolean;
	isOpen: boolean;
	add: (slug: string, volume: string, qty?: number) => void;
	remove: (slug: string, volume: string) => void;
	setQty: (slug: string, volume: string, qty: number) => void;
	clear: () => void;
	openCart: () => void;
	closeCart: () => void;
}

function parsePrice(price: string): number {
	const digits = price.replace(/\D+/g, "");
	const n = parseInt(digits, 10);
	return Number.isFinite(n) ? n : 0;
}

export function formatPrice(n: number): string {
	return `${n.toLocaleString("ru-RU")} ₽`;
}

// Цена единицы товара с учётом выбранного объёма (вариант или основная).
function unitPriceOf(product: ProductData, volume: string): number {
	const variant = product.variants?.find((v) => v.volume === volume);
	return parsePrice(variant ? variant.price : product.price);
}

const noop = () => {};
const CartContext = createContext<CartContextValue>({
	items: [],
	detailed: [],
	count: 0,
	total: 0,
	totalFormatted: formatPrice(0),
	hydrated: false,
	isOpen: false,
	add: noop,
	remove: noop,
	setQty: noop,
	clear: noop,
	openCart: noop,
	closeCart: noop,
});

const same = (l: CartLine, slug: string, volume: string): boolean =>
	l.slug === slug && l.volume === volume;

// ===== Шаринг корзины ссылкой (?c=slug:объём:кол-во;…) =====

// Список объёмов товара (варианты или единственный основной).
function volumesOf(product: ProductData): string[] {
	return product.variants?.length
		? product.variants.map((v) => v.volume)
		: [product.volume];
}

// Кодирует состав корзины в КОМПАКТНУЮ URL-безопасную строку (без %-кодирования):
//   позиции через "!", поля через "~"; объём — индексом варианта.
//   Обычный товар (1 шт, основной объём) = просто slug.
//   Иначе slug~qty~индексОбъёма.
export function encodeCart(items: CartLine[]): string {
	return items
		.map((l) => {
			const product = getProduct(l.slug);
			const vIdx = product ? Math.max(0, volumesOf(product).indexOf(l.volume)) : 0;
			if (l.qty === 1 && vIdx === 0) return l.slug;
			return `${l.slug}~${l.qty}~${vIdx}`;
		})
		.join("!");
}

// Разбирает строку из ?c= (новый формат slug~qty~idx через "!"; поддержан и
// старый slug:объём:qty через ";"). Оставляет только валидные позиции из каталога.
export function decodeCart(c: string): CartLine[] {
	const out: CartLine[] = [];
	for (const part of c.split(/[!;]/)) {
		if (!part) continue;
		let slug = "";
		let qty = 1;
		let volume: string | null = null;
		if (part.includes(":")) {
			// старый формат: slug:объём:qty
			const seg = part.split(":");
			if (seg.length < 3) continue;
			slug = seg[0];
			qty = parseInt(seg[seg.length - 1], 10);
			volume = seg.slice(1, -1).join(":");
		} else {
			// новый формат: slug[~qty~idx]
			const seg = part.split("~");
			slug = seg[0];
			qty = seg[1] ? parseInt(seg[1], 10) : 1;
			const vIdx = seg[2] ? parseInt(seg[2], 10) : 0;
			const product = getProduct(slug);
			if (!product) continue;
			const vols = volumesOf(product);
			volume = vols[vIdx] ?? vols[0];
		}
		if (!slug || !Number.isFinite(qty) || qty < 1) continue;
		const product = getProduct(slug);
		if (!product) continue;
		const validVolume =
			volume === product.volume ||
			(product.variants?.some((v) => v.volume === volume) ?? false);
		if (!validVolume) continue;
		out.push({
			slug,
			volume: volume as string,
			qty: Math.min(99, Math.max(1, Math.floor(qty))),
		});
	}
	return out;
}

export function mergeCarts(base: CartLine[], extra: CartLine[]): CartLine[] {
	const result = base.map((l) => ({ ...l }));
	for (const line of extra) {
		const existing = result.find((l) => same(l, line.slug, line.volume));
		if (existing) existing.qty = Math.min(99, existing.qty + line.qty);
		else result.push({ ...line });
	}
	return result;
}

export function CartProvider({ children }: { children: ReactNode }): ReactElement {
	const [items, setItems] = useState<CartLine[]>([]);
	const [hydrated, setHydrated] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	// Корзина из ссылки (?c=…), когда у пользователя уже непустая корзина —
	// показываем диалог «заменить / добавить / отмена».
	const [incoming, setIncoming] = useState<CartLine[] | null>(null);

	// Гидрация корзины на маунте из внешних источников (localStorage + ?c= в URL) —
	// читать их во время SSR нельзя, поэтому это легитимный setState-in-effect
	// (одноразовый импорт из внешней системы). Документированное исключение правила.
	/* eslint-disable react-hooks/set-state-in-effect */
	useEffect(() => {
		// 1. Текущая корзина из localStorage.
		let stored: CartLine[] = [];
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed: unknown = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					stored = parsed
						.filter(
							(l): l is CartLine =>
								typeof l?.slug === "string" &&
								typeof l?.volume === "string" &&
								typeof l?.qty === "number",
						)
						.map((l) => ({
							slug: l.slug,
							volume: l.volume,
							qty: Math.max(1, Math.floor(l.qty)),
						}));
				}
			}
		} catch {
			// ignore corrupt storage
		}

		// 2. Корзина из ссылки (?c=…) — валидируем по каталогу, чистим URL.
		let shared: CartLine[] = [];
		try {
			const sp = new URLSearchParams(window.location.search);
			const c = sp.get("c");
			if (c) {
				shared = decodeCart(c);
				sp.delete("c");
				const qs = sp.toString();
				window.history.replaceState(
					null,
					"",
					window.location.pathname + (qs ? `?${qs}` : "") + window.location.hash,
				);
			}
		} catch {
			// ignore
		}

		if (shared.length > 0 && stored.length > 0) {
			// у пользователя уже есть корзина — спросим, что делать
			setItems(stored);
			setIncoming(shared);
		} else if (shared.length > 0) {
			// пустая корзина — просто загружаем присланную
			setItems(shared);
		} else {
			setItems(stored);
		}
		setHydrated(true);
	}, []);
	/* eslint-enable react-hooks/set-state-in-effect */

	useEffect(() => {
		if (!hydrated) return;
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
		} catch {
			// ignore quota errors
		}
	}, [items, hydrated]);

	const add = useCallback((slug: string, volume: string, qty = 1) => {
		setItems((prev) => {
			const existing = prev.find((l) => same(l, slug, volume));
			if (existing) {
				return prev.map((l) =>
					same(l, slug, volume) ? { ...l, qty: l.qty + qty } : l,
				);
			}
			return [...prev, { slug, volume, qty }];
		});
	}, []);

	const remove = useCallback((slug: string, volume: string) => {
		setItems((prev) => prev.filter((l) => !same(l, slug, volume)));
	}, []);

	const setQty = useCallback((slug: string, volume: string, qty: number) => {
		setItems((prev) =>
			qty <= 0
				? prev.filter((l) => !same(l, slug, volume))
				: prev.map((l) => (same(l, slug, volume) ? { ...l, qty } : l)),
		);
	}, []);

	const clear = useCallback(() => setItems([]), []);
	const openCart = useCallback(() => setIsOpen(true), []);
	const closeCart = useCallback(() => setIsOpen(false), []);

	// Решения по присланной корзине.
	const acceptReplace = useCallback(() => {
		setIncoming((inc) => {
			if (inc) setItems(inc);
			return null;
		});
	}, []);
	const acceptMerge = useCallback(() => {
		setIncoming((inc) => {
			if (inc) setItems((prev) => mergeCarts(prev, inc));
			return null;
		});
	}, []);
	const dismissIncoming = useCallback(() => setIncoming(null), []);

	const { detailed, count, total } = useMemo(() => {
		const det: CartLineDetailed[] = [];
		let cnt = 0;
		let sum = 0;
		for (const line of items) {
			const product = getProduct(line.slug);
			cnt += line.qty;
			if (!product) continue; // товар убрали из каталога
			const volume = line.volume || product.volume;
			const unitPrice = unitPriceOf(product, volume);
			const lineTotal = unitPrice * line.qty;
			sum += lineTotal;
			det.push({ product, volume, qty: line.qty, unitPrice, lineTotal });
		}
		return { detailed: det, count: cnt, total: sum };
	}, [items]);

	const value: CartContextValue = {
		items,
		detailed,
		count,
		total,
		totalFormatted: formatPrice(total),
		hydrated,
		isOpen,
		add,
		remove,
		setQty,
		clear,
		openCart,
		closeCart,
	};

	return (
		<CartContext.Provider value={value}>
			{children}
			{incoming && (
				<SharedCartDialog
					count={incoming.reduce((s, l) => s + l.qty, 0)}
					onReplace={acceptReplace}
					onMerge={acceptMerge}
					onCancel={dismissIncoming}
				/>
			)}
		</CartContext.Provider>
	);
}

// Диалог при открытии ссылки-корзины, когда у пользователя уже есть товары.
function SharedCartDialog({
	count,
	onReplace,
	onMerge,
	onCancel,
}: {
	count: number;
	onReplace: () => void;
	onMerge: () => void;
	onCancel: () => void;
}): ReactElement {
	const overlay: CSSProperties = {
		position: "fixed",
		inset: 0,
		background: "rgba(44, 40, 38, 0.55)",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		zIndex: 1000,
		padding: 20,
	};
	const box: CSSProperties = {
		background: "#fff",
		borderRadius: 16,
		padding: "28px 26px",
		maxWidth: 420,
		width: "100%",
		boxShadow: "0 8px 32px rgba(44, 40, 38, 0.2)",
		fontFamily: "var(--font-body), sans-serif",
		color: "#2c2826",
	};
	const btn: CSSProperties = {
		display: "block",
		width: "100%",
		padding: "13px 18px",
		marginTop: 10,
		borderRadius: 50,
		border: "none",
		fontSize: 14,
		fontWeight: 600,
		cursor: "pointer",
	};
	return (
		<div
			style={overlay}
			role="dialog"
			aria-modal="true"
			onClick={onCancel}
		>
			<div style={box} onClick={(e) => e.stopPropagation()}>
				<h3 style={{ fontSize: 19, margin: "0 0 8px" }}>Корзина из ссылки</h3>
				<p style={{ fontSize: 14, lineHeight: 1.5, color: "#7d7570", margin: "0 0 18px" }}>
					Вам прислали корзину ({count} шт). В вашей корзине уже есть товары.
					Что сделать?
				</p>
				<button
					type="button"
					style={{ ...btn, background: "#b28b85", color: "#fff" }}
					onClick={onReplace}
				>
					Заменить мою корзину
				</button>
				<button
					type="button"
					style={{ ...btn, background: "#f7f0ed", color: "#2c2826" }}
					onClick={onMerge}
				>
					Добавить к моей корзине
				</button>
				<button
					type="button"
					style={{ ...btn, background: "transparent", color: "#7d7570", marginTop: 4 }}
					onClick={onCancel}
				>
					Отмена
				</button>
			</div>
		</div>
	);
}

export function useCart(): CartContextValue {
	return useContext(CartContext);
}
