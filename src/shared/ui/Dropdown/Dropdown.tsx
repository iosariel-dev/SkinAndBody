"use client";

import type { ReactElement } from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
	value: string;
	onChange: (value: string) => void;
	options: Array<{ value: string; label: string }>;
	placeholder?: string;
	id?: string;
}

export function Dropdown({
	value,
	onChange,
	options,
	placeholder = "Выберите...",
	id,
}: DropdownProps): ReactElement {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selectedLabel = options.find((o) => o.value === value)?.label || "";

	const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

	const select = useCallback(
		(val: string) => {
			onChange(val);
			setIsOpen(false);
		},
		[onChange],
	);

	// Close on outside click
	useEffect(() => {
		if (!isOpen) return;
		const handleClick = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [isOpen]);

	return (
		<div className={styles.dropdown} ref={ref} id={id}>
			<button
				type="button"
				className={`${styles.dropdown__trigger} ${isOpen ? styles["dropdown__trigger--open"] : ""}`}
				onClick={toggle}
				aria-expanded={isOpen}
			>
				<span
					className={`${styles.dropdown__value} ${!value ? styles["dropdown__value--placeholder"] : ""}`}
				>
					{value ? selectedLabel : placeholder}
				</span>
				<svg
					className={styles.dropdown__arrow}
					width="12"
					height="12"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				>
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</button>

			{isOpen && (
				<div className={styles.dropdown__menu}>
					{options.map((option) => (
						<button
							key={option.value}
							type="button"
							className={`${styles.dropdown__option} ${option.value === value ? styles["dropdown__option--selected"] : ""}`}
							onClick={() => select(option.value)}
						>
							{option.label}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
