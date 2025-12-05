import { cloudinaryConfig } from '../config/cloudinary';

export interface UploadResponse {
	public_id: string;
	secure_url: string;
	url: string;
	width: number;
	height: number;
	format: string;
	bytes: number;
	created_at: string;
	folder?: string;
	display_name: string;
	original_filename: string;
}

export interface UploadOptions {
	folder?: string;
	tags?: string[];
	transformation?: string;
	resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

export interface UploadError {
	message: string;
	error: any;
}

export class ImageUploadService {
	private static instance: ImageUploadService;

	public static getInstance(): ImageUploadService {
		if (!ImageUploadService.instance) {
			ImageUploadService.instance = new ImageUploadService();
		}
		return ImageUploadService.instance;
	}

	async uploadImage(file: File, options: UploadOptions = {}): Promise<UploadResponse> {
		const formData = new FormData();
		formData.append('file', file);
		formData.append('upload_preset', cloudinaryConfig.uploadPreset);
		formData.append('cloud_name', cloudinaryConfig.cloudName);

		// Add folder if specified, otherwise upload to root
		if (options.folder) {
			// Clean folder name - remove special characters except underscores and hyphens
			const cleanFolder = options.folder.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
			formData.append('folder', cleanFolder);
		}

		// Add tags if specified
		if (options.tags && options.tags.length > 0) {
			formData.append('tags', options.tags.join(','));
		}

		// Add transformation if specified
		if (options.transformation) {
			formData.append('transformation', options.transformation);
		}

		// Add resource type
		formData.append('resource_type', options.resourceType || 'image');

		try {
			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
				{
					method: 'POST',
					body: formData,
				}
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error?.message || 'Upload failed');
			}

			const data = await response.json();

			return {
				public_id: data.public_id,
				secure_url: data.secure_url,
				url: data.url,
				width: data.width,
				height: data.height,
				format: data.format,
				bytes: data.bytes,
				created_at: data.created_at,
				folder: data.folder || '',
				display_name: data.display_name || file.name,
				original_filename: data.original_filename || file.name.split('.')[0],
			};
		} catch (error) {
			console.error('Image upload error:', error);
			throw new Error(`Failed to upload image: ${error instanceof Error ? error.message : 'Unknown error'}`);
		}
	}

	async uploadMultipleImages(files: File[], options: UploadOptions = {}): Promise<UploadResponse[]> {
		const uploadPromises = files.map(file => this.uploadImage(file, options));
		return Promise.all(uploadPromises);
	}

	async deleteImage(publicId: string): Promise<boolean> {
		try {
			const formData = new FormData();
			formData.append('public_id', publicId);
			formData.append('upload_preset', cloudinaryConfig.uploadPreset);
			formData.append('api_key', cloudinaryConfig.apiKey);

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
				{
					method: 'POST',
					body: formData,
				}
			);

			const result = await response.json();
			return result.result === 'ok';
		} catch (error) {
			console.error('Image deletion error:', error);
			return false;
		}
	}

	// Utility function to get image URL with transformations
	getImageUrl(publicId: string, transformations?: {
		width?: number;
		height?: number;
		crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb' | 'pad';
		quality?: 'auto' | number;
		format?: 'auto' | 'webp' | 'jpg' | 'png';
		gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
	}): string {
		const { cloudName } = cloudinaryConfig;
		let url = `https://res.cloudinary.com/${cloudName}/image/upload/`;

		if (transformations) {
			const transforms = [];
			if (transformations.width) transforms.push(`w_${transformations.width}`);
			if (transformations.height) transforms.push(`h_${transformations.height}`);
			if (transformations.crop) transforms.push(`c_${transformations.crop}`);
			if (transformations.quality) transforms.push(`q_${transformations.quality}`);
			if (transformations.format) transforms.push(`f_${transformations.format}`);
			if (transformations.gravity) transforms.push(`g_${transformations.gravity}`);

			if (transforms.length > 0) {
				url += transforms.join(',') + '/';
			}
		}

		return url + publicId;
	}

	// Function to get optimized image URL for different use cases
	getOptimizedImageUrl(
		publicId: string,
		size: 'thumbnail' | 'medium' | 'large' | 'original' = 'medium'
	): string {
		const transformations = {
			thumbnail: { width: 150, height: 150, crop: 'thumb' as const, quality: 'auto' as const },
			medium: { width: 800, height: 600, crop: 'fit' as const, quality: 'auto' as const },
			large: { width: 1200, height: 900, crop: 'fit' as const, quality: 'auto' as const },
			original: undefined
		};

		return this.getImageUrl(publicId, transformations[size]);
	}
}

// Helper functions that can be called from anywhere in your app
export const imageUploadHelpers = {
	// Get the upload service instance
	getUploadService: () => ImageUploadService.getInstance(),

	// Quick upload function
	uploadImage: async (file: File, folder?: string): Promise<string | null> => {
		try {
			const service = ImageUploadService.getInstance();
			const result = await service.uploadImage(file, { folder });
			return result.secure_url;
		} catch (error) {
			console.error('Upload failed:', error);
			return null;
		}
	},

	// Quick upload multiple images
	uploadImages: async (files: File[], folder?: string): Promise<string[]> => {
		try {
			const service = ImageUploadService.getInstance();
			const results = await service.uploadMultipleImages(files, { folder });
			return results.map(result => result.secure_url);
		} catch (error) {
			console.error('Upload failed:', error);
			return [];
		}
	},

	// Get image URL with transformations
	getImageUrl: (publicId: string, transformations?: any): string => {
		const service = ImageUploadService.getInstance();
		return service.getImageUrl(publicId, transformations);
	},

	// Get optimized image URL
	getOptimizedImageUrl: (publicId: string, size: 'thumbnail' | 'medium' | 'large' | 'original' = 'medium'): string => {
		const service = ImageUploadService.getInstance();
		return service.getOptimizedImageUrl(publicId, size);
	},

	// Delete image
	deleteImage: async (publicId: string): Promise<boolean> => {
		try {
			const service = ImageUploadService.getInstance();
			return await service.deleteImage(publicId);
		} catch (error) {
			console.error('Delete failed:', error);
			return false;
		}
	}
};
