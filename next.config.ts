import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	trailingSlash: true,
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"],
	},
	images: {
		unoptimized: true,
	},
};

export default nextConfig;
