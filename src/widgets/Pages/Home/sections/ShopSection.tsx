import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";

import styles from "../HomePage.module.scss";
import { shopBrands } from "../homeData";

export function ShopSection(): ReactElement {
	return (
		<section className={styles.shop} id="shop">
			<div className={styles.container}>
				<div className={styles.shop__head}>
					<span className={styles.section__eyebrow}>Интернет-магазин</span>
					<h2 className={styles.section__title}>
						Профессиональная <em>косметика</em>
					</h2>
				</div>
			</div>

			<div className={styles.shop__marquee}>
				<div className={styles.shop__track}>
					{[...shopBrands, ...shopBrands].map((b, i) => (
						<Link
							key={b.slug + "-" + i}
							href={`/shop/brand/${b.slug}/`}
							className={styles.shop__brand}
							aria-hidden={i >= shopBrands.length}
							tabIndex={i >= shopBrands.length ? -1 : undefined}
						>
							<Image
								src={b.logo}
								alt={`Косметика ${b.title}`}
								width={150}
								height={56}
								className={styles.shop__brandLogo}
							/>
						</Link>
					))}
				</div>
			</div>

			<div className={styles.container}>
				<div className={styles.shop__ctaWrap}>
					<Link href="/shop/" className={styles.shop__cta}>
						Перейти в магазин
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
						</svg>
					</Link>
				</div>
			</div>
		</section>
	);
}
