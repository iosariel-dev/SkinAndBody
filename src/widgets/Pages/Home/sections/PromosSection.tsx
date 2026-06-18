import type { ReactElement } from "react";
import Image from "next/image";

import styles from "../HomePage.module.scss";
import { promos } from "../homeData";
import { usePromoCarousel } from "../hooks/usePromoCarousel";

interface PromosSectionProps {
	openContactForm: () => void;
}

export function PromosSection({ openContactForm }: PromosSectionProps): ReactElement {
	const { sliderRef, activePromo, scrollByCard, scrollToPromo, handleSliderScroll } =
		usePromoCarousel(promos.length);

	return (
		<section
			className={`${styles.section} ${styles["section--alt"]}`}
			id="promos"
		>
			<div className={styles.container}>
				<div className={styles.promos__head}>
					<div className={styles.promos__headtext}>
						<span className={styles.section__eyebrow}>
							Специальные предложения
						</span>
						<h2 className={styles.section__title}>
							Актуальные <em>акции</em>
						</h2>
						<p className={styles.section__sub}>
							Выгодные условия для новых и постоянных клиентов.
							Запишитесь сегодня — количество мест ограничено.
						</p>
					</div>
					<div className={styles.promos__arrows}>
						<button
							className={`${styles.promos__arrow} ${activePromo === 0 ? styles["promos__arrow--disabled"] : ""}`}
							onClick={() => scrollByCard(-1)}
							aria-label="Предыдущая акция"
							disabled={activePromo === 0}
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
						<button
							className={`${styles.promos__arrow} ${activePromo === promos.length - 1 ? styles["promos__arrow--disabled"] : ""}`}
							onClick={() => scrollByCard(1)}
							aria-label="Следующая акция"
							disabled={activePromo === promos.length - 1}
						>
							<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
							</svg>
						</button>
					</div>
				</div>

				<div
					className={styles.promos__slider}
					ref={sliderRef}
					onScroll={handleSliderScroll}
				>
					{promos.map((promo) => (
						<div
							key={promo.href}
							className={styles["promo-card"]}
						>
							<div
								className={styles["promo-card__img-wrap"]}
							>
								<Image
									src={promo.image}
									alt={promo.alt}
									width={600}
									height={440}
									className={
										styles["promo-card__img"]
									}
								/>
								{promo.badge && (
									<span
										className={
											styles["promo-card__badge"]
										}
									>
										{promo.badge}
									</span>
								)}
							</div>
							<div className={styles["promo-card__body"]}>
								<h3
									className={
										styles["promo-card__title"]
									}
								>
									{promo.title}
								</h3>
								<p
									className={
										styles["promo-card__desc"]
									}
								>
									{promo.subtitle}
								</p>
								<div
									className={
										styles["promo-card__price"]
									}
								>
									{promo.newPrice && (
										<span
											className={
												styles[
													"promo-card__price-new"
												]
											}
										>
											{promo.newPrice}
										</span>
									)}
									{promo.oldPrice && (
										<span
											className={
												styles[
													"promo-card__price-old"
												]
											}
										>
											{promo.oldPrice}
										</span>
									)}
								</div>
								<button
									className={
										styles["promo-card__btn"]
									}
									onClick={() => openContactForm()}
								>
									Записаться
								</button>
							</div>
						</div>
					))}
				</div>

				<div className={styles.promos__dots}>
					{promos.map((_, i) => (
						<button
							key={i}
							className={`${styles.promos__dot} ${i === activePromo ? styles["promos__dot--active"] : ""}`}
							onClick={() => scrollToPromo(i)}
							aria-label={`Акция ${i + 1}`}
						/>
					))}
				</div>
			</div>
		</section>
	);
}
