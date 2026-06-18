"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

import styles from "./ShopPage.module.scss";
import { getProductsByCategory } from "@/entities/product";
import type { ProductBrand } from "@/entities/product";
import { ProductCard } from "./ProductCard";

export function ShopPage({
	brand,
	shareMode = false,
}: {
	brand: ProductBrand;
	shareMode?: boolean;
}): ReactElement {
	const groups = getProductsByCategory(brand.name);
	const rootRef = useRef<HTMLDivElement>(null);

	// ===== Поиск по бренду =====
	const [query, setQuery] = useState("");
	const q = query.trim().toLowerCase();
	const searching = q.length > 0;
	const filteredGroups = searching
		? groups
				.map(({ category, items }) => ({
					category,
					items: items.filter((p) =>
						`${p.name} ${p.brand} ${category.title}`.toLowerCase().includes(q),
					),
				}))
				.filter(({ items }) => items.length > 0)
		: groups;
	const foundCount = filteredGroups.reduce((n, g) => n + g.items.length, 0);

	// ===== Карусель категорий: стрелки прокрутки (ПК) =====
	const navRef = useRef<HTMLDivElement>(null);
	const [canLeft, setCanLeft] = useState(false);
	const [canRight, setCanRight] = useState(false);

	const updateArrows = (): void => {
		const el = navRef.current;
		if (!el) return;
		setCanLeft(el.scrollLeft > 4);
		setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
	};

	useEffect(() => {
		updateArrows();
		const el = navRef.current;
		if (!el) return;
		const onResize = (): void => updateArrows();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, []);

	const scrollNav = (dir: 1 | -1): void => {
		const el = navRef.current;
		if (!el) return;
		el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.7, 200), behavior: "smooth" });
	};

	// В режиме поиска снимаем инлайн-стили reveal-анимации (opacity:0 у карточек
	// ниже сгиба) — иначе переиспользуемые DOM-узлы остались бы невидимыми.
	useEffect(() => {
		const root = rootRef.current;
		if (!root || !searching) return;
		root
			.querySelectorAll<HTMLElement>("[data-card], [data-reveal]")
			.forEach((el) => {
				el.style.opacity = "";
				el.style.transform = "";
				el.style.transition = "";
			});
	}, [searching, foundCount]);

	useEffect(() => {
		if (shareMode) {
			try {
				sessionStorage.setItem("sb_share", "1");
			} catch {
				// ignore
			}
		}
	}, [shareMode]);

	// Появление ПО КАРТОЧКАМ (а не категориями): каждая карточка/заголовок
	// с пометкой [data-reveal] всплывает индивидуально при попадании во вьюпорт,
	// с лёгким каскадом внутри ряда (data-stagger).
	useEffect(() => {
		const root = rootRef.current;
		if (!root) return;
		const items = Array.from(
			root.querySelectorAll<HTMLElement>("[data-reveal]"),
		);
		items.forEach((el) => {
			const s = Number(el.dataset.stagger || 0);
			el.style.opacity = "0";
			el.style.transform = "translateY(28px)";
			el.style.transition = `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${s}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${s}s`;
		});
		if (items.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (!entry.isIntersecting) return;
					const el = entry.target as HTMLElement;
					const s = Number(el.dataset.stagger || 0);
					el.style.opacity = "1";
					el.style.transform = "translateY(0)";
					observer.unobserve(el);
					// После появления убираем inline transition/transform, чтобы
					// управление вернулось к CSS — иначе hover карточки срабатывает
					// резко (inline-стиль перетирает плавный transition из .ecard).
					window.setTimeout(() => {
						el.style.transition = "";
						el.style.transform = "";
					}, (0.7 + s) * 1000 + 60);
				});
			},
			{ threshold: 0, rootMargin: "0px 0px -8% 0px" },
		);
		items.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [brand.name]);

	return (
		<div className={styles.page} ref={rootRef}>
			{/* ===== HERO ===== */}
			<section className={styles.hero}>
				<div className={styles.hero__inner}>
					<div className={styles.hero__breadcrumb}>
						<Link href="/" className={styles["hero__breadcrumb-link"]}>
							Главная
						</Link>
						<span className={styles["hero__breadcrumb-sep"]}>›</span>
						<Link
							href={shareMode ? "/shop/share/" : "/shop/"}
							className={styles["hero__breadcrumb-link"]}
						>
							Магазин
						</Link>
						<span className={styles["hero__breadcrumb-sep"]}>›</span>
						<span className={styles["hero__breadcrumb-current"]}>{brand.title}</span>
					</div>

					<span className={styles.hero__eyebrow}>Бренд · домашний уход</span>

					<div className={styles.hero__titleRow}>
						<h1 className={styles.hero__heading}>{brand.title}</h1>
						{brand.heroBadge && (
							<span className={styles.hero__badge}>{brand.heroBadge}</span>
						)}
					</div>

					<p className={styles.hero__lead}>{brand.description}</p>
				</div>
			</section>

			{/* ===== CATEGORY NAV + SEARCH ===== */}
			<nav className={styles.catnav} aria-label="Категории магазина">
				<div className={styles.catnav__bar}>
					<div className={styles.catnav__scroller}>
						<button
							type="button"
							className={`${styles.catnav__arrow} ${styles["catnav__arrow--left"]}`}
							aria-label="Прокрутить категории влево"
							data-show={canLeft ? "1" : undefined}
							onClick={() => scrollNav(-1)}
						>
							‹
						</button>
						<div
							className={styles.catnav__inner}
							ref={navRef}
							onScroll={updateArrows}
						>
							{groups.map(({ category }) => (
								<a
									key={category.key}
									href={`#cat-${category.key}`}
									className={styles.chip}
								>
									{category.title}
								</a>
							))}
						</div>
						<button
							type="button"
							className={`${styles.catnav__arrow} ${styles["catnav__arrow--right"]}`}
							aria-label="Прокрутить категории вправо"
							data-show={canRight ? "1" : undefined}
							onClick={() => scrollNav(1)}
						>
							›
						</button>
					</div>

					<div className={styles.search}>
						<svg
							className={styles.search__icon}
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<path
								d="M11 4a7 7 0 1 0 4.2 12.6l4.1 4.1 1.4-1.4-4.1-4.1A7 7 0 0 0 11 4Zm0 2a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z"
								fill="currentColor"
							/>
						</svg>
						<input
							type="search"
							className={styles.search__input}
							placeholder="Поиск товаров бренда"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							aria-label="Поиск товаров бренда"
						/>
						{query && (
							<button
								type="button"
								className={styles.search__clear}
								aria-label="Очистить поиск"
								onClick={() => setQuery("")}
							>
								✕
							</button>
						)}
					</div>
				</div>
			</nav>

			{/* ===== CATEGORY SECTIONS ===== */}
			<div className={styles.catalog}>
				{searching && (
					<p className={styles.searchInfo}>
						{foundCount > 0
							? `Найдено: ${foundCount}`
							: "Ничего не найдено — попробуйте другой запрос"}
					</p>
				)}
				{filteredGroups.map(({ category, items }) => (
					<section
						key={category.key}
						id={`cat-${category.key}`}
						className={styles["cat-section"]}
					>
						<div className={styles["cat-section__head"]} data-reveal="1">
							<h2 className={styles["cat-section__title"]}>{category.title}</h2>
						</div>
						<div className={styles.row}>
							{items.map((product, i) => (
								<ProductCard
									key={product.slug}
									product={product}
									revealIndex={i}
									animate={!searching}
								/>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
