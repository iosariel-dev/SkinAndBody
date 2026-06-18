"use client";

import type { ReactElement, FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";

import styles from "./CheckoutForm.module.scss";
import { useCart, formatPrice, encodeCart } from "@/features/cart/CartProvider";
import { submitOrder } from "@/shared/lib/helpers/submitOrder";
import { formatPhone, getPhoneDigits } from "@/shared/lib/helpers/formatPhone";
import { useShareMode } from "@/shared/lib/hooks/useShareMode";

const DELIVERY_OPTIONS = [
	{ value: "Самовывоз — Примерная, 1", label: "Самовывоз", note: "ул. Примерная, 1" },
	{ value: "Самовывоз — Образцовая, 2", label: "Самовывоз", note: "ул. Образцовая, 2" },
	{ value: "Доставка по Ульяновску", label: "Доставка по городу", note: "условия согласуем после заказа" },
];

function isValidEmail(email: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function CheckoutForm(): ReactElement {
	const { items, detailed, totalFormatted, count, hydrated } = useCart();

	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [email, setEmail] = useState("");
	const [delivery, setDelivery] = useState(DELIVERY_OPTIONS[0].value);
	const [comment, setComment] = useState("");
	const [agree, setAgree] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");

	// Кнопка «Поделиться ссылкой» показывается, если пришли из режима /shop/share/.
	const shareMode = useShareMode();
	const [copied, setCopied] = useState(false);
	const shareCart = (): void => {
		const link = `${window.location.origin}/shop/cart/?c=${encodeCart(items)}`;
		void navigator.clipboard?.writeText(link).then(() => {
			setCopied(true);
			window.setTimeout(() => setCopied(false), 2500);
		});
	};

	const phoneDigits = getPhoneDigits(phone);
	const valid =
		name.trim().length >= 2 &&
		phoneDigits.length >= 11 &&
		isValidEmail(email.trim()) &&
		delivery !== "" &&
		agree;

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!valid || submitting) return;
		setSubmitting(true);
		setError("");
		try {
			await submitOrder({
				items: items.map((l) => ({ slug: l.slug, volume: l.volume, qty: l.qty })),
				customer: {
					name: name.trim(),
					phone: phone.trim(),
					email: email.trim(),
					delivery,
					comment: comment.trim(),
				},
			});
			// submitOrder делает редирект на оплату. Корзину НЕ очищаем здесь —
			// иначе при отмене/неуспехе товары пропадут. Очистка только на /shop/success/.
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Что-то пошло не так. Попробуйте ещё раз.",
			);
			setSubmitting(false);
		}
	};

	if (!hydrated) {
		return (
			<div className={styles.page}>
				<div className={styles.container}>
					<div className={styles.loading}>Загружаем заказ…</div>
				</div>
			</div>
		);
	}

	if (count === 0) {
		return (
			<div className={styles.page}>
				<div className={styles.container}>
					<h1 className={styles.title}>Оформление заказа</h1>
					<div className={styles.empty}>
						<p>Корзина пуста — нечего оформлять.</p>
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
					<Link href="/shop/" className={styles.crumbs__link}>Магазин</Link>
					<span className={styles.crumbs__sep}>/</span>
					<Link href="/shop/cart/" className={styles.crumbs__link}>Корзина</Link>
					<span className={styles.crumbs__sep}>/</span>
					<span className={styles.crumbs__current}>Оформление</span>
				</nav>

				<h1 className={styles.title}>Оформление заказа</h1>

				<div className={styles.layout}>
					{/* ===== ФОРМА ===== */}
					<form className={styles.form} onSubmit={handleSubmit} noValidate>
						<div className={styles.field}>
							<label className={styles.field__label} htmlFor="co-name">Имя</label>
							<input
								id="co-name"
								className={styles.field__input}
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Как к вам обращаться"
								autoComplete="name"
							/>
						</div>

						<div className={styles.row}>
							<div className={styles.field}>
								<label className={styles.field__label} htmlFor="co-phone">Телефон</label>
								<input
									id="co-phone"
									className={`${styles.field__input} ym-disable-keys ym-hide-content`}
									type="tel"
									inputMode="tel"
									value={phone}
									onChange={(e) => setPhone(formatPhone(e.target.value))}
									placeholder="+7 (___) ___-__-__"
									autoComplete="tel"
								/>
							</div>
							<div className={styles.field}>
								<label className={styles.field__label} htmlFor="co-email">
									Email <span className={styles.field__hint}>для чека</span>
								</label>
								<input
									id="co-email"
									className={`${styles.field__input} ym-disable-keys ym-hide-content`}
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="you@example.com"
									autoComplete="email"
								/>
							</div>
						</div>

						<div className={styles.field}>
							<span className={styles.field__label}>Способ получения</span>
							<div className={styles.delivery}>
								{DELIVERY_OPTIONS.map((opt) => (
									<label
										key={opt.value}
										className={`${styles.delivery__opt} ${delivery === opt.value ? styles["delivery__opt--active"] : ""}`}
									>
										<input
											type="radio"
											name="delivery"
											value={opt.value}
											checked={delivery === opt.value}
											onChange={() => setDelivery(opt.value)}
											className={styles.delivery__radio}
										/>
										<span className={styles.delivery__label}>{opt.label}</span>
										<span className={styles.delivery__note}>{opt.note}</span>
									</label>
								))}
							</div>
						</div>

						<div className={styles.field}>
							<label className={styles.field__label} htmlFor="co-comment">
								Комментарий <span className={styles.field__hint}>необязательно</span>
							</label>
							<textarea
								id="co-comment"
								className={`${styles.field__textarea} ym-disable-keys ym-hide-content`}
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="Пожелания к заказу"
								maxLength={500}
								rows={3}
							/>
						</div>

						<label className={styles.consent}>
							<input
								type="checkbox"
								checked={agree}
								onChange={(e) => setAgree(e.target.checked)}
								className={styles.consent__box}
							/>
							<span className={styles.consent__text}>
								Согласен с{" "}
								<Link href="/shop/oferta/" className={styles.consent__link}>условиями оферты</Link>,{" "}
								<Link href="/consent/" className={styles.consent__link}>обработкой данных</Link>{" "}
								и{" "}
								<Link href="/privacy/" className={styles.consent__link}>политикой конфиденциальности</Link>.
							</span>
						</label>

						{error && <div className={styles.error}>{error}</div>}

						<button
							type="submit"
							className={styles.submit}
							disabled={!valid || submitting}
						>
							{submitting ? "Создаём платёж…" : `Оплатить ${totalFormatted}`}
						</button>

						<p className={styles.submit__note}>
							Оплата онлайн. Доставка рассчитывается отдельно после оформления.
						</p>
					</form>

					{/* ===== СВОДКА ===== */}
					<aside className={styles.summary}>
						<h2 className={styles.summary__title}>Заказ</h2>
						<div className={styles.summary__list}>
							{detailed.map(({ product, volume, qty, lineTotal }) => (
								<div key={`${product.slug}__${volume}`} className={styles.summary__line}>
									<span className={styles.summary__name}>
										{product.name}, {volume}{" "}
										<span className={styles.summary__qty}>×{qty}</span>
									</span>
									<span className={styles.summary__price}>{formatPrice(lineTotal)}</span>
								</div>
							))}
						</div>
						<div className={styles.summary__divider} />
						<div className={styles.summary__total}>
							<span>Итого</span>
							<span className={styles.summary__totalValue}>{totalFormatted}</span>
						</div>

						{shareMode && (
							<button
								type="button"
								onClick={shareCart}
								style={{
									display: "block",
									width: "100%",
									marginTop: 16,
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
					</aside>
				</div>
			</div>
		</div>
	);
}
