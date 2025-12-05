import { useState, useEffect } from 'react';
import { fetchOrgConfiguration } from '../services/configService';
import type { OrgSettings } from "../types/orgSettings.ts";
import { defaultOrgSettings } from '../constants/defaultOrgSettings';

export const useOrgConfiguration = (orgName: string) => {
	const [config, setConfig] = useState<OrgSettings>(defaultOrgSettings);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let isMounted = true;

		const loadConfiguration = async () => {
			try {
				setLoading(true);
				setError(null);

				if (!orgName) {
					setConfig(defaultOrgSettings);
					setLoading(false);
					return;
				}

				console.log(`Loading configuration for: ${orgName}`);
				const orgConfig = await fetchOrgConfiguration(orgName);

				if (isMounted) {
					console.log('Setting configuration:', orgConfig);
					setConfig(orgConfig);
				}
			} catch (err) {
				if (isMounted) {
					console.error('Failed to load organization configuration:', err);
					const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
					setError(`Failed to load configuration: ${errorMessage}`);

					// Still set the default config to prevent blank page
					console.log('Using default configuration due to error');
					setConfig(defaultOrgSettings);
				}
			} finally {
				if (isMounted) {
					setLoading(false);
				}
			}
		};

		loadConfiguration();

		return () => {
			isMounted = false;
		};
	}, [orgName]);

	return { config, loading, error };
};