import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
    base: "/app",
    server: {
        https: true,
        port: 6363
    },
    plugins: [
        react(),
        viteTsconfigPaths(),
        svgrPlugin(),
        mkcert()
    ],
});