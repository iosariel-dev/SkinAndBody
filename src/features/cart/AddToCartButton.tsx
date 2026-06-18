"use client";

import type { MouseEvent, ReactElement } from "react";

import styles from "./AddToCartButton.module.scss";
import { useCart } from "./CartProvider";

interface AddToCartButtonProps {
	slug: string;
	volume: string;
}

// Компактная кнопка для карточки каталога (внутри <Link> — глушим навигацию).
export function AddToCartButton({ slug, volume }: AddToCartButtonProps): ReactElement {
	const { add } = useCart();

	const handleAdd = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		add(slug, volume, 1);
	};

	return (
		<button type="button" className={styles.compact} onClick={handleAdd}>
			В корзину
		</button>
	);
}
