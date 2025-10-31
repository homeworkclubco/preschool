// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
    integrations: [
        starlight({
            title: 'Preschool',
            customCss: [
                // Relative path to your custom CSS file
                // '../dist/styles/index.css'
            ],
            social: [
                {
                    icon: 'github',
                    label: 'GitHub',
                    href: 'https://github.com/withastro/starlight',
                },
            ],
            sidebar: [
                {
                    label: 'Getting Started',
                    autogenerate: { directory: 'get-started' },
                },
                {
                    label: 'Layouts',
                    autogenerate: { directory: 'layouts' },
                },
                {
                    label: 'Components',
                    autogenerate: { directory: 'components' },
                    // items: [
                    // 	// Each item here is one entry in the navigation menu.
                    // 	{ label: 'Dropdown', slug: 'components/dropdown' },
                    // ],
                },
                {
                    label: 'Utilities',
                    autogenerate: { directory: 'utilities' },
                },
                {
                    label: 'Reference',
                    autogenerate: { directory: 'reference' },
                },
            ],
        }),
    ],
});
