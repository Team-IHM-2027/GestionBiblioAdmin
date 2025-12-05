// src/pages/AddBook.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddBook } from '../hooks/useAddBook';
import type { Book } from '../types/book';
import { Button } from '../components/common/Button';
import useI18n from '../hooks/useI18n';
import { FiSave, FiXCircle, FiUpload } from 'react-icons/fi';

const AddBook: React.FC = () => {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { handleAddBook, isSubmitting, error, initialDepartment } = useAddBook();

	const [formData, setFormData] = useState<Omit<Book, 'id' | 'image' | 'commentaire'>>({
		name: '',
		auteur: '',
		edition: '',
		cathegorie: initialDepartment, // Pre-fill department from URL
		exemplaire: 1,
		initialExemplaire: 1,
		salle: '',
		etagere: '',
		desc: '',
	});
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleCopiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10) || 1;
		setFormData(prev => ({
			...prev,
			exemplaire: value,
			initialExemplaire: value,
		}));
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setImageFile(file);
			setPreview(URL.createObjectURL(file));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		handleAddBook(formData, imageFile);
	};

	return (
		<div className="rounded-lg">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">{t('pages:book_details.add_new_in_department', { department: initialDepartment })}</h1>

			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
					<p className="font-bold">{t('common:error')}</p>
					<p>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Column 1: Core Info */}
					<div className="space-y-4 p-4 bg-white rounded-md shadow-sm">
						<h3 className="font-semibold text-lg border-b pb-2">{t('pages:book_details.section_info')}</h3>
						<input name="name" value={formData.name} onChange={handleChange} placeholder={t('pages:book_details.title')} className="form-input" required />

						<input name="auteur" value={formData.auteur} onChange={handleChange} placeholder={t('pages:book_details.author')} className="form-input" />

						<input name="edition" value={formData.edition} onChange={handleChange} placeholder={t('pages:book_details.edition')} className="form-input" />
						<textarea name="desc" value={formData.desc} onChange={handleChange} placeholder={t('pages:book_details.description')} className="form-input w-full" rows={5} required></textarea>
					</div>

					{/* Column 2: Location & Stock */}
					<div className="space-y-4 p-4 bg-white rounded-md shadow-sm">
						<h3 className="font-semibold text-lg border-b pb-2">{t('pages:book_details.section_location')}</h3>
						<input name="cathegorie" value={formData.cathegorie} onChange={handleChange} placeholder={t('pages:book_details.category')} className="form-input" disabled />
						<input name="etagere" value={formData.etagere} onChange={handleChange} placeholder={t('pages:book_details.shelf')} className="form-input" required />
						<select name="salle" value={formData.salle} onChange={handleChange} className="form-input" required>
							<option value="">{t('pages:book_details.select_room')}</option>
							<option value="1">1</option>
							<option value="2">2</option>
							<option value="3">3</option>
							<option value="4">4</option>
						</select>
						<div>
							<label className="text-sm font-medium">{t('pages:book_details.number_of_copies')}</label>
							<input name="exemplaire" type="number" min="1" value={formData.exemplaire} onChange={handleCopiesChange} className="form-input" required />
						</div>
					</div>

					{/* Column 3: Image */}
					<div className="space-y-4 p-4 bg-white rounded-md shadow-sm">
						<h3 className="font-semibold text-lg border-b pb-2">{t('pages:book_details.section_image')}</h3>
						<div className="w-full h-48 bg-secondary-100 rounded-md flex items-center justify-center">
							{preview ? (
								<img src={preview} alt="Book Preview" className="w-full h-full object-contain p-2" />
							) : (
								<span className="text-secondary-500">{t('pages:book_details.no_image_preview')}</span>
							)}
						</div>
						<label htmlFor="image-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-secondary-100">
							<FiUpload />
							<span>{t('pages:book_details.upload_image')}</span>
						</label>
						<input id="image-upload" type="file" onChange={handleImageChange} className="hidden" accept="image/*" required />
					</div>
				</div>

				<div className="flex justify-end gap-4 pt-4 border-t">
					<Button variant="outline" type="button" onClick={() => navigate(-1)} disabled={isSubmitting}>
						<FiXCircle className="mr-2" />
						{t('common:cancel')}
					</Button>
					<Button type="submit" isLoading={isSubmitting}>
						<FiSave className="mr-2" />
						{t('common:save')}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddBook;