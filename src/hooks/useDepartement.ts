// src/hooks/useDepartments.ts
import { useState, useEffect, useCallback } from 'react';
import * as departmentService from '../services/departementService.ts';
import { useCloudinaryUpload } from './useCloudinaryUpload';
import type { Department } from '../types/departement.ts';

export const useDepartments = () => {
	const { uploadFile, isUploading: isCloudinaryUploading, error: uploadError } = useCloudinaryUpload();

	const [departments, setDepartments] = useState<Department[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadDepartments = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);
			const data = await departmentService.fetchDepartments();
			setDepartments(data);
		} catch (err) {
			setError('Failed to load departments.');
			console.error(err);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadDepartments();
	}, [loadDepartments]);

	/**
	 * Handles the creation of a new department, including image upload.
	 * @param name - The name of the department.
	 * @param imageFile - The image file to be uploaded.
	 * @returns A promise that resolves to true on success, false on failure.
	 */
	const createDepartment = async (name: string, imageFile: File): Promise<boolean> => {
		try {
			setError(null);
			const imageUrl = await uploadFile(imageFile, {
				tags: ['department_cover', name],
			});

			if (!imageUrl) {
				throw new Error(uploadError || 'Cloudinary upload returned no URL.');
			}

			await departmentService.addDepartment(name, imageUrl);
			await loadDepartments(); // Refresh the list after adding
			return true;
		} catch (err) {
			setError('Failed to create department.');
			console.error(err);
			return false;
		}
	};

	return {
		departments,
		isLoading,
		isSubmitting: isCloudinaryUploading, // The hook can track the submission state
		error,
		createDepartment,
	};
};