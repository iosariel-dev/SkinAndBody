"use client";

import type { ReactElement, RefObject } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./ShopBrandsPage.module.scss";
import shopStyles from "./ShopPage.module.scss";
import { getBrands, getAllProducts, getCategoryTitle } from "@/entities/product";
import { useReveal } from "@/shared/lib/hooks/useReveal";
import { ProductCard } from "./ProductCard";

function plural(n: number): string {
	const d = n % 10;
	const dd = n % 100;
	if (dd >= 11 && dd <= 14) return "средств";
	if (d === 1) return "средство";
	if (d >= 2 && d <= 4) return "средства";
	return "средств";
}

export function ShopBrandsPage({
	shareMode = false,
}: {
	shareMode?: boolean;
}): ReactElement {
	const brands = getBrands();
	const revealRef = useReveal(true);

	// В режиме шаринга запоминаем флаг на сессию — кнопка «Поделиться ссылкой»
	// затем доступна и в корзине, и на оформлении заказа.
	useEffect(() => {
		if (shareMode) {
			try {
				sessionStorage.setItem("sb_share", "1");
			} catch {
				// ignore
			}
		}
	}, [shareMode]);

	const brandBase = shareMode ? "/shop/share/brand/" : "/shop/brand/";

	// ===== Сквозной поиск по всем брендам (только в режиме шаринга) =====
	const [query, setQuery] = useState("");
	const q = query.trim().toLowerCase();
	const searching = shareMode && q.length > 0;
	const results = searching
		? getAllProducts().filter((p) =>
				`${p.name} ${p.brand} ${getCategoryTitle(p.category)}`
					.toLowerCase()
					.includes(q),
			)
		: [];

	return (
		<div className={styles.page} ref={revealRef as RefObject<HTMLDivElement>}>
			{/* ===== HERO ===== */}
			<section className={styles.hero}>
				<div className={styles.hero__inner}>
					<div className={styles.hero__breadcrumb}>
						<Link href="/" className={styles["hero__breadcrumb-link"]}>
							Главная
						</Link>
						<span className={styles["hero__breadcrumb-sep"]}>›</span>
						<span className={styles["hero__breadcrumb-current"]}>Магазин</span>
					</div>

					<span className={styles.hero__eyebrow}>Магазин · домашний уход</span>

					<h1 className={styles.hero__heading}>
						Уход, которому <em>доверяет</em> ваш косметолог
					</h1>

					<p className={styles.hero__lead}>
						{shareMode
							? "Та же профессиональная косметика, что и в кабинете студии. Выберите бренд — или найдите нужное средство поиском по всему каталогу."
							: "Та же профессиональная косметика, что и в кабинете студии. Выберите бренд — и подберём средства под результат ваших процедур."}
					</p>

					{/* Поиск по всем брендам — только в режиме шаринга (/shop/share/) */}
					{shareMode && (
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
								placeholder="Поиск по всему каталогу — название, бренд…"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								aria-label="Поиск товаров по всем брендам"
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
					)}
				</div>
			</section>

			{searching ? (
				/* ===== РЕЗУЛЬТАТЫ ПОИСКА (сквозь все бренды) ===== */
				<section className={styles.results}>
					<p className={styles.results__count}>
						{results.length > 0
							? `Найдено: ${results.length}`
							: "Ничего не найдено — попробуйте другой запрос"}
					</p>
					{results.length > 0 && (
						<div className={shopStyles.row}>
							{results.map((product, i) => (
								<ProductCard
									key={product.slug}
									product={product}
									revealIndex={i}
									animate={false}
								/>
							))}
						</div>
					)}
				</section>
			) : (
				/* ===== BRAND CARDS ===== */
				<section className={styles.brands}>
					{/* Знак «Честный знак» — участник национальной системы маркировки */}
					<a
						href="https://честныйзнак.рф"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.mark}
						aria-label="Участник национальной системы маркировки «Честный знак»"
					>
						<Image
							src="/images/chestny-znak.webp"
							alt="Честный ЗНАК — национальная система цифровой маркировки"
							width={1050}
							height={270}
							className={styles.mark__img}
						/>
						<p className={styles.mark__text}>
							Мы — участник национальной системы цифровой маркировки «Честный
							знак». Вся продукция оригинальная; подлинность каждого товара можно
							проверить в приложении «Честный знак».
						</p>
					</a>

					<div className={styles.brands__inner}>
						{brands.map((brand) => (
							<Link
								key={brand.slug}
								href={`${brandBase}${brand.slug}/`}
								className={styles.bcard}
								aria-label={`${brand.title} — смотреть каталог`}
							>
								<div className={styles.bcard__media}>
									<Image
										src={brand.logo}
										alt={brand.title}
										fill
										sizes="(max-width: 768px) 90vw, 520px"
										className={styles.bcard__logo}
									/>
								</div>
								<div className={styles.bcard__body}>
									<h2 className={styles.bcard__srTitle}>{brand.title}</h2>
									<span className={styles.bcard__count}>
										{brand.count} {plural(brand.count)}
									</span>
									<p className={styles.bcard__tagline}>{brand.tagline}</p>
									<span className={styles.bcard__cta}>
										Смотреть каталог
										<span className={styles.bcard__arrow} aria-hidden="true">
											→
										</span>
									</span>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}
		</div>
	);
}
