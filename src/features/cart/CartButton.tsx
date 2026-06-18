"use client";

import type { ReactElement } from "react";
import { useEffect, useRef, useState } from "react";

import styles from "./CartButton.module.scss";
import { useCart } from "./CartProvider";
import { BagIcon } from "@/shared/ui/icons/BagIcon";

export function CartButton({ className }: { className?: string }): ReactElement {
	const { count, hydrated, openCart } = useCart();
	const showCount = hydrated && count > 0;

	// Анимация-«подскок» при росте количества — привлекаем внимание к корзине.
	const [bump, setBump] = useState(false);
	const prev = useRef(count);
	useEffect(() => {
		if (count > prev.current) {
			setBump(true);
			const t = setTimeout(() => setBump(false), 600);
			prev.current = count;
			return () => clearTimeout(t);
		}
		prev.current = count;
	}, [count]);

	return (
		<button
			type="button"
			className={`${styles.btn} ${bump ? styles.bump : ""} ${className ?? ""}`}
			onClick={openCart}
			aria-label={showCount ? `Корзина, товаров: ${count}` : "Корзина"}
		>
			<BagIcon size={20} />
			{showCount && (
				<span className={`${styles.count} ${bump ? styles["count--bump"] : ""}`}>
					{count}
				</span>
			)}
		</button>
	);
}
