import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

import path from "path";

import manifest from "./src/assets/manifest";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",

  build: {
    target: "ES2022",
  },

  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@workers": path.resolve(__dirname, "./src/workers"),
    },
  },

  server: {
    port: 8000,
  },
  preview: {
    port: 8000,
  },

  plugins: [
    react(),

    VitePWA({
      // base: "./",
      registerType: "autoUpdate",
      mode: "development",

      strategies: "injectManifest",
      srcDir: "src/workers",
      filename: "sw.ts",

      manifest,
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],

      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

        sourcemap: true,
      },

      devOptions: {
        enabled: true,
        type: "module", // docs say this doesn't work in firefox even though it does
      },
    }),
  ],
});
