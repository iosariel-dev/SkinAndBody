"use client";

import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./CartDrawer.module.scss";
import { useCart, formatPrice, encodeCart } from "./CartProvider";
import { useShareMode } from "@/shared/lib/hooks/useShareMode";

export function CartDrawer(): ReactElement {
	const { items, detailed, totalFormatted, isOpen, closeCart, setQty, remove } =
		useCart();

	// Кнопка «Поделиться ссылкой» — только в режиме шаринга (был на /shop/share/*,
	// флаг записан в sessionStorage). Для обычных покупателей не показываем.
	const shareMode = useShareMode();
	const [copied, setCopied] = useState(false);

	const shareCart = (): void => {
		const link = `${window.location.origin}/shop/cart/?c=${encodeCart(items)}`;
		void navigator.clipboard?.writeText(link).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2500);
		});
	};

	// Esc + блокировка скролла при открытии.
	useEffect(() => {
		if (!isOpen) return;

		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") closeCart();
		};
		document.addEventListener("keydown", onKey);
		document.body.classList.add("lock");

		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.classList.remove("lock");
		};
	}, [isOpen, closeCart]);

	const isEmpty = detailed.length === 0;

	return (
		<div
			className={`${styles.root} ${isOpen ? styles["root--open"] : ""}`}
			aria-hidden={!isOpen}
		>
			<div className={styles.overlay} onClick={closeCart} />

			<aside
				className={styles.panel}
				role="dialog"
				aria-label="Корзина"
				aria-modal="true"
			>
				<header className={styles.head}>
					<h2 className={styles.head__title}>Корзина</h2>
					<button
						type="button"
						className={styles.head__close}
						onClick={closeCart}
						aria-label="Закрыть корзину"
					>
						✕
					</button>
				</header>

				{isEmpty ? (
					<div className={styles.empty}>
						<p className={styles.empty__text}>Корзина пуста</p>
						<Link href="/shop/" className={styles.empty__link} onClick={closeCart}>
							Перейти в магазин
						</Link>
					</div>
				) : (
					<>
						<div className={styles.list}>
							{detailed.map(({ product, volume, qty, lineTotal }) => (
								<div key={`${product.slug}__${volume}`} className={styles.line}>
									<div className={styles.line__media}>
										{product.images[0] ? (
											<Image
												src={product.images[0]}
												alt={product.name}
												fill
												sizes="72px"
												className={styles.line__img}
											/>
										) : (
											<div className={styles.ph} aria-hidden="true" />
										)}
									</div>

									<div className={styles.line__body}>
										<span className={styles.line__brand}>{product.brand}</span>
										<Link
											href={`/shop/${product.slug}/`}
											className={styles.line__name}
											onClick={closeCart}
										>
											{product.name}
										</Link>
										<span className={styles.line__vol}>{volume}</span>

										<div className={styles.line__controls}>
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
											<span className={styles.line__total}>
												{formatPrice(lineTotal)}
											</span>
										</div>
									</div>

									<button
										type="button"
										className={styles.line__remove}
										onClick={() => remove(product.slug, volume)}
										aria-label={`Удалить ${product.name}`}
									>
										✕
									</button>
								</div>
							))}
						</div>

						<footer className={styles.foot}>
							<div className={styles.foot__row}>
								<span>Итого</span>
								<span className={styles.foot__total}>{totalFormatted}</span>
							</div>
							<Link
								href="/shop/cart/"
								className={styles.foot__checkout}
								onClick={closeCart}
							>
								Оформить заказ
							</Link>
							{shareMode && (
								<button
									type="button"
									className={`${styles.foot__share} ${copied ? styles["foot__share--copied"] : ""}`}
									onClick={shareCart}
								>
									{copied ? "Ссылка скопирована ✓" : "Поделиться ссылкой"}
								</button>
							)}
							<p className={styles.foot__note}>
								Доставка рассчитывается отдельно после оформления
							</p>
						</footer>
					</>
				)}
			</aside>
		</div>
	);
}
