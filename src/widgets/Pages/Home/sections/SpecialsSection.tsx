import type { ReactElement, ReactNode } from "react";
import Link from "next/link";

import styles from "../HomePage.module.scss";

interface SpecialCard {
	href: string;
	accent: string;
	icon: ReactNode;
	title: string;
	sub: ReactNode;
	linkText: string;
}

const CARDS: SpecialCard[] = [
	{
		href: "/installments/",
		accent: "×2/×3",
		title: "Рассрочка",
		linkText: "Узнать условия",
		sub: (
			<>
				Курс по частям, без переплат — 2 или 3 платежа по
				внутреннему договору.
			</>
		),
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 1 1 1v3a1 1 0 0 0-1 1H6a3 3 0 0 1-3-3V6" />
			</svg>
		),
	},
	{
		href: "/sertifikaty/",
		accent: "✦",
		title: "Сертификаты",
		linkText: "Подробнее",
		sub: (
			<>
				Подарок на любой бюджет — от одной процедуры до
				полного курса.
			</>
		),
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
				<path d="M12 7v14" />
				<path d="M16 7a3.5 3.5 0 0 0-3.5-3.5 3.5 3.5 0 0 0-3.5 3.5" />
				<path d="M3 12h18" />
			</svg>
		),
	},
	{
		href: "/abonementy/",
		accent: "−20%",
		title: "Абонементы",
		linkText: "Все курсы",
		sub: <>Курс процедур со скидкой до 20%</>,
		icon: (
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
				<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
				<path d="m9 16 6-6" />
				<circle cx="9.5" cy="10.5" r=".5" fill="currentColor" />
				<circle cx="14.5" cy="15.5" r=".5" fill="currentColor" />
			</svg>
		),
	},
];

function SpecialCard({ href, accent, icon, title, sub, linkText }: SpecialCard): ReactElement {
	return (
		<Link href={href} className={styles["special-card"]}>
			<span className={styles["special-card__accent"]}>{accent}</span>
			<div className={styles["special-card__icon"]}>{icon}</div>
			<h3 className={styles["special-card__title"]}>{title}</h3>
			<p className={styles["special-card__sub"]}>{sub}</p>
			<span className={styles["special-card__link"]}>
				{linkText}
				<svg
					width="12"
					height="12"
					viewBox="0 0 14 14"
					fill="none"
					aria-hidden="true"
				>
					<path
						d="M2.5 7h9M8 3.5l3.5 3.5L8 10.5"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</span>
		</Link>
	);
}

export function SpecialsSection(): ReactElement {
	return (
		<section
			className={`${styles.section} ${styles["section--specials"]}`}
			id="specials"
		>
			<div className={styles.container}>
				<div className={styles.section__head}>
					<span className={styles.section__eyebrow}>
						Особые условия
					</span>
					<h2 className={styles.section__title}>
						Удобно <em>копить</em> и <em>дарить</em>
					</h2>
					<p className={styles.section__sub}>
						Рассрочка на курс, абонементы со скидкой и подарочные
						сертификаты для близких
					</p>
				</div>

				<div className={styles.specials__grid}>
					{CARDS.map((card) => (
						<SpecialCard key={card.href} {...card} />
					))}
				</div>
			</div>
		</section>
	);
}
