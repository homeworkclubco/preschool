import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'Preschool',
            formats: ['es', 'umd'],
            fileName: format =>
                format === 'es' ? 'preschool.js' : 'preschool.umd.cjs',
        },
        rollupOptions: {
            output: {
                assetFileNames: assetInfo => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'style.css';
                    }
                    return assetInfo.name;
                },
            },
        },
    },
    // watch: {
    //   include: 'src/**',
    // },
});
