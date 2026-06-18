"use client";

import type { ReactElement } from "react";
import Link from "next/link";

import styles from "./InstallmentsPage.module.scss";
import { useContactForm } from "@/shared/lib/hooks/useContactForm";
import type { ContactFormExtra } from "@/shared/lib/hooks/useContactForm";
import { useReveal } from "@/shared/lib/hooks/useReveal";

const TOPIC = "Внутренняя рассрочка";

const EXTRAS: ContactFormExtra[] = [
	{
		id: "for_service",
		type: "select",
		label: "На какую услугу рассрочка",
		placeholder: "Выберите услугу",
		optional: true,
		options: [
			{ value: "Лазерная эпиляция", label: "Лазерная эпиляция" },
			{ value: "LPG-массаж", label: "LPG-массаж" },
			{ value: "RF-лифтинг лица", label: "RF-лифтинг лица" },
			{ value: "Микротоковая терапия", label: "Микротоковая терапия" },
			{ value: "Вакуум + RF", label: "Вакуум + RF" },
			{ value: "EMS", label: "EMS" },
			{ value: "Пока не уверен(а) — нужна консультация", label: "Пока не уверен(а) — нужна консультация" },
		],
	},
];

const conditions = [
	{
		num: "01",
		title: "2 или 3 платежа",
		text: "Количество платежей зависит от выбранного абонемента. График подбираем индивидуально вместе с вами.",
	},
	{
		num: "02",
		title: "Без процентов",
		text: "Сумма абонемента остаётся прежней — никаких комиссий, дополнительных взносов и скрытых платежей.",
	},
	{
		num: "03",
		title: "Письменный договор",
		text: "Внутренний договор между вами и студией. Без банков, без проверок, без оформления кредита.",
	},
];

const availableServices = [
	{ name: "Лазерная эпиляция", href: "/epilation/", note: "Абонементы 5 и 10 процедур" },
	{ name: "RF-лифтинг лица", href: "/rflifting/", note: "Абонементы 5 и 10 процедур" },
	{ name: "Микротоковая терапия", href: "/microcurrenttherapy/", note: "Абонементы 5 и 10 процедур" },
	{ name: "LPG-массаж", href: "/lpg/", note: "Абонементы 5, 10 и 15 процедур" },
	{ name: "Вакуум + RF-лифтинг", href: "/vacuum/", note: "Абонементы 5 и 10 процедур" },
	{ name: "EMS — электромиостимуляция", href: "/ems/", note: "Абонементы 5, 10 и 15 процедур" },
];

const steps = [
	{
		num: "01",
		title: "Выберите курс",
		text: "На странице услуги или на консультации с администратором выбираем абонемент, который вам подходит.",
	},
	{
		num: "02",
		title: "Подписываем договор",
		text: "Заключаем внутренний письменный договор о рассрочке с фиксированной суммой и графиком платежей.",
	},
	{
		num: "03",
		title: "Первый платёж",
		text: "Вносите первый платёж и сразу начинаете курс — записываемся на первую процедуру.",
	},
	{
		num: "04",
		title: "Завершаете курс",
		text: "Проходите оставшиеся процедуры по обычному графику и закрываете рассрочку оставшимися платежами.",
	},
];

export function InstallmentsPage(): ReactElement {
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
							Рассрочка
						</span>
					</div>

					<span className={styles.hero__eyebrow}>Внутренняя рассрочка</span>

					<h1 className={styles.hero__heading}>
						Курс <em>в рассрочку</em>
					</h1>

					<p className={styles.hero__lead}>
						Абонемент на курс процедур можно оформить с разделением на
						платежи. Без банков, без процентов, без переплат — только
						внутренний договор между вами и студией.
					</p>

					<div className={styles.hero__actions}>
						<button
							type="button"
							className={styles["hero__btn-primary"]}
							onClick={() => openContactForm(TOPIC, { extras: EXTRAS })}
						>
							Связаться с нами
						</button>
						<button
							type="button"
							className={styles["hero__btn-ghost"]}
							onClick={() =>
								document
									.getElementById("conditions")
									?.scrollIntoView({ behavior: "smooth" })
							}
						>
							Узнать условия
						</button>
					</div>
				</div>
			</section>

			{/* ===== CONDITIONS ===== */}
			<section className={styles.conditions} id="conditions">
				<div className={styles.conditions__container}>
					<div className={styles.conditions__head}>
						<span className={styles.conditions__eyebrow}>Условия</span>
						<h2 className={styles.conditions__title}>
							Как работает <em>рассрочка</em>
						</h2>
						<p className={styles.conditions__sub}>
							Простая схема без банка, без скрытых комиссий и без проверки
							кредитной истории.
						</p>
					</div>

					<div className={styles.conditions__grid}>
						{conditions.map((item) => (
							<article key={item.num} className={styles["cond-card"]}>
								<span className={styles["cond-card__sparkle"]}>✦</span>
								<div className={styles["cond-card__num"]}>
									{item.num}
								</div>
								<h3 className={styles["cond-card__title"]}>
									{item.title}
								</h3>
								<p className={styles["cond-card__text"]}>{item.text}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* ===== AVAILABLE SERVICES ===== */}
			<section className={styles.services}>
				<div className={styles.services__container}>
					<div className={styles.services__head}>
						<span className={styles.services__eyebrow}>На что действует</span>
						<h2 className={styles.services__title}>
							Услуги с <em>абонементами</em>
						</h2>
						<p className={styles.services__sub}>
							Рассрочка доступна на абонементы от 5 процедур. Разовые
							визиты в рассрочку не оформляются.
						</p>
					</div>

					<div className={styles.services__grid}>
						{availableServices.map((service) => (
							<Link
								key={service.href}
								href={service.href}
								className={styles["service-link"]}
							>
								<div className={styles["service-link__body"]}>
									<span className={styles["service-link__name"]}>
										{service.name}
									</span>
									<span className={styles["service-link__note"]}>
										{service.note}
									</span>
								</div>
								<span className={styles["service-link__arrow"]} aria-hidden="true">
									<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
										<path
											d="M3 8h10M9 4l4 4-4 4"
											stroke="currentColor"
											strokeWidth="1.4"
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

			{/* ===== STEPS ===== */}
			<section className={styles.steps}>
				<div className={styles.steps__container}>
					<div className={styles.steps__head}>
						<span className={styles.steps__eyebrow}>Как оформить</span>
						<h2 className={styles.steps__title}>
							Четыре <em>простых шага</em>
						</h2>
					</div>

					<div className={styles.steps__list}>
						{steps.map((step) => (
							<div key={step.num} className={styles.step}>
								<span className={styles.step__num}>{step.num}</span>
								<div className={styles.step__body}>
									<h3 className={styles.step__title}>{step.title}</h3>
									<p className={styles.step__text}>{step.text}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ===== CTA BAND ===== */}
			<section className={styles["cta-band"]} data-no-reveal>
				<div className={styles["cta-band__container"]}>
					<div className={styles["cta-band__inner"]}>
						<div>
							<span className={styles["cta-band__eyebrow"]}>
								Готовы оформить?
							</span>
							<h2 className={styles["cta-band__title"]}>
								Оставьте заявку <em>на рассрочку</em>
							</h2>
							<p className={styles["cta-band__sub"]}>
								Администратор перезвонит, расскажет про условия и поможет
								выбрать удобный график платежей.
							</p>
						</div>
						<div className={styles["cta-band__actions"]}>
							<button
								className={styles["cta-band__btn"]}
								onClick={() => openContactForm(TOPIC, { extras: EXTRAS })}
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
