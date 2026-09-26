import { fileURLToPath } from "node:url";
import { defineConfig, mergeConfig } from "vitest/config";
import baseConfig from "../../vitest.base.ts";

export default mergeConfig(
	baseConfig,
	defineConfig({
		test: { environment: "node", include: ["test/**/*.test.ts"] },
		resolve: {
			conditions: ["source"],
			alias: [
				// Source-only coding-agent experimental modules used by the Endophasia runtime layer.
				{
					find: /^@earendil-works\/pi-coding-agent\/experimental\/(.+)$/,
					replacement: `${fileURLToPath(new URL("../coding-agent/src/experimental/", import.meta.url))}$1.ts`,
				},
			],
		},
		ssr: { resolve: { conditions: ["source"] } },
	}),
);
