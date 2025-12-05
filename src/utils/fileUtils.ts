// src/utils/fileUtils.ts

export const sanitizeFilename = (filename: string): string => {
	if (!filename) {
		return 'download';
	}
	return filename.replace(/[/\\?%*:|"<>]/g, '-');
};

/**
 * Converts a standard Cloudinary URL into a forced download URL.
 * It inserts the `fl_attachment` flag.
 *
 * @param originalUrl - The URL stored in Firestore (e.g., .../image/upload/v123/public_id.pdf)
 * @returns A new URL formatted for direct download (e.g., .../image/upload/fl_attachment/v123/public_id.pdf)
 */
export const createCloudinaryDownloadUrl = (originalUrl: string): string => {
	if (!originalUrl) return '';

	// The part of the URL to search for to insert the flag
	const uploadMarker = '/upload/';
	const uploadMarkerIndex = originalUrl.indexOf(uploadMarker);

	// If the marker isn't found, return the original URL to avoid breaking it
	if (uploadMarkerIndex === -1) {
		return originalUrl;
	}

	const baseUrl = originalUrl.substring(0, uploadMarkerIndex + uploadMarker.length);
	const restOfUrl = originalUrl.substring(uploadMarkerIndex + uploadMarker.length);

	// Construct the new URL with the download flag
	return `${baseUrl}fl_attachment/${restOfUrl}`;
};