export interface CloudinaryUploadResponse {
	public_id: string;
	secure_url: string;
	original_filename: string;
	format: string;
	width: number;
	height: number;
	bytes: number;
	resource_type: string;
	url: string;
}

export interface UploadOptions {
	tags?: string[];
	resourceType?: 'image' | 'video' | 'raw' | 'auto';
}

export interface UseCloudinaryUploadResult {
	uploadFile: (file: File, options?: UploadOptions) => Promise<string | null>;
	uploadFiles: (files: File[], options?: UploadOptions) => Promise<string[]>;
	isUploading: boolean;
	progress: number;
	error: string | null;
	clearError: () => void;
}

export interface UploadedImage {
	id: number;
	url: string;
}