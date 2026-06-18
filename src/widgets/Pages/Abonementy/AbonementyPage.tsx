"use client";

import type { ReactElement } from "react";
import Link from "next/link";

import styles from "./AbonementyPage.module.scss";
import { useContactForm } from "@/shared/lib/hooks/useContactForm";
import { useReveal } from "@/shared/lib/hooks/useReveal";

const TOPIC = "Абонемент на курс процедур";

const benefits = [
	{
		num: "01",
		title: "Скидка до 20%",
		text: "Чем длиннее курс — тем выгоднее цена за каждую процедуру. Максимальная экономия на полном курсе.",
	},
	{
		num: "02",
		title: "Стабильный график",
		text: "Регулярные сеансы дают накопительный эффект и устойчивый результат, который держится дольше.",
	},
	{
		num: "03",
		title: "Гибкое использование",
		text: "Проходите курс в комфортном для вас темпе. График визитов согласовываем со специалистом.",
	},
];

const subscriptions = [
	{
		name: "Лазерная эпиляция",
		href: "/epilation/",
		courses: "5 / 10 процедур",
		maxDiscount: "до 20%",
		cta: "Цены на эпиляцию",
	},
	{
		name: "LPG-массаж",
		href: "/lpg/",
		courses: "5 / 10 / 15 процедур",
		maxDiscount: "до 20%",
		cta: "Цены на LPG",
	},
	{
		name: "RF-лифтинг лица",
		href: "/rflifting/",
		courses: "5 / 10 процедур",
		maxDiscount: "до 20%",
		cta: "Цены на RF-лифтинг",
	},
	{
		name: "Микротоковая терапия",
		href: "/microcurrenttherapy/",
		courses: "5 / 10 процедур",
		maxDiscount: "до 20%",
		cta: "Цены на микротоки",
	},
	{
		name: "Вакуум + RF",
		href: "/vacuum/",
		courses: "5 / 10 процедур",
		maxDiscount: "до 20%",
		cta: "Цены на вакуум",
	},
	{
		name: "EMS",
		href: "/ems/",
		courses: "5 / 10 / 15 процедур",
		maxDiscount: "до 15%",
		cta: "Цены на EMS",
	},
];

export function AbonementyPage(): ReactElement {
	const { open: openContactForm } = useContactForm();
	const revealRef = useReveal();

	return (
		<div className={styles.page} ref={revealRef as React.RefObject<HTMLDivElement>}>
			{/* ===== HERO ===== */}
			<section className={styles.hero}>
				<div className={styles.hero__inner}>
					<div className={styles.hero__breadcrumb}>
						<Link href="/" className={styles["hero__breadcrumb-link"]}>
							Главная
						</Link>
						<span className={styles["hero__breadcrumb-sep"]}>›</span>
						<span className={styles["hero__breadcrumb-current"]}>
							Абонементы
						</span>
					</div>

					<span className={styles.hero__eyebrow}>Курсы процедур</span>

					<h1 className={styles.hero__heading}>
						Абонементы <em>со скидкой до 20%</em>
					</h1>

					<p className={styles.hero__lead}>
						Курсовое посещение — экономнее, эффективнее и удобнее разовых
						визитов. Шесть аппаратных и эстетических услуг доступны в
						формате абонементов 5, 10 и 15 процедур.
					</p>

					<div className={styles.hero__actions}>
						<button
							type="button"
							className={styles["hero__btn-primary"]}
							onClick={() => openContactForm(TOPIC)}
						>
							Связаться с нами
						</button>
						<button
							type="button"
							className={styles["hero__btn-ghost"]}
							onClick={() =>
								document
									.getElementById("subscriptions")
									?.scrollIntoView({ behavior: "smooth" })
							}
						>
							Все абонементы
						</button>
					</div>
				</div>
			</section>

			{/* ===== BENEFITS ===== */}
			<section className={styles.benefits}>
				<div className={styles.benefits__container}>
					<div className={styles.benefits__head}>
						<span className={styles.benefits__eyebrow}>Почему курс</span>
						<h2 className={styles.benefits__title}>
							Что вы <em>получаете</em>
						</h2>
						<p className={styles.benefits__sub}>
							Курс процедур — это не просто экономия. Это стабильный
							результат, который сохраняется дольше.
						</p>
					</div>

					<div className={styles.benefits__grid}>
						{benefits.map((item) => (
							<article key={item.num} className={styles["benefit-card"]}>
								<span className={styles["benefit-card__sparkle"]}>✦</span>
								<div className={styles["benefit-card__num"]}>{item.num}</div>
								<h3 className={styles["benefit-card__title"]}>
									{item.title}
								</h3>
								<p className={styles["benefit-card__text"]}>{item.text}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* ===== SUBSCRIPTIONS LIST ===== */}
			<section className={styles.subscriptions} id="subscriptions">
				<div className={styles.subscriptions__container}>
					<div className={styles.subscriptions__head}>
						<span className={styles.subscriptions__eyebrow}>Услуги</span>
						<h2 className={styles.subscriptions__title}>
							Где доступны <em>курсы</em>
						</h2>
						<p className={styles.subscriptions__sub}>
							Перейдите на страницу услуги, чтобы посмотреть подробные
							цены, увидеть оборудование и записаться на сеанс.
						</p>
					</div>

					<div className={styles.subscriptions__grid}>
						{subscriptions.map((sub) => (
							<Link
								key={sub.href}
								href={sub.href}
								className={styles["subscription-card"]}
							>
								<div className={styles["subscription-card__head"]}>
									<h3 className={styles["subscription-card__name"]}>
										{sub.name}
									</h3>
									<span className={styles["subscription-card__discount"]}>
										{sub.maxDiscount}
									</span>
								</div>
								<div className={styles["subscription-card__courses"]}>
									{sub.courses}
								</div>
								<span className={styles["subscription-card__link"]}>
									{sub.cta}
									<svg
										width="14"
										height="14"
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
						))}
					</div>
				</div>
			</section>

			{/* ===== INSTALLMENTS NOTICE ===== */}
			<section className={styles["installments-notice"]}>
				<div className={styles["installments-notice__container"]}>
					<Link
						href="/installments/"
						className={styles["installments-notice__card"]}
					>
						<span
							className={styles["installments-notice__icon"]}
							aria-hidden="true"
						>
							✦
						</span>
						<div className={styles["installments-notice__body"]}>
							<span className={styles["installments-notice__title"]}>
								Любой абонемент можно оформить{" "}
								<em>в рассрочку</em>
							</span>
							<span className={styles["installments-notice__sub"]}>
								2 или 3 платежа без процентов и без банков, по
								внутреннему письменному договору.
							</span>
						</div>
						<span className={styles["installments-notice__link"]}>
							Узнать условия
							<svg
								width="14"
								height="14"
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
				</div>
			</section>

			{/* ===== CTA BAND ===== */}
			<section className={styles["cta-band"]} data-no-reveal>
				<div className={styles["cta-band__container"]}>
					<div className={styles["cta-band__inner"]}>
						<div>
							<span className={styles["cta-band__eyebrow"]}>
								Готовы начать курс?
							</span>
							<h2 className={styles["cta-band__title"]}>
								Запишитесь на <em>первый сеанс</em>
							</h2>
							<p className={styles["cta-band__sub"]}>
								Администратор перезвонит, поможет выбрать подходящий
								абонемент и согласует удобное время.
							</p>
						</div>
						<div className={styles["cta-band__actions"]}>
							<button
								className={styles["cta-band__btn"]}
								onClick={() => openContactForm(TOPIC)}
								type="button"
							>
								Связаться с нами
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
