import type { ReactElement } from "react";
import type { JsonLdSchema } from "./schemas";

interface JsonLdProps {
	data: JsonLdSchema | JsonLdSchema[];
}

export function JsonLd({ data }: JsonLdProps): ReactElement {
	const schemas = Array.isArray(data) ? data : [data];

	return (
		<>
			{schemas.map((schema, i) => (
				<script
					key={i}
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(schema),
					}}
				/>
			))}
		</>
	);
}
