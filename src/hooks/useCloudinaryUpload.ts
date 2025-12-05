// Location: src/hooks/useCloudinaryUpload.ts
import { useState, useCallback } from 'react';
import { cloudinaryConfig } from '../config/cloudinary';
import type { CloudinaryUploadResponse, UploadOptions, UseCloudinaryUploadResult } from '../types/uploads.ts';



export const useCloudinaryUpload = (): UseCloudinaryUploadResult => {
	const [isUploading, setIsUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const clearError = useCallback(() => {
		setError(null);
	}, []);

	const uploadFile = useCallback(async (
		file: File,
		options: UploadOptions = {}
	): Promise<string | null> => {
		if (!file) return null;

		setIsUploading(true);
		setProgress(0);
		setError(null);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('upload_preset', cloudinaryConfig.uploadPreset);
			formData.append('cloud_name', cloudinaryConfig.cloudName);

			// Add tags if specified
			if (options.tags && options.tags.length > 0) {
				formData.append('tags', options.tags.join(','));
			}

			// Add resource type if specified
			const resourceType = options.resourceType || 'image';

			// Log details for debugging
			console.log("Uploading to Cloudinary with options:", {
				cloudName: cloudinaryConfig.cloudName,
				uploadPreset: cloudinaryConfig.uploadPreset,
				resourceType: resourceType,
				fileName: file.name
			});

			// Use fetch for simpler debugging
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`,
				{
					method: 'POST',
					body: formData,
				}
			);

			if (!response.ok) {
				let errorText;
				try {
					const errorData = await response.json();
					errorText = errorData.error?.message || `HTTP error ${response.status}`;
				} catch (e) {
					console.log(e)
					errorText = `HTTP error ${response.status}`;
				}
				throw new Error(`Upload failed: ${errorText}`);
			}

			const data = await response.json() as CloudinaryUploadResponse;

			console.log("Upload successful:", data);
			setIsUploading(false);

			return data.secure_url;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
			console.error("Upload error:", errorMessage);
			setError(errorMessage);
			setIsUploading(false);
			return null;
		}
	}, []);

	const uploadFiles = useCallback(async (
		files: File[],
		options: UploadOptions = {}
	): Promise<string[]> => {
		setIsUploading(true);
		setProgress(0);
		setError(null);

		try {
			const urls: string[] = [];
			const totalFiles = files.length;
			let completedFiles = 0;

			for (const file of files) {
				const url = await uploadFile(file, options);

				if (url) {
					urls.push(url);
				}

				completedFiles++;
				setProgress(Math.round((completedFiles / totalFiles) * 100));
			}

			return urls;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to upload files';
			setError(errorMessage);
			return [];
		} finally {
			setIsUploading(false);
		}
	}, [uploadFile]);

	return {
		uploadFile,
		uploadFiles,
		isUploading,
		progress,
		error,
		clearError
	};
};