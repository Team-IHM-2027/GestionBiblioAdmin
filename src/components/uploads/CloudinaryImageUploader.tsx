// Location: src/components/CloudinaryImageUploader.tsx
import React, { useState } from 'react';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload.ts';
import type { UploadedImage } from "../../types/uploads.ts";


const CloudinaryImageUploader: React.FC = () => {
	const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
	const { uploadFile, uploadFiles, isUploading, progress, error, clearError } = useCloudinaryUpload();
	const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

	const handleSingleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];

			try {
				// Add date as tag for organization
				const imageUrl = await uploadFile(file, {
					tags: [`uploaded_${currentDate}`, 'biblio_admin']
				});

				if (imageUrl) {
					setUploadedImages(prev => [
						...prev,
						{
							id: Date.now(),
							url: imageUrl
						}
					]);

					console.log('Image URL to save:', imageUrl);
				}
			} catch (err) {
				console.error('Upload failed:', err);
			}
		}
	};

	const handleMultipleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files.length > 0) {
			const files = Array.from(e.target.files);

			try {
				// Add date as tag for organization
				const imageUrls = await uploadFiles(files, {
					tags: [`uploaded_${currentDate}`, 'biblio_admin']
				});

				if (imageUrls.length > 0) {
					const newImages = imageUrls.map(url => ({
						id: Date.now() + Math.random(),
						url
					}));

					setUploadedImages(prev => [...prev, ...newImages]);

					console.log('Image URLs to save:', imageUrls);
				}
			} catch (err) {
				console.error('Upload failed:', err);
			}
		}
	};

	return (
		<div className="p-4 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
			<h2 className="text-2xl font-bold text-gray-800 mb-6">
				Cloudinary Image Uploader
			</h2>

			{error && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
					<strong className="font-bold">Error:</strong>
					<span className="block sm:inline"> {error}</span>
					<button
						className="absolute top-0 bottom-0 right-0 px-4 py-3"
						onClick={clearError}
					>
						<span className="text-xl">&times;</span>
					</button>
				</div>
			)}

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
				<div className="border rounded-lg p-4">
					<h3 className="text-lg font-semibold mb-3">Single Image Upload</h3>
					<input
						type="file"
						accept="image/*"
						onChange={handleSingleFileUpload}
						disabled={isUploading}
						className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary-600"
					/>
				</div>

				<div className="border rounded-lg p-4">
					<h3 className="text-lg font-semibold mb-3">Multiple Image Upload</h3>
					<input
						type="file"
						accept="image/*"
						multiple
						onChange={handleMultipleFileUpload}
						disabled={isUploading}
						className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-primary file:text-white
                    hover:file:bg-primary-600"
					/>
				</div>
			</div>

			{isUploading && (
				<div className="mb-6">
					<div className="w-full bg-gray-200 rounded-full h-2.5">
						<div
							className="bg-primary h-2.5 rounded-full transition-all duration-300"
							style={{ width: `${progress}%` }}
						/>
					</div>
					<p className="text-sm text-gray-600 text-center mt-2">
						Uploading: {progress}%
					</p>
				</div>
			)}

			{uploadedImages.length > 0 && (
				<div>
					<h3 className="text-xl font-semibold mb-4">
						Uploaded Images ({uploadedImages.length})
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
						{uploadedImages.map((image) => (
							<div
								key={image.id}
								className="border rounded-lg overflow-hidden bg-gray-50"
							>
								<div className="h-48 overflow-hidden">
									<img
										src={image.url}
										alt="Uploaded"
										className="w-full h-full object-cover"
										loading="lazy"
									/>
								</div>
								<div className="p-3">
									<div className="mt-2 flex justify-between">
										<a
											href={image.url}
											target="_blank"
											rel="noreferrer"
											className="text-xs text-primary hover:underline"
										>
											View Full Image
										</a>
										<button
											onClick={() => navigator.clipboard.writeText(image.url)}
											className="text-xs text-gray-600 hover:text-gray-900"
										>
											Copy URL
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};

export default CloudinaryImageUploader;