import type { ReactElement } from "react";
import type { Metadata } from "next";

const TARGET = "https://skinandbody.ru/epilation/";

export const metadata: Metadata = {
	title: "Лазерная эпиляция — переход на /epilation/",
	robots: { index: false, follow: true },
	alternates: { canonical: TARGET },
	other: {
		"http-equiv": "refresh",
	},
};

export default function LaserRedirectPage(): ReactElement {
	return (
		<>
			<meta httpEquiv="refresh" content={`0; url=${TARGET}`} />
			<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", textAlign: "center" }}>
				<div>
					<p>Страница переехала.</p>
					<p>
						Если переадресация не сработала автоматически —{" "}
						<a href={TARGET}>перейдите на страницу лазерной эпиляции</a>.
					</p>
				</div>
			</div>
		</>
	);
}
