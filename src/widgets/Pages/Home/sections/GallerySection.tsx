import type { ReactElement } from "react";
import Image from "next/image";

import styles from "../HomePage.module.scss";
import {
	GALLERY_PAGE_COUNT,
	galleryImages,
	galleryPages,
	getPhotoStyle,
} from "../homeData";
import { useGalleryCarousel } from "../hooks/useGalleryCarousel";
import { config } from "@/shared/config";
import { Lightbox, useLightbox } from "@/shared/ui/Lightbox";

export function GallerySection(): ReactElement {
	const lightbox = useLightbox(galleryImages.length);
	const {
		slideIdx,
		withTransition,
		activeGalleryPage,
		galleryPrev,
		galleryNext,
		goToGalleryPage,
		handleTrackTransitionEnd,
		onGalleryTouchStart,
		onGalleryTouchMove,
		onGalleryTouchEnd,
	} = useGalleryCarousel(GALLERY_PAGE_COUNT);

	return (
		<section className={styles.section} id="gallery">
			<div className={styles.container}>
				<div className={styles.section__head}>
					<span className={styles.section__eyebrow}>
						Атмосфера студии
					</span>
					<h2 className={styles.section__title}>Галерея</h2>
				</div>
			</div>

			{/* viewport + nav обёрнуты в один div, чтобы useReveal (он навешивает
			    анимацию на каждого прямого ребёнка section отдельно) видел их
			    как один элемент. Иначе nav уходит ниже rootMargin -25% и пропадает,
			    пока сама галерея ещё видна. */}
			<div className={styles.gallery__carousel}>
			<div
				className={styles.gallery__viewport}
				onTouchStart={onGalleryTouchStart}
				onTouchMove={onGalleryTouchMove}
				onTouchEnd={onGalleryTouchEnd}
			>
				<div
					className={`${styles.gallery__track} ${withTransition ? styles["gallery__track--animated"] : ""}`}
					style={{
						transform: `translateX(calc(${-slideIdx} * (var(--gallery-slide-w) + var(--gallery-slide-gap))))`,
					}}
					onTransitionEnd={handleTrackTransitionEnd}
				>
					{(() => {
						// Clones around real pages for infinite-loop effect.
						const slides = [
							galleryPages[GALLERY_PAGE_COUNT - 1],
							...galleryPages,
							galleryPages[0],
						];
						return slides.map((slide, slideArrIdx) => (
							<div
								key={slideArrIdx}
								className={styles.gallery__slide}
								aria-hidden={slideArrIdx !== slideIdx}
							>
								<div className={styles.gallery__grid}>
									{slide.map((slot, i) => (
										<button
											type="button"
											key={`${slideArrIdx}-${i}`}
											className={`${styles.gallery__item} ${styles[`gallery__item--${i + 1}`] || ""}`}
											onClick={() => lightbox.openAt(slot.globalIndex)}
											aria-label={`Открыть фото ${slot.globalIndex + 1}`}
											tabIndex={slideArrIdx === slideIdx ? 0 : -1}
										>
											<Image
												src={slot.src}
												alt={`Фото ${config.SITE_NAME} ${slot.globalIndex + 1}`}
												width={600}
												height={560}
												className={styles.gallery__image}
												style={getPhotoStyle(slot.src)}
											/>
										</button>
									))}
								</div>
							</div>
						));
					})()}
				</div>
			</div>

			{GALLERY_PAGE_COUNT > 1 && (
				<div className={styles.container}>
					<div className={styles.gallery__nav}>
						<button
							type="button"
							className={styles["gallery__nav-btn"]}
							onClick={galleryPrev}
							aria-label="Предыдущая страница"
						>
							<svg viewBox="0 0 16 16" aria-hidden="true">
								<polyline points="10 3 5 8 10 13" />
							</svg>
						</button>
						<div className={styles.gallery__dots} role="tablist">
							{galleryPages.map((_, p) => (
								<button
									key={p}
									type="button"
									className={`${styles.gallery__dot} ${p === activeGalleryPage ? styles["gallery__dot--active"] : ""}`}
									onClick={() => goToGalleryPage(p)}
									aria-label={`Страница ${p + 1}`}
									aria-current={p === activeGalleryPage}
								/>
							))}
						</div>
						<button
							type="button"
							className={styles["gallery__nav-btn"]}
							onClick={galleryNext}
							aria-label="Следующая страница"
						>
							<svg viewBox="0 0 16 16" aria-hidden="true">
								<polyline points="6 3 11 8 6 13" />
							</svg>
						</button>
					</div>
				</div>
			)}
			</div>

			<Lightbox
				images={galleryImages.map((src, i) => ({
					src,
					alt: `Фото ${config.SITE_NAME} ${i + 1}`,
				}))}
				index={lightbox.index}
				onClose={lightbox.close}
				onPrev={lightbox.prev}
				onNext={lightbox.next}
			/>
		</section>
	);
}
