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
    sourcemap: true,
  },

  resolve: {
    alias: {
      "@api": path.resolve(__dirname, "./src/api"),
      "@assets": path.resolve(__dirname, "./src/assets"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@config": path.resolve(__dirname, "./src/config"),
      "@lib": path.resolve(__dirname, "./src/lib"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@typesCustom": path.resolve(__dirname, "./src/types"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@workers": path.resolve(__dirname, "./src/workers"),
    },
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

  server: {
    port: 8000,
  },
  preview: {
    port: 8000,
  },

  clearScreen: false,
});
