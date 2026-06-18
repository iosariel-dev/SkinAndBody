import type { ReactElement, SVGProps } from "react";

interface OstentatiousCrossIconProps extends SVGProps<SVGSVGElement> {
	size?: number;
}

export function OstentatiousCrossIcon({
	size = 24,
	className,
	...props
}: OstentatiousCrossIconProps): ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 6 6"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<path d="M4.75 1L0.75 5M2.75 3L4.75 5M0.75 1L1.75 2" />
		</svg>
	);
}
