import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // En Vercel (Root Directory = repo root) el output va a /dist en la raíz.
    outDir: process.env.VERCEL
      ? path.resolve(__dirname, "..", "dist")
      : "dist",
    emptyOutDir: Boolean(process.env.VERCEL),
  },
});
