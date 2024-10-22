import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Replace "username" with your GitHub username and "repo-name" with your repo name
const repoName = 'ClientProject'; // Your GitHub repo name

export default defineConfig({
  plugins: [react()],
  base: `/${repoName}/`, // Set base path for GitHub Pages
  server: {
    proxy: {
      "/api": {
        target: "https://a5f7-188-65-47-85.ngrok-free.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});

