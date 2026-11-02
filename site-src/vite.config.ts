import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Builds straight into the repo root, which GitHub Pages serves.
// Only index.html and the app/ folder are replaced; cases/, assets/, css/, js/ are left alone.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: { outDir: "..", emptyOutDir: false, assetsDir: "app" },
});
