import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// Spotify only accepts loopback redirect URIs on 127.0.0.1 (not "localhost"),
// so the dev server is pinned to http://127.0.0.1:3000 to match the registered URI.
const devServer = { host: '127.0.0.1', port: 3000, strictPort: true };

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: devServer,
    preview: devServer,
    build: {
        // Firebase Hosting serves ./build.
        outDir: 'build',
        rollupOptions: {
            output: {
                // GSAP changes far less often than app code: its own chunk stays cached across deploys.
                manualChunks: (id) => (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap') ? 'gsap' : undefined),
            },
        },
    },
    test: {
        environment: 'jsdom',
        environmentOptions: { jsdom: { url: 'http://127.0.0.1:3000/' } },
        globals: true,
        setupFiles: './src/test/setup.ts',
        css: { modules: { classNameStrategy: 'non-scoped' } },
    },
});
