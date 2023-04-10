import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mkcert from "vite-plugin-mkcert";
import svgrPlugin from "vite-plugin-svgr";
import viteTsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    base: "/app",
    server: {
        https: true,
        port: 6363,
    },
    plugins: [react(), viteTsconfigPaths(), svgrPlugin(), mkcert()],
});