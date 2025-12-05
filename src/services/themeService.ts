import type { OrgSettings } from '../types/orgSettings.ts';
import Color from 'color';

// Function to generate color shades from a base color
function generateColorShades(baseColor: string): Record<string, string> {
	try {
		const color = Color(baseColor);

		return {
			DEFAULT: baseColor,
			'50': color.lighten(0.4).hex(),
			'100': color.lighten(0.3).hex(),
			'200': color.lighten(0.2).hex(),
			'300': color.lighten(0.1).hex(),
			'400': color.lighten(0.05).hex(),
			'500': color.hex(),
			'600': color.darken(0.1).hex(),
			'700': color.darken(0.2).hex(),
			'800': color.darken(0.3).hex(),
			'900': color.darken(0.4).hex(),
		};
	} catch (error) {
		console.error(`Failed to generate color shades for ${baseColor}:`, error);
		return {
			DEFAULT: baseColor,
			'50': '#f8fafc',
			'100': '#f1f5f9',
			'200': '#e2e8f0',
			'300': '#cbd5e1',
			'400': '#94a3b8',
			'500': baseColor,
			'600': '#475569',
			'700': '#334155',
			'800': '#1e293b',
			'900': '#0f172a',
		};
	}
}

// Apply theme colors to CSS variables
export function applyTheme(theme: OrgSettings['Theme']): void {
	try {
		console.log('Applying theme:', theme);
		if (!theme) return;

		// Apply primary colors - always use a default even if not provided
		const primaryColor = theme.Primary || '#3B82F6';
		const primaryShades = generateColorShades(primaryColor);
		Object.entries(primaryShades).forEach(([shade, value]) => {
			const variableName = shade === 'DEFAULT' ? '--color-primary' : `--color-primary-${shade}`;
			document.documentElement.style.setProperty(variableName, value);
		});

		// Apply secondary colors - always use a default even if not provided
		const secondaryColor = theme.Secondary || '#64748B';
		const secondaryShades = generateColorShades(secondaryColor);
		Object.entries(secondaryShades).forEach(([shade, value]) => {
			const variableName = shade === 'DEFAULT' ? '--color-secondary' : `--color-secondary-${shade}`;
			document.documentElement.style.setProperty(variableName, value);
		});

		// Force a style refresh to ensure Tailwind picks up the new CSS variables
		document.body.classList.remove('theme-applied');
		void document.body.offsetWidth; // Trigger a reflow
		document.body.classList.add('theme-applied');

		console.log('Theme applied successfully');
	} catch (error) {
		console.error('Error applying theme:', error);
	}
}

// Reset theme to defaults from CSS
export function resetTheme(): void {
	try {
		// Instead of removing styles, let's just reset to our CSS defaults
		const defaultPrimary = '#3B82F6';
		const defaultSecondary = '#64748B';

		applyTheme({
			Primary: defaultPrimary,
			Secondary: defaultSecondary
		});

		console.log('Theme reset to defaults');
	} catch (error) {
		console.error('Error resetting theme:', error);
	}
}