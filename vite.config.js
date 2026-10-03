import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const base = process.env.GITHUB_ACTIONS === "true" && repositoryName && !repositoryName.endsWith(".github.io")
  ? `/${repositoryName}/`
  : "/";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["arise-mark.svg", "arise-192.png", "arise-512.png"],
      manifest: {
        name: "Arise - Personal Productivity RPG",
        short_name: "Arise",
        description: "A personal productivity RPG for building consistent habits.",
        theme_color: "#fff8f5",
        background_color: "#fff8f5",
        display: "standalone",
        start_url: "./",
        scope: "./",
        icons: [
          {
            src: "arise-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "arise-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "arise-mark.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
  base,
});