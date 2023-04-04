import {defineConfig} from "vite";
import react from "@vitejs/plugin-react-swc";
import {VitePWA} from "vite-plugin-pwa";
import eslintPlugin from "@nabla/vite-plugin-eslint";

export default defineConfig({
  plugins: [
    react(),
    VitePWA(),
    eslintPlugin()
  ],
});
