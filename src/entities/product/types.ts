export interface ProductVariant {
	volume: string;
	price: string;
}

export interface ProductData {
	slug: string;
	name: string;
	brand: string;
	category: string;
	// volume/price — основной вариант (первый из variants, если они есть).
	volume: string;
	forWhom?: string;
	price: string;
	// Старая цена (зачёркнутая) — если наша цена ниже референсной. Показывает скидку.
	oldPrice?: string;
	// Внутренний флаг: цена под вопросом, требует сверки (на витрине не показывается).
	priceUncertain?: boolean;
	// Несколько объёмов на выбор. Если задано — в карточке показывается селектор.
	variants?: ProductVariant[];
	images: string[];
	description: string;
	composition: string[];
	usage?: string;
	badge?: "new" | "hit";
	// Наличие. По умолчанию (поле опущено) товар считается в наличии.
	// "on_order" — редкий товар под заказ: наличие и срок уточняем после оформления.
	availability?: "in_stock" | "on_order";
	related?: string[];
	// Зарезервировано под будущий расчёт доставки СДЭК (опционально).
	weight?: number;
	dimensions?: { l: number; w: number; h: number };
}

export interface ProductCategory {
	key: string;
	title: string;
}

export interface ProductBrand {
	slug: string;
	// name совпадает с ProductData.brand (по нему фильтруем товары)
	name: string;
	title: string;
	tagline: string;
	description: string;
	logo: string;
	// Яркий блок-акцент рядом с заголовком на странице бренда (опционально)
	heroBadge?: string;
}
