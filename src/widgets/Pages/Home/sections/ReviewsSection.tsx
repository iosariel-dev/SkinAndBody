import type { ReactElement } from "react";

import styles from "../HomePage.module.scss";
import { locations } from "../homeData";
import type { Location } from "@/entities/location/types";

interface ReviewsSectionProps {
	currentLocation: Location;
	activeLocation: number;
	switchLocation: (index: number) => void;
}

export function ReviewsSection({
	currentLocation,
	activeLocation,
	switchLocation,
}: ReviewsSectionProps): ReactElement {
	return (
		<section
			className={styles.section}
			id="reviews"
		>
			<div className={styles.container}>
				<div
					className={`${styles.section__head} ${styles["section__head--center"]}`}
				>
					<span className={styles.section__eyebrow}>
						Мнения клиентов
					</span>
					<h2 className={styles.section__title}>Отзывы</h2>
					<p className={styles.section__sub}>
						Нам важно ваше мнение. Читайте честные отзывы на
						Яндекс.Картах.
					</p>
				</div>
				<div className={styles.reviews__tabs}>
					{locations.map((loc, i) => (
						<button
							key={loc.name}
							className={`${styles.reviews__tab} ${i === activeLocation ? styles["reviews__tab--active"] : ""}`}
							onClick={() => switchLocation(i)}
						>
							{loc.name}
						</button>
					))}
				</div>
				<iframe
					className={styles.reviews__iframe}
					src={currentLocation.reviewWidget}
					title="Отзывы Skin&Body"
					loading="lazy"
				/>
			</div>
		</section>
	);
}
