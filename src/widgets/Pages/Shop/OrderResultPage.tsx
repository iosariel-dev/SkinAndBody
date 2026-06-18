"use client";

import type { ReactElement } from "react";
import { useEffect } from "react";
import Link from "next/link";

import styles from "./OrderResultPage.module.scss";
import { useCart } from "@/features/cart/CartProvider";

export function OrderResultPage({
	variant,
}: {
	variant: "success" | "fail";
}): ReactElement {
	const { clear, hydrated } = useCart();
	const isSuccess = variant === "success";

	// Очищаем корзину после успешной оплаты — но только после гидрации,
	// иначе загрузка корзины из localStorage перезатрёт очистку (гонка).
	useEffect(() => {
		if (isSuccess && hydrated) clear();
	}, [isSuccess, hydrated, clear]);

	return (
		<div className={styles.page}>
			<div className={styles.box}>
				<div
					className={`${styles.icon} ${isSuccess ? styles["icon--ok"] : styles["icon--fail"]}`}
					aria-hidden="true"
				>
					{isSuccess ? "✓" : "!"}
				</div>

				{isSuccess ? (
					<>
						<h1 className={styles.title}>Спасибо за заказ!</h1>
						<p className={styles.text}>
							Оплата прошла успешно. Мы свяжемся с вами, чтобы согласовать
							получение: самовывоз из студии или доставку. Если товара нет в
							наличии — закажем у поставщика и сообщим срок.
						</p>
					</>
				) : (
					<>
						<h1 className={styles.title}>Оплата не завершена</h1>
						<p className={styles.text}>
							Платёж не прошёл или был отменён. Товары остались в корзине —
							можно попробовать оформить заказ ещё раз.
						</p>
					</>
				)}

				<div className={styles.actions}>
					{isSuccess ? (
						<Link href="/shop/" className={styles.btnPrimary}>
							Вернуться в магазин
						</Link>
					) : (
						<>
							<Link href="/shop/cart/" className={styles.btnPrimary}>
								Вернуться в корзину
							</Link>
							<Link href="/shop/" className={styles.btnGhost}>
								В магазин
							</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
