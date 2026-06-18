"use client";

import type { MouseEvent, ReactElement } from "react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./ShopPage.module.scss";
import type { ProductData } from "@/entities/product";
import { AddToCartButton } from "@/features/cart/AddToCartButton";

export function priceNum(s: string): number {
	return parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;
}

export function discountPct(oldPrice: string, price: string): number {
	const o = priceNum(oldPrice);
	const c = priceNum(price);
	return o > c ? Math.round(((o - c) / o) * 100) : 0;
}

export function ProductMedia({ product }: { product: ProductData }): ReactElement {
	const src = product.images[0];
	return (
		<div className={styles["ecard__media"]}>
			{product.badge === "new" && (
				<span className={`${styles.badge} ${styles["badge--new"]}`}>Новинка</span>
			)}
			{product.badge === "hit" && (
				<span className={`${styles.badge} ${styles["badge--hit"]}`}>Хит</span>
			)}
			{product.availability === "on_order" && (
				<span className={`${styles.badge} ${styles["badge--order"]}`}>Под заказ</span>
			)}
			{product.oldPrice && discountPct(product.oldPrice, product.price) > 0 && (
				<span className={`${styles.badge} ${styles["badge--sale"]}`}>
					−{discountPct(product.oldPrice, product.price)}%
				</span>
			)}
			{src ? (
				<Image
					src={src}
					alt={`${product.name} — ${product.brand}`}
					fill
					sizes="(max-width: 768px) 100vw, 340px"
					className={`${styles["ecard__img"]}${
						product.brand === "Skin Synergy"
							? " " + styles["ecard__img--cover"]
							: ""
					}`}
				/>
			) : (
				<div className={styles.ph} aria-hidden="true" />
			)}
		</div>
	);
}

export function ProductCard({
	product,
	revealIndex,
	animate = true,
}: {
	product: ProductData;
	revealIndex: number;
	animate?: boolean;
}): ReactElement {
	const variants =
		product.variants && product.variants.length > 0
			? product.variants
			: [{ volume: product.volume, price: product.price }];
	const [idx, setIdx] = useState(0);
	const current = variants[idx];
	const hasVariants = variants.length > 1;

	// Выбор объёма внутри карточки-ссылки — не переходим на страницу товара.
	const pick = (e: MouseEvent, i: number): void => {
		e.preventDefault();
		e.stopPropagation();
		setIdx(i);
	};

	return (
		<Link
			href={`/shop/${product.slug}/`}
			className={styles.ecard}
			data-card="1"
			data-reveal={animate ? "1" : undefined}
			data-stagger={((revealIndex % 4) * 0.07).toFixed(2)}
		>
			<ProductMedia product={product} />
			<div className={styles["ecard__body"]}>
				<span className={styles["ecard__brand"]}>{product.brand}</span>
				<h3 className={styles["ecard__name"]}>{product.name}</h3>

				{hasVariants ? (
					<div className={styles["ecard__variants"]}>
						{variants.map((v, i) => (
							<button
								key={v.volume}
								type="button"
								className={`${styles["ecard__variant"]} ${i === idx ? styles["ecard__variant--active"] : ""}`}
								onClick={(e) => pick(e, i)}
							>
								{v.volume}
							</button>
						))}
					</div>
				) : (
					<span className={styles["ecard__vol"]}>{current.volume}</span>
				)}

				<div className={styles["ecard__foot"]}>
					<span className={styles["ecard__price"]}>
						{product.oldPrice && (
							<span className={styles["ecard__oldprice"]}>{product.oldPrice}</span>
						)}
						{current.price}
					</span>
					<AddToCartButton slug={product.slug} volume={current.volume} />
				</div>
			</div>
		</Link>
	);
}
