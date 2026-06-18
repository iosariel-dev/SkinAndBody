"use client";

import { useEffect, useRef } from "react";

/**
 * Автоматически добавляет reveal-анимацию на прямых детей каждой <section>.
 * По умолчанию при скролле вверх элементы плавно исчезают обратно.
 * once=true — появляются при скролле вниз и остаются (без обратного исчезновения).
 */
export function useReveal(once = false) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const sections = container.querySelectorAll("section");
		const targets: Element[] = [];

		sections.forEach((section, sectionIdx) => {
			if (sectionIdx === 0) return;
			if (section.hasAttribute("data-no-reveal")) return;

			const children = section.children;
			for (let i = 0; i < children.length; i++) {
				const child = children[i] as HTMLElement;
				child.style.opacity = "0";
				child.style.transform = "translateY(32px)";
				child.style.transition = `opacity 1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.2}s, transform 1s cubic-bezier(0.22, 1, 0.36, 1) ${i * 0.2}s`;
				targets.push(child);
			}
		});

		if (targets.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const el = entry.target as HTMLElement;
					if (entry.isIntersecting) {
						el.style.opacity = "1";
						el.style.transform = "translateY(0)";
						if (once) observer.unobserve(el);
					} else if (!once) {
						el.style.opacity = "0";
						el.style.transform = "translateY(32px)";
					}
				});
			},
			{ threshold: 0, rootMargin: "0px 0px -25% 0px" }
		);

		targets.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [once]);

	return containerRef;
}
