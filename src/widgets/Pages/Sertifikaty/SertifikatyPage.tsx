"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "./SertifikatyPage.module.scss";
import { useContactForm } from "@/shared/lib/hooks/useContactForm";
import type { ContactFormExtra } from "@/shared/lib/hooks/useContactForm";
import { useReveal } from "@/shared/lib/hooks/useReveal";
import { Lightbox, useLightbox } from "@/shared/ui/Lightbox";

const certificatePhotos = [
	{ src: "/images/sertifikaty/02.webp", alt: "Подарочный сертификат Skin&Body — оформление" },
];

const TOPIC = "Подарочный сертификат";

const EXTRAS: ContactFormExtra[] = [
	{
		id: "amount",
		type: "text",
		label: "Желаемый номинал",
		placeholder: "5 000 ₽ или «на процедуру»",
		optional: true,
		maxLength: 80,
	},
	{
		id: "format",
		type: "select",
		label: "Формат сертификата",
		placeholder: "Не выбрано — обсудим",
		optional: true,
		options: [
			{ value: "Онлайн (электронный)", label: "Онлайн (электронный)" },
			{ value: "Бумажный в студии", label: "Бумажный в студии" },
		],
	},
];

const features = [
	{
		num: "01",
		title: "Любой номинал",
		text: "На сумму, на конкретную процедуру или на целый комплекс — собираем под бюджет и под повод.",
	},
	{
		num: "02",
		title: "Все услуги студии",
		text: "Сертификат действует на любую услугу SKIN&BODY — аппаратные процедуры, эстетика лица и тела.",
	},
	{
		num: "03",
		title: "Срок 6 месяцев",
		text: "Достаточно времени, чтобы получатель спокойно выбрал удобную дату и формат визита.",
	},
	{
		num: "04",
		title: "Бумажный или электронный",
		text: "Можно оформить онлайн или приехать в студию за фирменным бумажным вариантом в подарочной обложке.",
	},
];

const formats = [
	{
		eyebrow: "Онлайн",
		title: "Быстро, без визита",
		text: "Свяжемся, согласуем номинал и услуги, пришлём оплату. После оплаты получите сертификат в мессенджер — можно сразу переслать получателю.",
		bullets: [
			"Подходит, если подарок нужен срочно",
			"Принимается в студии по номеру сертификата",
			"Дизайн сертификата — фирменный, готов к пересылке",
		],
	},
	{
		eyebrow: "В студии",
		title: "Бумажный, как настоящий подарок",
		text: "Приезжайте в студию — выдадим оформленный бумажный сертификат в фирменной обложке. Хороший вариант, когда хочется вручить лично.",
		bullets: [
			"Фирменное оформление студии",
			"Можно подобрать на месте по номиналу или процедуре",
			"Удобно вручать вживую — на праздник или просто так",
		],
	},
];

export function SertifikatyPage(): ReactElement {
	const { open: openContactForm } = useContactForm();
	const revealRef = useReveal();
	const lightbox = useLightbox(certificatePhotos.length);

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
							Сертификаты
						</span>
					</div>

					<span className={styles.hero__eyebrow}>Подарочные сертификаты</span>

					<h1 className={styles.hero__heading}>
						Сертификат на <em>любой повод</em>
					</h1>

					<p className={styles.hero__lead}>
						Сертификат SKIN&BODY — на сумму, на конкретную процедуру или на целый
						комплекс. Действует на все услуги студии, срок — 6 месяцев. Можно
						получить онлайн или приехать в студию за бумажным вариантом
						в фирменной обложке.
					</p>

					<div className={styles.hero__actions}>
						<button
							type="button"
							className={styles["hero__btn-primary"]}
							onClick={() => openContactForm(TOPIC, { extras: EXTRAS })}
						>
							Заказать сертификат
						</button>
						<button
							type="button"
							className={styles["hero__btn-ghost"]}
							onClick={() =>
								document
									.getElementById("features")
									?.scrollIntoView({ behavior: "smooth" })
							}
						>
							Как оформить
						</button>
					</div>
				</div>
			</section>

			{/* ===== FEATURES ===== */}
			<section className={styles.features} id="features">
				<div className={styles.features__container}>
					<div className={styles.features__head}>
						<span className={styles.features__eyebrow}>Что в подарок</span>
						<h2 className={styles.features__title}>
							Гибкий <em>подарок</em>
						</h2>
						<p className={styles.features__sub}>
							Подойдёт и близкому человеку, и коллеге, и себе — сертификат
							работает в любом сценарии SKIN&BODY.
						</p>
					</div>

					<div className={styles.features__list}>
						{features.map((item) => (
							<article key={item.num} className={styles["feature-card"]}>
								<span className={styles["feature-card__sparkle"]}>✦</span>
								<div className={styles["feature-card__num"]}>{item.num}</div>
								<h3 className={styles["feature-card__title"]}>{item.title}</h3>
								<p className={styles["feature-card__text"]}>{item.text}</p>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* ===== FORMATS ===== */}
			<section className={styles.formats}>
				<div className={styles.formats__container}>
					<div className={styles.formats__head}>
						<span className={styles.formats__eyebrow}>Форматы</span>
						<h2 className={styles.formats__title}>
							Онлайн или <em>в студии</em>
						</h2>
						<p className={styles.formats__sub}>
							Два варианта оформления — выбирайте по ситуации. Оба работают
							одинаково и принимаются в студии.
						</p>
					</div>

					<div className={styles.formats__list}>
						{formats.map((format) => (
							<article key={format.eyebrow} className={styles["format-card"]}>
								<span className={styles["format-card__eyebrow"]}>
									{format.eyebrow}
								</span>
								<h3 className={styles["format-card__title"]}>
									{format.title}
								</h3>
								<p className={styles["format-card__text"]}>{format.text}</p>
								<ul className={styles["format-card__bullets"]}>
									{format.bullets.map((bullet) => (
										<li key={bullet} className={styles["format-card__bullet"]}>
											<span aria-hidden="true">✦</span>
											{bullet}
										</li>
									))}
								</ul>
							</article>
						))}
					</div>
				</div>
			</section>

			{/* ===== PHOTOS ===== */}
			<section className={styles.photos}>
				<div className={styles.photos__container}>
					<div className={styles.photos__head}>
						<span className={styles.photos__eyebrow}>Как выглядит</span>
						<h2 className={styles.photos__title}>
							Бумажный <em>вживую</em>
						</h2>
						<p className={styles.photos__sub}>
							Фирменное оформление студии — приятно подарить, приятно
							получить.
						</p>
					</div>

					<div className={styles.photos__list}>
						{certificatePhotos.map((photo, i) => (
							<button
								type="button"
								key={photo.src}
								className={styles["photo-card"]}
								onClick={() => lightbox.openAt(i)}
								aria-label={`Открыть фото ${i + 1}`}
							>
								<Image
									src={photo.src}
									alt={photo.alt}
									width={720}
									height={960}
									className={styles["photo-card__img"]}
									sizes="(max-width: 720px) 100vw, 33vw"
								/>
							</button>
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
								Готовы подарить?
							</span>
							<h2 className={styles["cta-band__title"]}>
								Оформим сертификат <em>под повод</em>
							</h2>
							<p className={styles["cta-band__sub"]}>
								Свяжитесь — администратор подскажет популярные варианты,
								согласует номинал и поможет выбрать формат.
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

			<Lightbox
				images={certificatePhotos}
				index={lightbox.index}
				onClose={lightbox.close}
				onPrev={lightbox.prev}
				onNext={lightbox.next}
			/>
		</div>
	);
}
