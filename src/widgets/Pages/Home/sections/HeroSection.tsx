import type { ReactElement } from "react";
import Image from "next/image";

import styles from "../HomePage.module.scss";
import { YandexBadgeIcon } from "@/shared/ui/icons/YandexBadgeIcon";

interface HeroSectionProps {
	openContactForm: () => void;
}

export function HeroSection({ openContactForm }: HeroSectionProps): ReactElement {
	return (
		<section className={styles.hero}>
			<div className={styles.hero__inner}>
				<div className={styles.hero__content}>
					<span className={styles.hero__eyebrow}>
						Ульяновск · С 2018 года
					</span>
					<h1 className={styles.hero__heading}>
						Студия
						<br />
						<em>эстетики</em>
						<br />
						лица и тела
					</h1>
					<p className={styles.hero__tagline}>
						Ваша кожа заслуживает нежности
					</p>
					<p className={styles.hero__desc}>
						Профессиональный уход с современными технологиями —
						лазерная эпиляция, LPG, RF-лифтинг, микротоковая
						терапия, EMS, эстетическая косметология и депиляция.
					</p>
					<div className={styles.hero__actions}>
						<button
							className={styles["btn-primary"]}
							onClick={() => openContactForm()}
						>
							Связаться с нами
						</button>
						<button
							className={styles["btn-ghost"]}
							onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}
						>
							Все услуги
						</button>
					</div>
				</div>

				<div className={styles["hero__image-wrap"]}>
					<Image
						src="/images/home-hero.webp"
						alt="Студия эстетики Skin&Body"
						width={720}
						height={920}
						className={styles["hero__image-photo"]}
						priority
					/>
					<div className={styles["hero__image-badge"]}>
						<div className={styles["hero__image-badge-icon"]}>
							<YandexBadgeIcon size={36} />
						</div>
						<div className={styles["hero__image-badge-text"]}>
							<span className={styles["hero__image-badge-num"]}>
								5.0 — Хорошее место
							</span>
							<span className={styles["hero__image-badge-label"]}>
								295 отзывов · 386 оценок
							</span>
						</div>
					</div>
					<div className={styles.hero__stats}>
						<div className={styles["hero__stats-num"]}>7+</div>
						<div className={styles["hero__stats-label"]}>
							лет
							<br />
							работы
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
