// src/hooks/useAddBook.ts
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCloudinaryUpload } from './useCloudinaryUpload';
import * as bookService from '../services/bookService';
import type { Book } from '../types/book';

export const useAddBook = () => {
	const { departmentName } = useParams<{ departmentName: string }>();
	const navigate = useNavigate();
	const { uploadFile, isUploading: isCloudinaryUploading } = useCloudinaryUpload();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const decodedDepartmentName = departmentName ? decodeURIComponent(departmentName) : '';

	const handleAddBook = async (formData: Omit<Book, 'id' | 'image'>, imageFile: File | null) => {
		if (!imageFile) {
			setError("An image is required to create a new book.");
			return;
		}

		setIsSubmitting(true);
		setError(null);

		try {
			// 1. Upload image to Cloudinary
			const imageUrl = await uploadFile(imageFile, {
				tags: ['book', formData.cathegorie, formData.name],
			});

			if (!imageUrl) {
				throw new Error("Image upload failed to return a URL.");
			}

			// 2. Prepare the final book data object
			const newBookData: Omit<Book, 'id'> = {
				...formData,
				image: imageUrl,
				commentaire: [], // Initialize with an empty comments array
			};

			// 3. Save the new book data to Firestore
			await bookService.addBook(newBookData);

			// 4. On success, navigate back to the catalogue for that department
			navigate(`/dashboard/books/${departmentName}`);

		} catch (err) {
			console.error("Failed to add book:", err);
			const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
			setError(errorMessage);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		handleAddBook,
		isSubmitting: isSubmitting || isCloudinaryUploading,
		error,
		initialDepartment: decodedDepartmentName,
	};
};