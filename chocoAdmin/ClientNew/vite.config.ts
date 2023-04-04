import eslintPlugin from "@nabla/vite-plugin-eslint";
import react from "@vitejs/plugin-react-swc";
import {defineConfig} from "vite";
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA(),
    eslintPlugin()
  ],
});
