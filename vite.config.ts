import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// base "./" keeps asset paths relative, so the built site works on
// GitHub Pages project pages, any subfolder, or a plain file server.
export default defineConfig({
  plugins: [svelte()],
  base: "./",
});
