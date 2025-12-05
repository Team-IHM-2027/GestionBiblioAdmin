// src/hooks/useThesisDetails.ts
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as thesisService from '../services/thesisService';
import { useCloudinaryUpload } from './useCloudinaryUpload';
import type { Thesis } from '../types/thesis';

export const useThesisDetails = () => {
	const { thesisId } = useParams<{ thesisId: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const [thesis, setThesis] = useState<Thesis | null>(location.state?.thesis || null);
	const [isLoading, setIsLoading] = useState(!thesis);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { uploadFile, isUploading: isCloudinaryUploading } = useCloudinaryUpload();

	useEffect(() => {
		if (!thesisId) {
			setError("Thesis ID is missing.");
			setIsLoading(false);
			return;
		}
		if (!thesis || thesis.id !== thesisId) {
			setIsLoading(true);
			thesisService.fetchThesisById(thesisId)
				.then(data => setThesis(data))
				.catch(err => setError(err.message))
				.finally(() => setIsLoading(false));
		}
	}, [thesisId, thesis]);

	const updateThesisDetails = async (
		updatedData: Partial<Thesis>,
		coverFile?: File | null,
		pdfFile?: File | null
	) => {
		if (!thesisId || !thesis) return;
		setIsSubmitting(true);
		try {
			const finalData = { ...updatedData };

			if (coverFile) {
				// This is already correct as it defaults to 'image'
				const newCoverUrl = await uploadFile(coverFile);
				if (newCoverUrl) finalData.coverImageUrl = newCoverUrl;
			}

			if (pdfFile) {
				// --- THIS IS THE FIX ---
				// Remove `resourceType: 'raw'` to upload as an image type.
				const newPdfUrl = await uploadFile(pdfFile);
				if (newPdfUrl) finalData.pdfUrl = newPdfUrl;
			}

			await thesisService.updateThesis(thesisId, finalData);
			setThesis(prev => prev ? { ...prev, ...finalData } as Thesis : null);

		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	const removeThesis = async () => {
		if (!thesisId) return;
		setIsSubmitting(true);
		try {
			// Note: This only deletes the Firestore record.
			// Deleting from Cloudinary would require a secure backend endpoint.
			await thesisService.deleteThesis(thesisId);
			navigate(-1); // Go back after successful deletion
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		thesis,
		isLoading,
		isSubmitting: isSubmitting || isCloudinaryUploading,
		error,
		updateThesisDetails,
		removeThesis
	};
};