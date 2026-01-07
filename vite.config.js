import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/stm_web",

  build: {
    sourcemap: false,
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),
        home: resolve(__dirname, "home.html"),
        map: resolve(__dirname, "map.html"),
      },
    },
  },

  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      components: resolve(__dirname, "./src/components"),
      pages: resolve(__dirname, "./src/pages"),
    },
  },
});
