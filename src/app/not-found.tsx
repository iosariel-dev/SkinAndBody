import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./not-found.module.scss";

export default function NotFound(): ReactNode {
	return (
		<div className={styles.page}>
			<div className={styles.main}>
				{/* Decorative circles */}
				<div
					className={`${styles.deco} ${styles["deco--circle2"]}`}
					aria-hidden="true"
				/>
				<div
					className={`${styles.deco} ${styles["deco--circle1"]}`}
					aria-hidden="true"
				/>

				{/* Large decorative 404 */}
				<div className={styles.deco404} aria-hidden="true">
					404
				</div>

				{/* Content */}
				<div className={styles.content}>
					<span className={styles.sparkle} aria-hidden="true">
						✦
					</span>

					<p className={styles.eyebrow}>Страница не найдена</p>

					<h1 className={styles.heading}>
						Кажется, вы <em>заблудились</em>
					</h1>

					<p className={styles.subtitle}>
						Такой страницы не существует, но мы поможем найти то, что
						вам нужно
					</p>

					<div className={styles.actions}>
						<Link href="/" className={styles.btnPrimary}>
							На главную
						</Link>
						<Link href="/#contacts" className={styles.btnGhost}>
							Записаться
						</Link>
					</div>

					<nav
						className={styles.quickLinks}
						aria-label="Популярные разделы"
					>
						<Link href="/epilation/" className={styles.quickLinks__item}>
							Лазерная эпиляция
						</Link>
						<span className={styles.quickLinks__sep} aria-hidden="true">
							·
						</span>
						<Link href="/depilation/" className={styles.quickLinks__item}>
							Депиляция
						</Link>
						<span className={styles.quickLinks__sep} aria-hidden="true">
							·
						</span>
						<Link href="/cleansing/" className={styles.quickLinks__item}>
							Чистки
						</Link>
						<span className={styles.quickLinks__sep} aria-hidden="true">
							·
						</span>
						<Link href="/peelings/" className={styles.quickLinks__item}>
							Пилинги
						</Link>
						<span className={styles.quickLinks__sep} aria-hidden="true">
							·
						</span>
						<Link href="/lpg/" className={styles.quickLinks__item}>
							LPG
						</Link>
						<span className={styles.quickLinks__sep} aria-hidden="true">
							·
						</span>
						<Link href="/#contacts" className={styles.quickLinks__item}>
							Контакты
						</Link>
					</nav>
				</div>
			</div>
		</div>
	);
}
