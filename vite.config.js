import { defineConfig } from "vite";
import path from "path"; // Import completo do path

export default defineConfig({
  base: "/stm_web/",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"), // login
        home: path.resolve(__dirname, "home.html"), // home
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      components: path.resolve(__dirname, "./src/components"),
      pages: path.resolve(__dirname, "./src/pages"),
      contexts: path.resolve(__dirname, "./src/web"),
    },
  },
});
