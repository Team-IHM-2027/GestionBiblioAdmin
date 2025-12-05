import type { Config } from "tailwindcss";
import * as defaultTheme from "tailwindcss/defaultTheme";

// Safelist color classes to ensure they're included in the build
const colorSafelist = [];

// Generate safelist for all color shades
const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
for (const shade of shades) {
	for (const color of ['primary', 'secondary']) {
		for (const type of ['bg', 'text', 'border']) {
			colorSafelist.push(`${type}-${color}`);
			colorSafelist.push(`${type}-${color}-${shade}`);
			colorSafelist.push(`hover:${type}-${color}-${shade}`);
		}
	}
}

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	safelist: colorSafelist,
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
				'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
				'body': ['Poppins', 'system-ui', 'sans-serif'],
				'title': ['Montserrat', 'system-ui', 'sans-serif'],
				'mono': ['Consolas', 'Monaco', 'monospace'],
			},
			colors: {
				// Dynamic theme colors using CSS variables (10-30-60 rule)
				'primary': {
					DEFAULT: 'var(--color-primary)',
					50: 'var(--color-primary-50)',
					100: 'var(--color-primary-100)',
					200: 'var(--color-primary-200)',
					300: 'var(--color-primary-300)',
					400: 'var(--color-primary-400)',
					500: 'var(--color-primary-500)',
					600: 'var(--color-primary-600)',
					700: 'var(--color-primary-700)',
					800: 'var(--color-primary-800)',
					900: 'var(--color-primary-900)',
				},
				'secondary': {
					DEFAULT: 'var(--color-secondary)',
					50: 'var(--color-secondary-50)',
					100: 'var(--color-secondary-100)',
					200: 'var(--color-secondary-200)',
					300: 'var(--color-secondary-300)',
					400: 'var(--color-secondary-400)',
					500: 'var(--color-secondary-500)',
					600: 'var(--color-secondary-600)',
					700: 'var(--color-secondary-700)',
					800: 'var(--color-secondary-800)',
					900: 'var(--color-secondary-900)',
				},
				// Keep your existing color definitions
				'success': {
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					500: '#22c55e',
					700: '#15803d',
				},
				'error': {
					50: '#fef2f2',
					100: '#fee2e2',
					200: '#fecaca',
					500: '#ef4444',
					700: '#b91c1c',
				},
				'warning': {
					50: '#fff7ed',
					100: '#ffedd5',
					500: '#f97316',
					700: '#c2410c',
				},
				'info': {
					50: '#eff6ff',
					100: '#dbeafe',
					200: '#bfdbfe',
					500: '#3b82f6',
					700: '#1d4ed8',
				},
			},
		},
	},
	plugins: [],
	variants: {
		extend: {
			backgroundColor: ['dark', 'neutral', 'hover'],
			textColor: ['dark', 'neutral', 'hover'],
			borderColor: ['dark', 'neutral', 'hover'],
		}
	}
};

export default config;