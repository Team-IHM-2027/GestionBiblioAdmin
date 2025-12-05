// src/components/thesis/EditThesisModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { Thesis } from '../../types/thesis';
import useI18n from '../../hooks/useI18n';
import { FiUpload, FiFileText } from 'react-icons/fi';

interface EditThesisModalProps {
	isOpen: boolean;
	onClose: () => void;
	thesis: Thesis;
	onSave: (data: Partial<Thesis>, coverFile?: File | null, pdfFile?: File | null) => Promise<void>;
	isSubmitting: boolean;
}

export const EditThesisModal: React.FC<EditThesisModalProps> = ({ isOpen, onClose, thesis, onSave, isSubmitting }) => {
	const { t } = useI18n();
	const [formData, setFormData] = useState(thesis);
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string>(thesis.coverImageUrl);

	useEffect(() => {
		setFormData(thesis);
		setPreview(thesis.coverImageUrl);
	}, [thesis, isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleKeywordsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const keywords = e.target.value.split(',').map(k => k.trim());
		setFormData(prev => ({ ...prev, keywords }));
	};

	const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setCoverFile(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) setPdfFile(file);
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await onSave(formData, coverFile, pdfFile);
			onClose();
		} catch (error) {
			alert('Failed to update thesis details.');
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title="Edit Thesis">
			<form onSubmit={handleFormSubmit} className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="form-input" />
					<input name="author" value={formData.author} onChange={handleChange} placeholder="Author" className="form-input" />
					<input name="supervisor" value={formData.supervisor} onChange={handleChange} placeholder="Supervisor" className="form-input" />
					<input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="Year" className="form-input" />
				</div>
				<textarea name="abstract" value={formData.abstract} onChange={handleChange} placeholder="Abstract" className="form-input w-full" rows={4}></textarea>
				<input name="keywords" value={formData.keywords.join(', ')} onChange={handleKeywordsChange} placeholder="Keywords (comma-separated)" className="form-input" />

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
					<div>
						<img src={preview} alt="Cover Preview" className="w-32 h-40 mx-auto object-contain rounded mb-2"/>
						<label htmlFor="cover-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed rounded cursor-pointer hover:bg-secondary-100">
							<FiUpload /> <span>Change Cover</span>
						</label>
						<input type="file" id="cover-upload" onChange={handleCoverChange} className="hidden" accept="image/*" />
					</div>
					<div>
						{/* --- THIS IS THE FIX --- */}
						{/* Conditionally render the "View PDF" link */}
						{thesis.pdfUrl ? (
							<a href={thesis.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline block text-center mb-2">View Current PDF</a>
						) : (
							<p className="text-secondary-600 text-center mb-2">No PDF currently uploaded</p>
						)}

						<label htmlFor="pdf-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed rounded cursor-pointer hover:bg-secondary-100">
							<FiFileText /> <span>{pdfFile ? pdfFile.name : "Change PDF"}</span>
						</label>
						<input type="file" id="pdf-upload" onChange={handlePdfChange} className="hidden" accept=".pdf" />
					</div>
				</div>

				<div className="flex justify-end gap-4 mt-6">
					<Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>{t('common:cancel')}</Button>
					<Button type="submit" isLoading={isSubmitting}>{t('common:save')}</Button>
				</div>
			</form>
		</Modal>
	);
};