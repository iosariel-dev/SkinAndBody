import type { ReactElement } from "react";

import styles from "../HomePage.module.scss";
import { locations } from "../homeData";
import { config } from "@/shared/config";
import { ClockIcon } from "@/shared/ui/icons/ClockIcon";
import { PhoneIcon } from "@/shared/ui/icons/PhoneIcon";
import { TelegramIcon } from "@/shared/ui/icons/TelegramIcon";
import type { Location } from "@/entities/location/types";

interface ContactsSectionProps {
	currentLocation: Location;
	activeLocation: number;
	switchLocation: (index: number) => void;
	openContactForm: () => void;
}

export function ContactsSection({
	currentLocation,
	activeLocation,
	switchLocation,
	openContactForm,
}: ContactsSectionProps): ReactElement {
	return (
		<section className={styles.contacts} id="contacts">
			<div className={styles["contacts__map-wrap"]}>
				<iframe
					src={currentLocation.mapWidget}
					title="Карта"
					allowFullScreen={false}
					loading="lazy"
				/>
				<div className={styles.contacts__overlay}>
					<h3 className={styles["contacts__overlay-title"]}>
						Как нас найти
					</h3>

					<div className={styles.contacts__item}>
						<div className={styles["contacts__item-icon"]}>
							<ClockIcon size={18} />
						</div>
						<div>
							<div
								className={
									styles["contacts__item-label"]
								}
							>
								Режим работы
							</div>
							<div
								className={
									styles["contacts__item-val"]
								}
							>
								Ежедневно: 10:00 – 20:00
							</div>
						</div>
					</div>

					<div className={styles.contacts__item}>
						<div className={styles["contacts__item-icon"]}>
							<PhoneIcon size={18} />
						</div>
						<div>
							<div
								className={
									styles["contacts__item-label"]
								}
							>
								Телефон
							</div>
							<div
								className={
									styles["contacts__item-val"]
								}
							>
								<a href={`tel:${config.PHONE_RAW}`}>
									{config.PHONE}
								</a>
							</div>
						</div>
					</div>

					<div className={styles.contacts__item}>
						<div className={styles["contacts__item-icon"]}>
							<TelegramIcon size={18} />
						</div>
						<div>
							<div
								className={
									styles["contacts__item-label"]
								}
							>
								Telegram
							</div>
							<div
								className={
									styles["contacts__item-val"]
								}
							>
								<a
									href="https://t.me/example"
									target="_blank"
									rel="noopener noreferrer"
								>
									@example
								</a>
							</div>
						</div>
					</div>

					<div className={styles.contacts__tabs}>
						{locations.map((loc, i) => (
							<button
								key={loc.name}
								className={`${styles["contacts__tab"]} ${i === activeLocation ? styles["contacts__tab--active"] : ""}`}
								onClick={() => switchLocation(i)}
							>
								{loc.name}
							</button>
						))}
					</div>

					<button
						className={styles.contacts__cta}
						onClick={() => openContactForm()}
					>
						Записаться онлайн
					</button>
				</div>
			</div>
		</section>
	);
}
