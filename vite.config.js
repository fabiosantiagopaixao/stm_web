// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/stm_web/",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"), // login
        home: resolve(__dirname, "home.html"), // home
      },
    },
  },
});
