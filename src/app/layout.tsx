import type { ReactNode } from "react";
import "./styles/index.scss";

import type { Metadata, Viewport } from "next";
import { Karla, Libre_Baskerville } from "next/font/google";

import { Providers } from "./Providers";
import { Header } from "@/widgets/Header";
import { Footer } from "@/widgets/Footer";
import { CookieBanner } from "@/widgets/CookieBanner";
import { config } from "@/shared/config";

const karla = Karla({
	subsets: ["latin", "latin-ext"],
	variable: "--font-body",
	display: "swap",
	weight: ["300", "400", "500", "600"],
});

const libreBaskerville = Libre_Baskerville({
	subsets: ["latin"],
	variable: "--font-heading",
	display: "swap",
	weight: ["400", "700"],
	style: ["normal", "italic"],
});

const SITE_NAME = "Skin&Body";
const SITE_URL = config.SITE_URL;
const SITE_DESCRIPTION =
	"Студия эстетики лица и тела Skin&Body в Ульяновске. Лазерная эпиляция, чистки, пилинги, LPG, RF-лифтинг, микротоки. Два филиала.";

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: {
		default: `${SITE_NAME} — Студия эстетики лица и тела в Ульяновске`,
		template: `%s | ${SITE_NAME}`,
	},
	description: SITE_DESCRIPTION,
	keywords: [
		"эстетика лица и тела Ульяновск",
		"лазерная эпиляция Ульяновск",
		"LPG Ульяновск",
		"чистка лица",
		"пилинг",
		"RF-лифтинг",
		"микротоковая терапия",
		"депиляция",
		"EMS",
		"Skin&Body",
	],
	authors: [{ name: SITE_NAME }],
	creator: SITE_NAME,
	openGraph: {
		type: "website",
		locale: "ru_RU",
		url: SITE_URL,
		siteName: SITE_NAME,
		title: `${SITE_NAME} — Студия эстетики лица и тела в Ульяновске`,
		description: SITE_DESCRIPTION,
		images: [
			{
				url: "/images/og-image.png",
				width: 1200,
				height: 630,
				alt: SITE_NAME,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `${SITE_NAME} — Студия эстетики лица и тела в Ульяновске`,
		description: SITE_DESCRIPTION,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	alternates: {
		canonical: SITE_URL,
	},
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{ url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
			{ url: "/icon-192.png", sizes: "192x192", type: "image/png" },
			{ url: "/icon-512.png", sizes: "512x512", type: "image/png" },
		],
		apple: { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
	},
	manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 5,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
}>): ReactNode {
	// suppressHydrationWarning: inline-скрипт куки-баннера ставит data-cookie
	// на <html> до гидратации — без этого React ругается на несовпадение атрибута.
	return (
		<html
			lang="ru"
			className={`${karla.variable} ${libreBaskerville.variable}`}
			suppressHydrationWarning
		>
			<body>
				<Providers>
					<Header />
					<main>{children}</main>
					<Footer />
				</Providers>
				<CookieBanner />
				{/* honeypot: скрытая ссылка-ловушка для парсеров (в robots.txt — Disallow).
				    Не видна людям и скринридерам; боты, игнорирующие robots.txt, попадают
				    на /trap.php, который логирует IP/UA/время. */}
				<a
					href="/trap.php"
					rel="nofollow"
					aria-hidden="true"
					tabIndex={-1}
					style={{
						position: "absolute",
						left: "-9999px",
						width: 1,
						height: 1,
						overflow: "hidden",
					}}
				>
					Служебная ссылка
				</a>
			</body>
		</html>
	);
}
