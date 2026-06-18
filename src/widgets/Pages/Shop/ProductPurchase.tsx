"use client";

import type { ReactElement } from "react";
import { useState } from "react";

import btn from "@/features/cart/AddToCartButton.module.scss";
import styles from "./ProductPurchase.module.scss";
import { useCart } from "@/features/cart/CartProvider";
import type { ProductData } from "@/entities/product";

const priceNum = (s: string): number => parseInt(s.replace(/[^0-9]/g, ""), 10) || 0;

export function ProductPurchase({ product }: { product: ProductData }): ReactElement {
	const { add } = useCart();
	const variants =
		product.variants && product.variants.length > 0
			? product.variants
			: [{ volume: product.volume, price: product.price }];

	const [idx, setIdx] = useState(0);
	const [qty, setQty] = useState(1);
	const current = variants[idx];

	return (
		<div className={styles.purchase}>
			<div className={styles.price}>
				{product.oldPrice && (
					<span className={styles.oldPrice}>{product.oldPrice}</span>
				)}
				<span>{current.price}</span>
				{product.oldPrice && (
					<span className={styles.discount}>
						−
						{Math.round(
							((priceNum(product.oldPrice) - priceNum(current.price)) /
								priceNum(product.oldPrice)) *
								100,
						)}
						%
					</span>
				)}
			</div>

			{variants.length > 1 && (
				<div className={styles.variants}>
					<span className={styles.variants__label}>Объём:</span>
					<div className={styles.variants__list}>
						{variants.map((v, i) => (
							<button
								key={v.volume}
								type="button"
								className={`${styles.variant} ${i === idx ? styles["variant--active"] : ""}`}
								onClick={() => setIdx(i)}
							>
								{v.volume}
							</button>
						))}
					</div>
				</div>
			)}

			<div className={btn.full}>
				<div className={btn.stepper}>
					<button
						type="button"
						className={btn.stepper__btn}
						onClick={() => setQty((q) => Math.max(1, q - 1))}
						aria-label="Уменьшить количество"
					>
						−
					</button>
					<span className={btn.stepper__val}>{qty}</span>
					<button
						type="button"
						className={btn.stepper__btn}
						onClick={() => setQty((q) => q + 1)}
						aria-label="Увеличить количество"
					>
						+
					</button>
				</div>
				<button
					type="button"
					className={btn.full__btn}
					onClick={() => add(product.slug, current.volume, qty)}
				>
					Добавить в корзину
				</button>
			</div>
		</div>
	);
}
