import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import preact from "@preact/preset-vite";
import path from "path";

// https://vitejs.dev/config/

/** @type {import('vite').UserConfig} */
export default defineConfig({
  resolve: {
    alias: {
      react: path.resolve(__dirname, "./node_modules/preact/compat"),
      "react-dom": path.resolve(__dirname, "./node_modules/preact/compat"),
    },
  },
  plugins: [
    nodePolyfills({
      include: ["events"],
    }),
    preact(),
  ],
  define: {
    APP_VERSION: JSON.stringify(require("./package.json").version),
  },
});
