import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import taichi from "rollup-plugin-taichi";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/webmpm/",
  build: {
    rollupOptions: {
      plugins: [taichi()],
    },
  },
  plugins: [react()],
});
