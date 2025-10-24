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
				// '../dist/style.css'
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Components',
					autogenerate: { directory: 'components' },
					// items: [
					// 	// Each item here is one entry in the navigation menu.
					// 	{ label: 'Dropdown', slug: 'components/dropdown' },
					// ],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
