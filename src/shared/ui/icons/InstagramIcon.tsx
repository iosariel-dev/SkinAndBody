import type { ReactElement, SVGProps } from "react";

interface InstagramIconProps extends SVGProps<SVGSVGElement> {
	size?: number;
}

export function InstagramIcon({
	size = 24,
	className,
	...props
}: InstagramIconProps): ReactElement {
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
			<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
			<path d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37m1.5-4.87h.01" />
		</svg>
	);
}
