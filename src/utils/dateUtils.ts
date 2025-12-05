/**
 * Returns the current date and time in UTC in the format YYYY-MM-DD HH:MM:SS
 */
export const getCurrentFormattedDateTime = (): string => {
	const now = new Date();

	const year = now.getUTCFullYear();
	const month = String(now.getUTCMonth() + 1).padStart(2, '0');
	const day = String(now.getUTCDate()).padStart(2, '0');
	const hours = String(now.getUTCHours()).padStart(2, '0');
	const minutes = String(now.getUTCMinutes()).padStart(2, '0');
	const seconds = String(now.getUTCSeconds()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Returns the current user login
 */
export const getCurrentUserLogin = (): string => {
	console.log(import.meta.env.VITE_DEFAULT_ORGANIZATION)
	return import.meta.env.VITE_DEFAULT_ORGANIZATION || 'Ntye';
};