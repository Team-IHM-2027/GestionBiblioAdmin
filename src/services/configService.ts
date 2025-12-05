import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type {OrgSettings} from "../types/orgSettings.ts";
import { defaultOrgSettings } from '../constants/defaultOrgSettings';

/**
 * Fetches organization configuration from Firebase
 * @param orgName - The name of the organization to fetch configuration for
 * @returns Promise containing organization settings
 */
export const fetchOrgConfiguration = async (orgName: string): Promise<OrgSettings> => {
	try {
		console.log(`Fetching configuration for organization: ${orgName}`);

		// First, try to get configuration from the biblio-panel repository structure
		const biblioConfigRef = doc(db, 'Configuration', 'OrgSettings');
		const biblioConfigSnap = await getDoc(biblioConfigRef);
		console.log('Global config exists:', biblioConfigSnap.exists());

		// If org-specific config exists in Configurations collection
		const orgConfigRef = doc(db, 'Configuration', orgName);
		const orgConfigSnap = await getDoc(orgConfigRef);
		console.log(`Org-specific config for ${orgName} exists:`, orgConfigSnap.exists());

		// Check if org-specific configuration exists first
		if (orgConfigSnap.exists()) {
			console.log(`Found configuration for ${orgName}`);
			const data = orgConfigSnap.data();
			console.log('Raw data from Firebase:', JSON.stringify(data, null, 2));
			// Merge with defaults to ensure all fields exist
			return mergeWithDefaults(data as Partial<OrgSettings>);
		}
		// Check if biblio-panel configuration exists
		else if (biblioConfigSnap.exists()) {
			console.log('Using global configuration from biblio-panel');
			const data = biblioConfigSnap.data();
			console.log('Raw data from Firebase:', JSON.stringify(data, null, 2));
			return mergeWithDefaults(data as Partial<OrgSettings>);
		}
		// Use defaults as last resort
		else {
			console.log('No configuration found, using defaults');
			return defaultOrgSettings;
		}
	} catch (error) {
		console.error('Error fetching organization configuration:', error);
		// Log more details about the error
		if (error instanceof Error) {
			console.error('Error name:', error.name);
			console.error('Error message:', error.message);
			console.error('Error stack:', error.stack);
		}
		return defaultOrgSettings;
	}
};

/**
 * Fetches the maximum simultaneous loans allowed from Firebase configuration
 * @returns Promise containing the maximum number of simultaneous loans
 */
export const fetchMaximumSimultaneousLoans = async (): Promise<number> => {
	try {
		console.log('Fetching MaximumSimultaneousLoans from Configuration/OrgSettings');

		const orgSettingsRef = doc(db, 'Configuration', 'OrgSettings');
		const orgSettingsSnap = await getDoc(orgSettingsRef);

		if (orgSettingsSnap.exists()) {
			const data = orgSettingsSnap.data();
			const maxLoans = data.MaximumSimultaneousLoans;
			
			console.log('MaximumSimultaneousLoans found:', maxLoans);
			
			// Validate that it's a valid number
			if (typeof maxLoans === 'number' && maxLoans > 0) {
				return maxLoans;
			} else {
				console.warn('Invalid MaximumSimultaneousLoans value, using default');
				return defaultOrgSettings.MaximumSimultaneousLoans || 3;
			}
		} else {
			console.log('OrgSettings document not found, using default MaximumSimultaneousLoans');
			return defaultOrgSettings.MaximumSimultaneousLoans || 3;
		}
	} catch (error) {
		console.error('Error fetching MaximumSimultaneousLoans:', error);
		return defaultOrgSettings.MaximumSimultaneousLoans || 3;
	}
};

/**
 * Fetches both organization configuration and maximum simultaneous loans
 * @param orgName - The name of the organization to fetch configuration for
 * @returns Promise containing organization settings with updated MaximumSimultaneousLoans
 */
export const fetchCompleteOrgConfiguration = async (orgName: string): Promise<OrgSettings> => {
	try {
		// Fetch the base organization configuration
		const orgConfig = await fetchOrgConfiguration(orgName);
		
		// Fetch the specific MaximumSimultaneousLoans value
		const maxLoans = await fetchMaximumSimultaneousLoans();
		
		// Merge the results
		return {
			...orgConfig,
			MaximumSimultaneousLoans: maxLoans
		};
	} catch (error) {
		console.error('Error fetching complete organization configuration:', error);
		return defaultOrgSettings;
	}
};

/**
 * Merges the provided configuration with default values
 * to ensure all required fields are present
 */
const mergeWithDefaults = (data: Partial<OrgSettings>): OrgSettings => {
	try {
		console.log('Merging with defaults');

		// First, handle potentially undefined nested objects
		const contact = data.Contact || {};
		const openingHours = data.OpeningHours || {};
		const theme = data.Theme || {};

		const result = {
			...defaultOrgSettings,
			...data,
			Contact: {
				...defaultOrgSettings.Contact,
				...contact
			},
			OpeningHours: {
				...defaultOrgSettings.OpeningHours,
				...openingHours
			},
			Theme: {
				...defaultOrgSettings.Theme,
				...theme
			}
		};

		// Ensure arrays are properly initialized
		if (!result.LateReturnPenalties || !Array.isArray(result.LateReturnPenalties)) {
			result.LateReturnPenalties = defaultOrgSettings.LateReturnPenalties;
		}

		if (!result.SpecificBorrowingRules || !Array.isArray(result.SpecificBorrowingRules)) {
			result.SpecificBorrowingRules = defaultOrgSettings.SpecificBorrowingRules;
		}

		console.log('Successfully merged with defaults');
		return result;
	} catch (error) {
		console.error('Error merging with defaults:', error);
		return defaultOrgSettings;
	}
};