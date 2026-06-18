export interface PriceItem {
	name: string;
	description?: string;
	price: string;
}

export interface PriceTier {
	label: string;
	note?: string;
	complexLabel?: string;
	singleLabel?: string;
	complexFirst?: boolean;
	items: PriceItem[];
}

export interface HeroMeta {
	value: string;
	label: string;
}

export interface ServiceData {
	slug: string;
	title: string;
	titleAccusative?: string;
	subtitle: string;
	heroImage: string;
	heroImageAlt?: string;
	heroImagePosition?: string;
	heroTagline?: string;
	heroMeta?: HeroMeta[];
	heroFloatLabel?: string;
	heroFloatValue?: string;
	heroBadgeValue?: string;
	heroBadgeLabel?: string;
	metaTitle: string;
	metaDescription: string;
	procedure: {
		title: string;
		description: string;
		image: string;
		imageAlt?: string;
		steps?: string[];
		note?: string;
	};
	procedures?: Array<{
		title: string;
		description: string;
		image: string;
		imagePosition?: string;
	}>;
	results: string[];
	beforeAfter?: Array<{
		image: string;
		alt?: string;
	}>;
	equipment?: {
		title: string;
		items: string[];
		image: string;
		imageAlt?: string;
		documentsLink?: string;
	};
	trialOffer?: {
		title: string;
		price: string;
		note?: string;
	};
	prices: PriceTier[];
	showConsultation?: boolean;
	hasInstallments?: boolean;
}
