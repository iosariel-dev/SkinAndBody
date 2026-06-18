"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

import styles from "./ProductPage.module.scss";
import { Lightbox, useLightbox } from "@/shared/ui/Lightbox";
import { useIsClient } from "@/shared/lib/hooks/useIsClient";

interface ProductGalleryProps {
	images: string[];
	name: string;
	onOrder: boolean;
	cover?: boolean;
}

export function ProductGallery({
	images,
	name,
	onOrder,
	cover = false,
}: ProductGalleryProps): ReactElement {
	const [active, setActive] = useState(0);
	const mounted = useIsClient();
	const lb = useLightbox(images.length);

	const hasImages = images.length > 0;
	// Без фото (черновые данные) — 3 плейсхолдера.
	const thumbs = hasImages ? images : [undefined, undefined, undefined];
	const mainSrc = hasImages ? images[active] : undefined;

	return (
		<div className={styles.product__gallery}>
			<div className={styles.product__main}>
				{onOrder && (
					<span className={`${styles.badge} ${styles["badge--order"]}`}>
						Под заказ
					</span>
				)}
				{mainSrc ? (
					<button
						type="button"
						className={styles.product__zoom}
						onClick={() => lb.openAt(active)}
						aria-label="Открыть фото"
					>
						<Image
							src={mainSrc}
							alt={name}
							fill
							sizes="(max-width: 860px) 100vw, 520px"
							className={`${styles["product__main-img"]}${cover ? " " + styles["product__main-img--cover"] : ""}`}
							priority
						/>
					</button>
				) : (
					<div className={styles.ph} aria-hidden="true" />
				)}
			</div>

			<div className={styles.thumbs}>
				{thumbs.map((src, i) => (
					<button
						key={i}
						type="button"
						className={`${styles.thumb} ${i === active ? styles["thumb--active"] : ""}`}
						onClick={() => hasImages && setActive(i)}
						aria-label={`Фото ${i + 1}`}
					>
						{src ? (
							<Image
								src={src}
								alt={`${name} — фото ${i + 1}`}
								fill
								sizes="80px"
								className={`${styles.thumb__img}${cover ? " " + styles["thumb__img--cover"] : ""}`}
							/>
						) : (
							<div className={styles.ph} aria-hidden="true" />
						)}
					</button>
				))}
			</div>

			{hasImages &&
				mounted &&
				createPortal(
					<Lightbox
						images={images.map((src) => ({ src, alt: name }))}
						index={lb.index}
						onClose={lb.close}
						onPrev={lb.prev}
						onNext={lb.next}
					/>,
					document.body,
				)}
		</div>
	);
}
