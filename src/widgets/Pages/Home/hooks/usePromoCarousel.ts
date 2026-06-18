"use client";

import { useCallback, useRef, useState } from "react";

/**
 * Горизонтальный scroll-snap слайдер промо-акций: стрелки (по карточке),
 * точки (scrollTo по доле) и синхронизация активной точки со скроллом.
 */
export function usePromoCarousel(count: number) {
	const sliderRef = useRef<HTMLDivElement>(null);
	const [activePromo, setActivePromo] = useState(0);

	const scrollByCard = useCallback((direction: -1 | 1) => {
		const slider = sliderRef.current;
		if (!slider) return;
		const card = slider.children[0] as HTMLElement | undefined;
		if (!card) return;
		const step = card.offsetWidth + 28; // card width + gap
		slider.scrollBy({ left: direction * step, behavior: "smooth" });
	}, []);

	const scrollToPromo = useCallback((index: number) => {
		const slider = sliderRef.current;
		if (!slider) return;
		const { scrollWidth, clientWidth } = slider;
		const maxScroll = scrollWidth - clientWidth;
		const targetScroll = (index / (count - 1)) * maxScroll;
		slider.scrollTo({ left: targetScroll, behavior: "smooth" });
	}, [count]);

	const handleSliderScroll = useCallback(() => {
		const slider = sliderRef.current;
		if (!slider) return;
		const { scrollLeft, scrollWidth, clientWidth } = slider;
		const maxScroll = scrollWidth - clientWidth;
		if (maxScroll <= 0) { setActivePromo(0); return; }
		const ratio = scrollLeft / maxScroll;
		const index = Math.round(ratio * (count - 1));
		setActivePromo(Math.min(Math.max(index, 0), count - 1));
	}, [count]);

	return { sliderRef, activePromo, scrollByCard, scrollToPromo, handleSliderScroll };
}
