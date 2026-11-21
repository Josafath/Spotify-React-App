import { fileURLToPath, URL } from 'node:url';
import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * Preloads the hashed font files matching `pattern` from index.html, so the browser fetches
 * them alongside the CSS and JS instead of discovering them only after the app renders text.
 * Build only: the dev server serves fonts unhashed and doesn't need it.
 */
function preloadFonts(pattern: RegExp): Plugin {
    return {
        name: 'jossify:preload-fonts',
        apply: 'build',
        transformIndexHtml: {
            order: 'post',
            handler(_html, ctx) {
                return Object.keys(ctx.bundle ?? {})
                    .filter((file) => pattern.test(file))
                    .map((file) => ({
                        tag: 'link',
                        attrs: { rel: 'preload', href: `/${file}`, as: 'font', type: 'font/woff2', crossorigin: '' },
                        injectTo: 'head-prepend' as const,
                    }));
            },
        },
    };
}

// Spotify only accepts loopback redirect URIs on 127.0.0.1 (not "localhost"),
// so the dev server is pinned to http://127.0.0.1:3000 to match the registered URI.
const devServer = { host: '127.0.0.1', port: 3000, strictPort: true };

export default defineConfig({
    // Only the Latin subset: it covers the UI copy. Latin Extended loads on demand for names that need it.
    plugins: [react(), preloadFonts(/figtree-latin-wght-normal-[\w-]+\.woff2$/)],
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
