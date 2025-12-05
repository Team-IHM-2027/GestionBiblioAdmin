// src/components/books/EditBookModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import type { Book } from '../../types/book';
import useI18n from '../../hooks/useI18n';

interface EditBookModalProps {
	isOpen: boolean;
	onClose: () => void;
	book: Book;
	onSave: (data: Partial<Book>, imageFile?: File | null) => Promise<void>;
	isSubmitting: boolean;
}

export const EditBookModal: React.FC<EditBookModalProps> = ({ isOpen, onClose, book, onSave, isSubmitting }) => {
	const { t } = useI18n();
	const [formData, setFormData] = useState(book);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string>(book.image);

	useEffect(() => {
		setFormData(book);
		setPreview(book.image);
	}, [book, isOpen]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await onSave(formData, imageFile);
			onClose();
		} catch (error) {
			alert(t('pages:book_details.update_failed'));
		}
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose} title={t('pages:book_details.edit_book')}>
			<form onSubmit={handleFormSubmit}>
				{/* Image Preview and Upload */}
				<div className="mb-4 text-center">
					<img src={preview} alt="Preview" className="w-32 h-40 mx-auto object-contain rounded mb-2"/>
					<input type="file" id="image" onChange={handleImageChange} className="hidden" />
					<label htmlFor="image" className="text-primary cursor-pointer hover:underline text-sm">
						{t('pages:book_details.change_image')}
					</label>
				</div>

				{/* Form Fields */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<input name="name" value={formData.name} onChange={handleChange} placeholder={t('pages:book_details.title')} className="form-input" />
					<input name="auteur" value={formData.auteur} onChange={handleChange} placeholder={t('pages:book_details.author')} className="form-input" />
					<input name="edition" value={formData.edition} onChange={handleChange} placeholder={t('pages:book_details.edition')} className="form-input" />
					<input name="cathegorie" value={formData.cathegorie} onChange={handleChange} placeholder={t('pages:book_details.category')} className="form-input" />
					<input name="exemplaire" type="number" value={formData.exemplaire} onChange={handleChange} placeholder={t('pages:book_details.current_stock')} className="form-input" />
					<input name="salle" value={formData.salle} onChange={handleChange} placeholder={t('pages:book_details.room')} className="form-input" />
					<input name="etagere" value={formData.etagere} onChange={handleChange} placeholder={t('pages:book_details.shelf')} className="form-input" />
				</div>
				<textarea name="desc" value={formData.desc} onChange={handleChange} placeholder={t('pages:book_details.description')} className="form-input mt-4 w-full" rows={4}></textarea>

				<div className="flex justify-end gap-4 mt-6">
					<Button variant="outline" type="button" onClick={onClose} disabled={isSubmitting}>
						{t('common:cancel')}
					</Button>
					<Button type="submit" isLoading={isSubmitting}>
						{t('common:save')}
					</Button>
				</div>
			</form>
		</Modal>
	);
};