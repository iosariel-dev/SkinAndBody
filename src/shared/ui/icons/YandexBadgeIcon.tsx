import type { ReactElement, SVGProps } from "react";

interface YandexBadgeIconProps extends SVGProps<SVGSVGElement> {
	size?: number;
}

export function YandexBadgeIcon({
	size = 40,
	className,
	...props
}: YandexBadgeIconProps): ReactElement {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 1000 562.72"
			width={size}
			height={size * 0.563}
			className={className}
			{...props}
		>
			<defs>
				<linearGradient id="yb-a" x1="914.71" y1="511.11" x2="699.76" y2="519.28" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-b" x1="982.42" y1="352.99" x2="806.72" y2="433.12" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-c" x1="989.88" y1="171.21" x2="876.73" y2="327.76" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-d" x1="899.06" y1="-0.64" x2="882.99" y2="197.44" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-e" x1="85.33" y1="511.11" x2="300.27" y2="519.28" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-f" x1="17.61" y1="352.98" x2="193.31" y2="433.12" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-g" x1="10.13" y1="171.21" x2="123.27" y2="327.76" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-h" x1="100.97" y1="-0.64" x2="117.05" y2="197.44" gradientTransform="matrix(1 0 0 -1 202.34 643.63)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#fc0" />
					<stop offset="1" stopColor="#fe9b21" />
				</linearGradient>
				<linearGradient id="yb-i" x1="500.04" y1="16.76" x2="500.04" y2="553.85" gradientUnits="userSpaceOnUse">
					<stop offset="0" stopColor="#f22411" />
					<stop offset="1" stopColor="#ff6122" />
				</linearGradient>
			</defs>
			{/* Right petals */}
			<path fill="url(#yb-a)" d="M700.28 516.9c31.72-33.98 119.7-88.8 215.41-5.26-51.38 57-139.61 76.3-215.41 5.26z" />
			<path fill="url(#yb-b)" d="M805.09 427.17c25.89-82.53 111.25-110.18 180-69.04 18.23 71.58-96.48 115.94-180 69.04z" />
			<path fill="url(#yb-c)" d="M869.89 321.22c-10.96-96.78 51.27-149.56 127.18-144.8 17.55 85.22-46.33 148.49-127.15 144.8z" />
			<path fill="url(#yb-d)" d="M875.12 195.75C820.52 119.84 831.12 54.6 907 0c54.64 75.87 44.04 141.11-31.88 195.75z" />
			{/* Left petals */}
			<path fill="url(#yb-e)" d="M299.75 516.9c-31.72-33.98-119.7-88.8-215.41-5.26 51.38 57 139.61 76.3 215.41 5.26z" />
			<path fill="url(#yb-f)" d="M194.95 427.17c-25.92-82.53-111.29-110.18-180.03-69.07 18.23 71.58 103.48 115.94 179.96 69.03z" />
			<path fill="url(#yb-g)" d="M130.14 321.22c10.92-96.78-51.31-149.56-127.22-144.8-17.54 85.22 46.33 148.49 127.15 144.8z" />
			<path fill="url(#yb-h)" d="M124.91 195.75C179.52 119.84 168.92 54.6 93.05 0 38.41 75.87 49 141.11 124.91 195.75z" />
			{/* Center pin */}
			<path fill="url(#yb-i)" d="M500.02 16.76c-118.67.07-214.81 96.33-214.74 215 .03 56.87 22.61 111.4 62.78 151.65 38.89 38.92 130.48 95.24 135.92 154.36.79 8.84 7.23 16.08 16.04 16.08s15.25-7.23 16.04-16.08c5.44-59.12 96.93-115.3 135.81-154.22 83.91-83.92 83.9-219.97-.02-303.88-40.27-40.26-96.88-62.89-153.83-62.91z" />
			{/* White circle */}
			<circle fill="#fff" cx="500.02" cy="231.6" r="73.52" />
		</svg>
	);
}
