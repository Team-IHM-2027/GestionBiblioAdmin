// src/components/departments/AddDepartmentModal.tsx
import React, { useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { Modal } from '../common/Modal'; // Using our new custom modal
import { Button } from '../common/Button'; // Using our new custom button
import useI18n from '../../hooks/useI18n';

interface AddDepartmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onAdd: (name: string, imageFile: File) => Promise<boolean>;
	isSubmitting: boolean;
}

export const AddDepartmentModal: React.FC<AddDepartmentModalProps> = ({ isOpen, onClose, onAdd, isSubmitting }) => {
	const { t } = useI18n();
	const [nomDepartement, setNomDepartement] = useState('');
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState('');

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			const reader = new FileReader();
			reader.onloadend = () => setPreviewImage(reader.result as string);
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!nomDepartement || !imageFile) return;

		const success = await onAdd(nomDepartement, imageFile);
		if (success) {
			onClose(); // Close modal only on success
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={t('components:departments.create_title')}>
			<form onSubmit={handleSubmit}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Department Name Input */}
					<div>
						<label htmlFor="nomDepartement" className="block text-sm font-medium text-gray-700 mb-1">
							{t('components:departments.name_label')}
						</label>
						<input
							type="text"
							id="nomDepartement"
							value={nomDepartement}
							onChange={(e) => setNomDepartement(e.target.value)}
							placeholder={t('components:departments.name_placeholder')}
							className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
							required
						/>
						<p className="text-xs text-gray-500 mt-1">{t('components:departments.name_tip')}</p>
					</div>
					{/* Image Upload */}
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">{t('components:departments.image_label')}</label>
						<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
							<div className="space-y-1 text-center">
								<svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
									<path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
								<div className="flex text-sm text-gray-600">
									<label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-600">
										<span>{previewImage ? t('components:departments.change_image') : t('components:departments.select_image')}</span>
										<input id="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" required />
									</label>
								</div>
								<p className="text-xs text-gray-500">{t('components:departments.image_format')}</p>
							</div>
						</div>
					</div>
				</div>
				{previewImage && (
					<div className="mt-6 text-center">
						<h3 className="text-sm font-medium text-gray-700 mb-2">{t('components:departments.preview')}</h3>
						<img src={previewImage} alt="Preview" className="mx-auto h-40 rounded-lg shadow-md" />
					</div>
				)}
				<div className="mt-8 flex justify-end gap-4">
					<Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
						<FaTimes className="mr-2" />
						{t('components:departments.cancel_button')}
					</Button>
					<Button type="submit" isLoading={isSubmitting}>
						<FaCheck className="mr-2" />
						{t('components:departments.save_button')}
					</Button>
				</div>
			</form>
		</Modal>
	);
};