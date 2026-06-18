"use client";

import { useEffect, useRef } from "react";

/**
 * Анимирует числа от 0 до целевого значения при появлении в viewport.
 * Добавьте атрибут data-count="386" на элемент с числом.
 * При скролле обратно — число сбрасывается и анимируется заново.
 */
export function useCountUp() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const elements = container.querySelectorAll<HTMLElement>("[data-count]");
		if (elements.length === 0) return;

		const animations = new Map<HTMLElement, number>();

		const animate = (el: HTMLElement) => {
			const raw = el.getAttribute("data-count") || "";
			const prefix = raw.replace(/[\d.]+.*$/, "");
			const suffix = raw.replace(/^[^0-9]*[\d.]+/, "");
			const match = raw.match(/[\d.]+/);
			if (!match) return;

			const target = parseFloat(match[0]);
			const isFloat = match[0].includes(".");
			const duration = 1200;
			const startTime = performance.now();

			const step = (now: number) => {
				const elapsed = now - startTime;
				const progress = Math.min(elapsed / duration, 1);
				// ease-out cubic
				const eased = 1 - Math.pow(1 - progress, 3);
				const current = target * eased;

				if (isFloat) {
					el.textContent = `${prefix}${current.toFixed(1)}${suffix}`;
				} else {
					el.textContent = `${prefix}${Math.round(current)}${suffix}`;
				}

				if (progress < 1) {
					animations.set(el, requestAnimationFrame(step));
				}
			};

			animations.set(el, requestAnimationFrame(step));
		};

		const reset = (el: HTMLElement) => {
			const frame = animations.get(el);
			if (frame) cancelAnimationFrame(frame);
			el.textContent = el.getAttribute("data-count")?.replace(/[\d.]+/, "0") || "0";
		};

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const el = entry.target as HTMLElement;
					if (entry.isIntersecting) {
						animate(el);
					} else {
						reset(el);
					}
				});
			},
			{ threshold: 0, rootMargin: "0px 0px -25% 0px" }
		);

		elements.forEach((el) => observer.observe(el));

		return () => {
			observer.disconnect();
			animations.forEach((frame) => cancelAnimationFrame(frame));
		};
	}, []);

	return containerRef;
}
