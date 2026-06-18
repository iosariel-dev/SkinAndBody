"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./CartPage.module.scss";
import { useCart, formatPrice, encodeCart } from "@/features/cart/CartProvider";
import { useShareMode } from "@/shared/lib/hooks/useShareMode";

export function CartPage(): ReactElement {
	const {
		items,
		detailed,
		totalFormatted,
		count,
		hydrated,
		setQty,
		remove,
		clear,
	} = useCart();

	const [copied, setCopied] = useState(false);

	// Кнопка «Поделиться ссылкой» в корзине — если пользователь в режиме шаринга
	// (был на /shop/share/*, флаг записан в sessionStorage).
	const shareMode = useShareMode();

	const shareCart = (): void => {
		// Собираем вручную: encodeCart даёт только URL-безопасные символы
		// (a-z0-9-~!), URLSearchParams их бы перекодировал в %XX.
		const link = `${window.location.origin}/shop/cart/?c=${encodeCart(items)}`;
		void navigator.clipboard?.writeText(link).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2500);
		});
	};

	// До гидрации localStorage не прочитан — не мигаем пустотой/мисматчем.
	if (!hydrated) {
		return (
			<div className={styles.page}>
				<div className={styles.container}>
					<div className={styles.loading}>Загружаем корзину…</div>
				</div>
			</div>
		);
	}

	if (count === 0) {
		return (
			<div className={styles.page}>
				<div className={styles.container}>
					<h1 className={styles.title}>Корзина</h1>
					<div className={styles.empty}>
						<p className={styles.empty__text}>В корзине пока ничего нет.</p>
						<Link href="/shop/" className={styles.empty__link}>
							Перейти в магазин
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<nav className={styles.crumbs} aria-label="Хлебные крошки">
					<Link href="/shop/" className={styles.crumbs__link}>
						Магазин
					</Link>
					<span className={styles.crumbs__sep}>/</span>
					<span className={styles.crumbs__current}>Корзина</span>
				</nav>

				<h1 className={styles.title}>Корзина</h1>

				<div className={styles.layout}>
					{/* Список позиций */}
					<div className={styles.list}>
						{detailed.map(({ product, volume, qty, lineTotal }) => (
							<div key={`${product.slug}__${volume}`} className={styles.line}>
								<div className={styles.line__media}>
									{product.images[0] ? (
										<Image
											src={product.images[0]}
											alt={product.name}
											fill
											sizes="96px"
											className={styles.line__img}
										/>
									) : (
										<div className={styles.ph} aria-hidden="true" />
									)}
								</div>

								<div className={styles.line__info}>
									<span className={styles.line__brand}>{product.brand}</span>
									<Link
										href={`/shop/${product.slug}/`}
										className={styles.line__name}
									>
										{product.name}
									</Link>
									<span className={styles.line__vol}>{volume}</span>
									{product.availability === "on_order" && (
										<span className={styles.line__order}>Под заказ</span>
									)}
								</div>

								<div className={styles.stepper}>
									<button
										type="button"
										className={styles.stepper__btn}
										onClick={() => setQty(product.slug, volume, qty - 1)}
										aria-label="Уменьшить количество"
									>
										−
									</button>
									<span className={styles.stepper__val}>{qty}</span>
									<button
										type="button"
										className={styles.stepper__btn}
										onClick={() => setQty(product.slug, volume, qty + 1)}
										aria-label="Увеличить количество"
									>
										+
									</button>
								</div>

								<div className={styles.line__price}>
									<span className={styles.line__total}>
										{formatPrice(lineTotal)}
									</span>
									<button
										type="button"
										className={styles.line__remove}
										onClick={() => remove(product.slug, volume)}
									>
										Удалить
									</button>
								</div>
							</div>
						))}

						<button type="button" className={styles.clear} onClick={clear}>
							Очистить корзину
						</button>
					</div>

					{/* Итог */}
					<aside className={styles.summary}>
						<h2 className={styles.summary__title}>Ваш заказ</h2>
						<div className={styles.summary__row}>
							<span>Товары · {count} шт</span>
							<span>{totalFormatted}</span>
						</div>
						<div className={styles.summary__row}>
							<span>Доставка</span>
							<span className={styles.summary__muted}>рассчитаем отдельно</span>
						</div>
						<div className={styles.summary__divider} />
						<div className={`${styles.summary__row} ${styles["summary__row--total"]}`}>
							<span>Итого</span>
							<span className={styles.summary__total}>{totalFormatted}</span>
						</div>

						<Link href="/shop/checkout/" className={styles.summary__checkout}>
							Оформить заказ
						</Link>

						{shareMode && (
							<button
								type="button"
								onClick={shareCart}
								style={{
									display: "block",
									width: "100%",
									marginTop: 10,
									padding: "13px 18px",
									borderRadius: 50,
									border: "1px solid #ede3df",
									background: copied ? "#8baf7e" : "#f7f0ed",
									color: copied ? "#fff" : "#2c2826",
									fontFamily: "var(--font-body), sans-serif",
									fontSize: 13,
									fontWeight: 600,
									cursor: "pointer",
									transition: "background .2s",
								}}
							>
								{copied ? "Ссылка скопирована ✓" : "Поделиться ссылкой"}
							</button>
						)}

						<p className={styles.summary__note}>
							Самовывоз из студии — бесплатно. Доставка по городу — по
							договорённости после оформления. Оплата онлайн при заказе.
						</p>
					</aside>
				</div>
			</div>
		</div>
	);
}
