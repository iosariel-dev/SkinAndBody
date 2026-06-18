import type { ReactElement } from "react";
import Image from "next/image";

import styles from "../HomePage.module.scss";
import { locations } from "../homeData";
import type { Specialist } from "@/entities/specialist/types";

interface SpecialistsSectionProps {
	activeLocation: number;
	switchLocation: (index: number) => void;
	currentSpecialists: Specialist[];
}

export function SpecialistsSection({
	activeLocation,
	switchLocation,
	currentSpecialists,
}: SpecialistsSectionProps): ReactElement {
	return (
		<section
			className={`${styles.section} ${styles["section--alt"]}`}
			id="team"
		>
			<div className={styles.container}>
				<div className={styles.section__head}>
					<span className={styles.section__eyebrow}>
						Наша команда
					</span>
					<h2 className={styles.section__title}>
						Специалисты <em>студии</em>
					</h2>
					<p className={styles.section__sub}>
						Опытные профессионалы с медицинским образованием.
						Два удобных адреса в Ульяновске.
					</p>
				</div>

				<div className={styles.team__tabs}>
					{locations.map((loc, i) => (
						<button
							key={loc.name}
							className={`${styles.team__tab} ${i === activeLocation ? styles["team__tab--active"] : ""}`}
							onClick={() => switchLocation(i)}
						>
							{loc.name}
						</button>
					))}
				</div>

				<div className={styles.team__grid}>
					{currentSpecialists.map((spec) => (
						<div
							key={spec.name}
							className={styles["specialist-card"]}
						>
							<div className={styles["specialist-card__photo-wrap"]}>
								<Image
									src={spec.photo}
									alt={spec.name}
									width={200}
									height={200}
									className={styles["specialist-card__photo"]}
									style={{
										...(spec.photoPosition ? { objectPosition: spec.photoPosition } : {}),
										...(spec.photoScale ? { transform: `scale(${spec.photoScale})` } : {}),
									}}
								/>
							</div>
							<h3 className={styles["specialist-card__name"]}>
								{spec.name}
							</h3>
							<span className={styles["specialist-card__role"]}>
								{spec.direction}
							</span>
							<p className={styles["specialist-card__desc"]}>
								{spec.description}
							</p>
							{spec.tags && spec.tags.length > 0 && (
								<div className={styles["specialist-card__tags"]}>
									{spec.tags.map((tag) => (
										<span
											key={tag}
											className={styles["specialist-card__tag"]}
										>
											{tag}
										</span>
									))}
								</div>
							)}
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
