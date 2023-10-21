import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import taichi from "rollup-plugin-taichi";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      plugins: [taichi()],
    },
  },
  plugins: [react()],
  base: "https://github.com/jeroldleung/webmpm",
});
