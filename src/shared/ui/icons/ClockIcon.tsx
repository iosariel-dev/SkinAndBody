import type { ReactElement, SVGProps } from "react";

interface ClockIconProps extends SVGProps<SVGSVGElement> {
	size?: number;
}

export function ClockIcon({
	size = 24,
	className,
	...props
}: ClockIconProps): ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
			{...props}
		>
			<circle cx="12" cy="12" r="10" />
			<path d="M12 6v6l4-2" />
		</svg>
	);
}
