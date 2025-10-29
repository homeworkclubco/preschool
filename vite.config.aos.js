import { defineConfig } from 'vite';
import { resolve } from 'path';

// AOS standalone bundle config
export default defineConfig({
    build: {
        emptyOutDir: false, // Don't empty dist folder (main bundle already there)
        lib: {
            entry: resolve(__dirname, 'src/aos.js'),
            name: 'PreschoolAOS',
            formats: ['es', 'umd'],
            fileName: format => (format === 'es' ? 'aos.js' : 'aos.umd.cjs'),
        },
        rollupOptions: {
            output: {
                assetFileNames: assetInfo => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'aos.css';
                    }
                    return assetInfo.name;
                },
            },
        },
    },
    watch: {
        include: 'src/**',
    },
});
