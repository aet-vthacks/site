import react from "@vitejs/plugin-react";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const path = dirname(fileURLToPath(import.meta.url));
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			components: resolve(path, "src/components"),
			pages: resolve(path, "src/pages")
		}
	}
});
