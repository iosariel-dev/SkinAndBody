"use client";

import type { ReactElement, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import styles from "./ProductPage.module.scss";

interface AccordionProps {
	title: string;
	defaultOpen?: boolean;
	children: ReactNode;
}

const DURATION = 300;

export function Accordion({
	title,
	defaultOpen = false,
	children,
}: AccordionProps): ReactElement {
	const [open, setOpen] = useState(defaultOpen);
	const wrapRef = useRef<HTMLDivElement>(null);
	const animRef = useRef<Animation | null>(null);

	// Стартовое состояние высоты без анимации.
	useEffect(() => {
		const el = wrapRef.current;
		if (el) el.style.height = defaultOpen ? "auto" : "0px";
	}, [defaultOpen]);

	const toggle = (): void => {
		const el = wrapRef.current;
		const willOpen = !open;
		setOpen(willOpen);

		if (!el) return;
		animRef.current?.cancel();

		const startH = el.offsetHeight;
		el.style.height = "auto";
		const fullH = el.offsetHeight;
		const endH = willOpen ? fullH : 0;
		el.style.height = `${startH}px`;

		// Принудительный reflow, затем анимация к целевой высоте.
		void el.offsetHeight;
		const anim = el.animate(
			[{ height: `${startH}px` }, { height: `${endH}px` }],
			{ duration: DURATION, easing: "cubic-bezier(0.4, 0, 0.2, 1)" },
		);
		animRef.current = anim;
		anim.onfinish = () => {
			el.style.height = willOpen ? "auto" : "0px";
			animRef.current = null;
		};
	};

	return (
		<div className={`${styles.acc} ${open ? styles["acc--open"] : ""}`}>
			<button
				type="button"
				className={styles.acc__summary}
				onClick={toggle}
				aria-expanded={open}
			>
				{title}
			</button>
			<div ref={wrapRef} className={styles.acc__wrap}>
				<div className={styles.acc__body}>{children}</div>
			</div>
		</div>
	);
}
