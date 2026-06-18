import type { ReactElement } from "react";
import Link from "next/link";

import styles from "../HomePage.module.scss";
import { services } from "../homeData";

export function ServicesSection(): ReactElement {
	return (
		<section className={styles.section} id="services">
			<div className={styles.container}>
				<div className={styles.services__header}>
					<div className={styles.services__headerLeft}>
						<span className={styles.section__eyebrow}>
							Что мы предлагаем
						</span>
						<h2 className={styles.section__title}>
							Услуги <em>студии</em>
						</h2>
					</div>
					<p className={styles.services__headerSub}>
						Современные аппаратные и ручные методики для красоты
						и здоровья вашей кожи. Каждая процедура подбирается
						индивидуально.
					</p>
				</div>

				<div className={styles.services__body}>
					{services.map((category, catIdx) => (
						<div
							key={category.label}
							className={styles.services__category}
						>
							<div className={styles.services__categoryMeta}>
								<span className={styles.services__categoryNum}>
									0{catIdx + 1}
								</span>
								<h3 className={styles.services__categoryName}>
									{category.label}
								</h3>
								<p className={styles.services__categoryTitle}>
									{category.title}
								</p>
							</div>

							<div className={styles.services__categoryItems}>
								{category.items.map((item) => (
									<Link
										key={item.href}
										href={item.href}
										className={styles.services__item}
									>
										<span className={styles.services__itemArrow}>
											<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
												<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
											</svg>
										</span>
										<span className={styles.services__itemName}>
											{item.name}
										</span>
										<span className={styles.services__itemDesc}>
											{item.desc}
										</span>
										<span className={styles.services__itemPrice}>
											<span className={styles.services__itemPriceVal}>{item.price}</span>
											<span className={styles.services__itemPriceUnit}>{item.unit}</span>
										</span>
									</Link>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
