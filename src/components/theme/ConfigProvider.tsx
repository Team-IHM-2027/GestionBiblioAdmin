import React, { createContext, useContext, useEffect } from 'react';
import type { ReactNode} from 'react';
import { useOrgConfiguration } from '../../hooks/useOrgConfiguration.ts';
import type { OrgSettings } from '../../types/orgSettings.ts';
import { defaultOrgSettings } from '../../constants/defaultOrgSettings.ts';
import { initializeDefaultTheme, applyThemeColors } from '../../utils/themeInitializer.ts';

// Create context for organization configuration
interface ConfigContextType {
	config: OrgSettings;
	loading: boolean;
	error: string | null;
}

const ConfigContext = createContext<ConfigContextType>({
	config: defaultOrgSettings,
	loading: false,
	error: null
});

// Hook to use configuration
export const useConfig = () => useContext(ConfigContext);

interface ConfigProviderProps {
	children: ReactNode;
	orgName: string;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children, orgName }) => {
	const { config, loading, error } = useOrgConfiguration(orgName);

	// Initialize default theme on first render
	useEffect(() => {
		console.log("🎨 Initializing default theme");
		initializeDefaultTheme();
	}, []);

	// Update favicon dynamically when config.Logo changes
	useEffect(() => {
	if (!loading && config?.Logo) {
		const favicon = document.querySelector("link[rel='icon']") as HTMLLinkElement;

		if (favicon) {
		favicon.href = config.Logo; // Set the dynamic logo
		console.log("🔄 Favicon updated to:", config.Logo);
		} else {
		// If no favicon tag exists, create one
		const newFavicon = document.createElement("link");
		newFavicon.rel = "icon";
		newFavicon.href = config.Logo;
		document.head.appendChild(newFavicon);
		console.log("✨ Favicon element created:", config.Logo);
		}
	}
	}, [config, loading]);

	// Apply theme from configuration when it's loaded
	useEffect(() => {
		// Only apply theme when loading is complete and we have a config
		if (!loading && config) {
			console.log("🎭 Config loaded, checking theme:", config);

			if (config?.Theme) {
				console.log("✅ Theme found in config:", config.Theme);

				// Always apply the theme colors when the configuration changes
				const primary = config.Theme.Primary || defaultOrgSettings.Theme.Primary;
				const secondary = config.Theme.Secondary || defaultOrgSettings.Theme.Secondary;

				// Ensure we're applying valid colors
				if (primary && secondary) {
					console.log('🖌️ Applying colors:', { primary, secondary });
					applyThemeColors(primary, secondary);
				} else {
					console.warn('⚠️ Invalid theme colors in config:', { primary, secondary });
					applyThemeColors(
						defaultOrgSettings.Theme.Primary,
						defaultOrgSettings.Theme.Secondary
					);
				}
			} else {
				// Apply default theme if no theme found in config
				console.log('⚠️ No theme found in config, applying defaults');
				applyThemeColors(
					defaultOrgSettings.Theme.Primary,
					defaultOrgSettings.Theme.Secondary
				);
			}
		}
	}, [config, loading]);

	// Always provide a valid configuration
	const safeConfig = config || defaultOrgSettings;
	const contextValue = {
		config: safeConfig,
		loading,
		error
	};

	return (
		<ConfigContext.Provider value={contextValue}>
			{children}

			{/* Show error notification if there was a problem */}
			{error && (
				<div className="fixed bottom-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg max-w-xs z-50">
					<div className="flex">
						<div className="py-1"><svg className="h-6 w-6 text-red-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg></div>
						<div>
							<p className="font-bold">Configuration Error</p>
							<p className="text-sm">{error}</p>
							<p className="text-sm mt-1">Using default configuration.</p>
						</div>
					</div>
				</div>
			)}
		</ConfigContext.Provider>
	);
};