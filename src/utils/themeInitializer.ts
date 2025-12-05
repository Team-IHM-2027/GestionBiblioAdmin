/**
 * Theme Initializer for GestionBiblioAdmin
 * Using specific colors as requested by user
 */

/**
 * Initialize default theme colors in the :root CSS variables
 */
export const initializeDefaultTheme = (): void => {
	console.log('Initializing default theme colors');

	// Primary color (chocolate/D2691EFF - used for important text, buttons, accents)
	const primaryColor = '#D2691E';
	document.documentElement.style.setProperty('--color-primary', primaryColor);
	document.documentElement.style.setProperty('--color-primary-50', '#FCF5F1');
	document.documentElement.style.setProperty('--color-primary-100', '#F9ECE3');
	document.documentElement.style.setProperty('--color-primary-200', '#F3D9C8');
	document.documentElement.style.setProperty('--color-primary-300', '#EBC5AC');
	document.documentElement.style.setProperty('--color-primary-400', '#E3A883');
	document.documentElement.style.setProperty('--color-primary-500', '#D2691E');
	document.documentElement.style.setProperty('--color-primary-600', '#BC5D1B');
	document.documentElement.style.setProperty('--color-primary-700', '#A65218');
	document.documentElement.style.setProperty('--color-primary-800', '#8F4615');
	document.documentElement.style.setProperty('--color-primary-900', '#773B11');

	// Secondary color (beige/E7DAC1FF - used for backgrounds, cards)
	const secondaryColor = '#E7DAC1';
	document.documentElement.style.setProperty('--color-secondary', secondaryColor);
	document.documentElement.style.setProperty('--color-secondary-50', '#FDFCFA');
	document.documentElement.style.setProperty('--color-secondary-100', '#FAF8F5');
	document.documentElement.style.setProperty('--color-secondary-200', '#F6F2EA');
	document.documentElement.style.setProperty('--color-secondary-300', '#F1EBE0');
	document.documentElement.style.setProperty('--color-secondary-400', '#ECE3D0');
	document.documentElement.style.setProperty('--color-secondary-500', '#E7DAC1');
	document.documentElement.style.setProperty('--color-secondary-600', '#D0C4AD');
	document.documentElement.style.setProperty('--color-secondary-700', '#B8AE99');
	document.documentElement.style.setProperty('--color-secondary-800', '#A19884');
	document.documentElement.style.setProperty('--color-secondary-900', '#8A826F');
};

/**
 * Apply specific theme colors to the document
 */
export const applyThemeColors = (primary?: string, secondary?: string): void => {
	// Generate a timestamp for logging
	const timestamp = new Date().toISOString();
	console.log(`[${timestamp}] Applying theme colors:`, { primary, secondary });

	try {
		// Apply primary color
		if (primary) {
			document.documentElement.style.setProperty('--color-primary', primary);

			// Generate shades manually
			const primaryWithOpacity = (opacity: number) => {
				// Convert hex to rgba with opacity
				const hex = primary.replace('#', '');
				const r = parseInt(hex.substring(0, 2), 16);
				const g = parseInt(hex.substring(2, 4), 16);
				const b = parseInt(hex.substring(4, 6), 16);
				return `rgba(${r}, ${g}, ${b}, ${opacity})`;
			};

			// Set lighter shades
			document.documentElement.style.setProperty('--color-primary-50', primaryWithOpacity(0.05));
			document.documentElement.style.setProperty('--color-primary-100', primaryWithOpacity(0.1));
			document.documentElement.style.setProperty('--color-primary-200', primaryWithOpacity(0.2));
			document.documentElement.style.setProperty('--color-primary-300', primaryWithOpacity(0.3));
			document.documentElement.style.setProperty('--color-primary-400', primaryWithOpacity(0.4));
			document.documentElement.style.setProperty('--color-primary-500', primary);

			// Set darker shades
			const darken = (color: string, amount: number) => {
				const hex = color.replace('#', '');
				let r = parseInt(hex.substring(0, 2), 16);
				let g = parseInt(hex.substring(2, 4), 16);
				let b = parseInt(hex.substring(4, 6), 16);

				r = Math.max(0, Math.floor(r * (1 - amount)));
				g = Math.max(0, Math.floor(g * (1 - amount)));
				b = Math.max(0, Math.floor(b * (1 - amount)));

				return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
			};

			document.documentElement.style.setProperty('--color-primary-600', darken(primary, 0.1));
			document.documentElement.style.setProperty('--color-primary-700', darken(primary, 0.2));
			document.documentElement.style.setProperty('--color-primary-800', darken(primary, 0.3));
			document.documentElement.style.setProperty('--color-primary-900', darken(primary, 0.4));
		}

		// Apply secondary color
		if (secondary) {
			document.documentElement.style.setProperty('--color-secondary', secondary);

			// Generate shades manually
			const secondaryWithOpacity = (opacity: number) => {
				// Convert hex to rgba with opacity
				const hex = secondary.replace('#', '');
				const r = parseInt(hex.substring(0, 2), 16);
				const g = parseInt(hex.substring(2, 4), 16);
				const b = parseInt(hex.substring(4, 6), 16);
				return `rgba(${r}, ${g}, ${b}, ${opacity})`;
			};

			// Set lighter shades
			document.documentElement.style.setProperty('--color-secondary-50', secondaryWithOpacity(0.05));
			document.documentElement.style.setProperty('--color-secondary-100', secondaryWithOpacity(0.1));
			document.documentElement.style.setProperty('--color-secondary-200', secondaryWithOpacity(0.2));
			document.documentElement.style.setProperty('--color-secondary-300', secondaryWithOpacity(0.3));
			document.documentElement.style.setProperty('--color-secondary-400', secondaryWithOpacity(0.4));
			document.documentElement.style.setProperty('--color-secondary-500', secondary);

			// Set darker shades
			const darken = (color: string, amount: number) => {
				const hex = color.replace('#', '');
				let r = parseInt(hex.substring(0, 2), 16);
				let g = parseInt(hex.substring(2, 4), 16);
				let b = parseInt(hex.substring(4, 6), 16);

				r = Math.max(0, Math.floor(r * (1 - amount)));
				g = Math.max(0, Math.floor(g * (1 - amount)));
				b = Math.max(0, Math.floor(b * (1 - amount)));

				return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
			};

			document.documentElement.style.setProperty('--color-secondary-600', darken(secondary, 0.1));
			document.documentElement.style.setProperty('--color-secondary-700', darken(secondary, 0.2));
			document.documentElement.style.setProperty('--color-secondary-800', darken(secondary, 0.3));
			document.documentElement.style.setProperty('--color-secondary-900', darken(secondary, 0.4));
		}

		// Force a re-render of the theme
		document.body.classList.add('theme-updated');
		setTimeout(() => {
			document.body.classList.remove('theme-updated');
		}, 10);

		console.log(`[${timestamp}] Theme colors applied successfully`);
	} catch (error) {
		console.error(`[${timestamp}] Error applying theme colors:`, error);
	}
};