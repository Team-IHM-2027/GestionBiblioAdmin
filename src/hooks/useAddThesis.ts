
// // src/hooks/useAddThesis.ts
// import { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useCloudinaryUpload } from './useCloudinaryUpload';
// import * as thesisService from '../services/thesisService';
// import type { Thesis } from '../types/thesis';
//
// export const useAddThesis = () => {
// 	const { departmentName } = useParams<{ departmentName: string }>();
// 	const navigate = useNavigate();
// 	const { uploadFile, isUploading: isCloudinaryUploading } = useCloudinaryUpload();
//
// 	const [isSubmitting, setIsSubmitting] = useState(false);
// 	const [error, setError] = useState<string | null>(null);
//
// 	const decodedDepartmentName = departmentName ? decodeURIComponent(departmentName) : '';
//
// 	const handleAddThesis = async (
// 		formData: Omit<Thesis, 'id' | 'coverImageUrl' | 'pdfUrl' | 'createdAt' | 'commentaire'>,
// 		coverFile: File | null,
// 		pdfFile: File | null
// 	) => {
// 		if (!coverFile || !pdfFile) {
// 			setError("A cover image and a PDF file are required.");
// 			return;
// 		}
//
// 		setIsSubmitting(true);
// 		setError(null);
//
// 		try {
// 			const coverImageUrl = await uploadFile(coverFile, {
// 				tags: ['thesis_cover', formData.department, formData.title],
// 				resourceType: 'image'
// 			});
// 			if (!coverImageUrl) throw new Error("Cover image upload failed.");
//
// 			const pdfUrl = await uploadFile(pdfFile, {
// 				tags: ['thesis_pdf', formData.department, formData.title],
// 				resourceType: 'raw'
// 			});
// 			if (!pdfUrl) throw new Error("PDF file upload failed.");
//
// 			// The service now handles mapping, so we can pass a clean object
// 			const newThesisData = {
// 				...formData,
// 				coverImageUrl,
// 				pdfUrl,
// 			};
//
// 			await thesisService.addThesis(newThesisData);
//
// 			navigate(`/dashboard/thesis/${departmentName}`);
//
// 		} catch (err) {
// 			console.error("Failed to add thesis:", err);
// 			const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
// 			setError(errorMessage);
// 		} finally {
// 			setIsSubmitting(false);
// 		}
// 	};
//
// 	return {
// 		handleAddThesis,
// 		isSubmitting: isSubmitting || isCloudinaryUploading,
// 		error,
// 		initialDepartment: decodedDepartmentName,
// 	};
// };

// src/hooks/useAddThesis.ts
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCloudinaryUpload } from './useCloudinaryUpload';
import * as thesisService from '../services/thesisService';
import type { Thesis } from '../types/thesis';
// import { Timestamp } from 'firebase/firestore';

export const useAddThesis = () => {
	const { departmentName } = useParams<{ departmentName: string }>();
	const navigate = useNavigate();
	const { uploadFile, isUploading: isCloudinaryUploading } = useCloudinaryUpload();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const decodedDepartmentName = departmentName ? decodeURIComponent(departmentName) : '';

	const handleAddThesis = async (
		formData: Omit<Thesis, 'id' | 'coverImageUrl' | 'pdfUrl' | 'createdAt' | 'commentaire'>,
		coverFile: File | null,
		pdfFile: File | null
	) => {
		if (!coverFile || !pdfFile) {
			setError("A cover image and a PDF file are required.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			// Upload cover image (resourceType defaults to 'image', which is correct)
			const coverImageUrl = await uploadFile(coverFile, {
				tags: ['thesis_cover', formData.department, formData.title],
			});
			if (!coverImageUrl) throw new Error("Cover image upload failed.");

			// --- THIS IS THE FIX ---
			// Upload the PDF, but let Cloudinary handle it as an 'image' type.
			// Do NOT specify `resourceType: 'raw'`.
			const pdfUrl = await uploadFile(pdfFile, {
				tags: ['thesis_pdf', formData.department, formData.title],
			});
			if (!pdfUrl) throw new Error("PDF file upload failed.");

			const newThesisData = {
				...formData,
				coverImageUrl,
				pdfUrl,
			};

			await thesisService.addThesis(newThesisData);

			navigate(`/dashboard/thesis/${departmentName}`);

		} catch (err) {
			console.error("Failed to add thesis:", err);
			const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		handleAddThesis,
		isSubmitting: isSubmitting || isCloudinaryUploading,
		error,
		initialDepartment: decodedDepartmentName,
	};
};