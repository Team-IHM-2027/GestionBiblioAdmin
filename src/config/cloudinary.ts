export const cloudinaryConfig = {
	cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
	uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
	apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
	apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET, // Optional - typically not used in frontend
};

// Cloudinary URL builder
export const buildCloudinaryUrl = (
	publicId: string,
	transformations?: {
		width?: number;
		height?: number;
		crop?: 'fill' | 'fit' | 'scale' | 'crop';
		quality?: 'auto' | number;
		format?: 'auto' | 'webp' | 'jpg' | 'png';
	}
) => {
	const { cloudName } = cloudinaryConfig;
	let url = `https://res.cloudinary.com/${cloudName}/image/upload/`;

	if (transformations) {
		const transforms = [];
		if (transformations.width) transforms.push(`w_${transformations.width}`);
		if (transformations.height) transforms.push(`h_${transformations.height}`);
		if (transformations.crop) transforms.push(`c_${transformations.crop}`);
		if (transformations.quality) transforms.push(`q_${transformations.quality}`);
		if (transformations.format) transforms.push(`f_${transformations.format}`);

		if (transforms.length > 0) {
			url += transforms.join(',') + '/';
		}
	}

	return url + publicId;
};
