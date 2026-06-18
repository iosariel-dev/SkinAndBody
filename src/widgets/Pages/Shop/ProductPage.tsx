import type { ReactElement } from "react";
import Link from "next/link";
import Image from "next/image";

import styles from "./ProductPage.module.scss";
import {
	getCategoryTitle,
	getRelatedProducts,
	getBrandSlugByName,
} from "@/entities/product";
import type { ProductData } from "@/entities/product";
import { BagIcon } from "@/shared/ui/icons/BagIcon";
import { ClockIcon } from "@/shared/ui/icons/ClockIcon";
import { ProductGallery } from "./ProductGallery";
import { ProductPurchase } from "./ProductPurchase";
import { Accordion } from "./Accordion";

export function ProductPage({ product }: { product: ProductData }): ReactElement {
	const categoryTitle = getCategoryTitle(product.category);
	const related = getRelatedProducts(product.slug);
	const onOrder = product.availability === "on_order";
	const brandSlug = getBrandSlugByName(product.brand);
	const brandBase = brandSlug ? `/shop/brand/${brandSlug}/` : "/shop/";

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				{/* ===== BREADCRUMB ===== */}
				<nav className={styles.crumbs} aria-label="Хлебные крошки">
					<Link href="/shop/" className={styles.crumbs__link}>
						Магазин
					</Link>
					<span className={styles.crumbs__sep}>/</span>
					<Link href={brandBase} className={styles.crumbs__link}>
						{product.brand}
					</Link>
					<span className={styles.crumbs__sep}>/</span>
					<Link href={`${brandBase}#cat-${product.category}`} className={styles.crumbs__link}>
						{categoryTitle}
					</Link>
					<span className={styles.crumbs__sep}>/</span>
					<span className={styles.crumbs__current}>{product.name}</span>
				</nav>

				{/* ===== PRODUCT ===== */}
				<section className={styles.product}>
					{/* Gallery */}
					<ProductGallery
						images={product.images}
						name={`${product.name} — ${product.brand}`}
						onOrder={onOrder}
						cover={product.brand === "Skin Synergy"}
					/>

					{/* Info */}
					<div className={styles.product__info}>
						<span className={styles.product__brand}>{product.brand}</span>
						<h1 className={styles.product__name}>{product.name}</h1>
						<span className={styles.product__vol}>
							{product.volume}
							{product.forWhom ? ` · ${product.forWhom}` : ""}
						</span>

						<ProductPurchase product={product} />

						{onOrder ? (
							<div className={`${styles["ship-note"]} ${styles["ship-note--order"]}`}>
								<ClockIcon size={20} className={styles["ship-note__icon"]} />
								<div>
									<b>Товар под заказ.</b> Это редкая позиция — наличие и срок
									поставки уточним после оформления. Оплата онлайн при заказе.
								</div>
							</div>
						) : (
							<div className={styles["ship-note"]}>
								<BagIcon size={20} className={styles["ship-note__icon"]} />
								<div>
									<b>Самовывоз из студии — бесплатно.</b> Доставка по городу — по
									договорённости после заказа. Оплата онлайн при оформлении.
								</div>
							</div>
						)}

						{/* Accordions */}
						<Accordion title="Описание" defaultOpen>
							{product.description}
						</Accordion>

						<Accordion title="Активные компоненты">
							<div className={styles.compo}>
								{product.composition.map((ingredient) => (
									<span key={ingredient} className={styles.compo__item}>
										{ingredient}
									</span>
								))}
							</div>
						</Accordion>

						{product.usage && (
							<Accordion title="Способ применения">{product.usage}</Accordion>
						)}
					</div>
				</section>

				{/* ===== RELATED ===== */}
				{related.length > 0 && (
					<section className={styles.related}>
						<h2 className={styles.related__title}>С этим покупают</h2>
						<div className={styles.related__row}>
							{related.map((item) => (
								<Link
									key={item.slug}
									href={`/shop/${item.slug}/`}
									className={styles.rcard}
								>
									<div className={styles.rcard__media}>
										{item.images[0] ? (
											<Image
												src={item.images[0]}
												alt={`${item.name} — ${item.brand}`}
												fill
												sizes="250px"
												className={`${styles.rcard__img}${item.brand === "Skin Synergy" ? " " + styles["rcard__img--cover"] : ""}`}
											/>
										) : (
											<div className={styles.ph} aria-hidden="true" />
										)}
									</div>
									<span className={styles.rcard__name}>{item.name}</span>
									<small className={styles.rcard__meta}>
										{item.brand} · {item.volume}
									</small>
									<span className={styles.rcard__price}>{item.price}</span>
								</Link>
							))}
						</div>
					</section>
				)}
			</div>
		</div>
	);
}
