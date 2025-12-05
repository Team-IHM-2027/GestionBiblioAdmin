// src/pages/AddThesis.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAddThesis } from '../hooks/useAddThesis';
import { Button } from '../components/common/Button';
import useI18n from '../hooks/useI18n';
import { FiSave, FiXCircle, FiUpload, FiFileText } from 'react-icons/fi';

interface ThesisFormData {
	title: string;
	author: string;
	supervisor: string;
	department: string; // Assuming initialDepartment is string
	year: number;
	abstract: string;
	keywords: string[]; // Clearly typed here
	matricule: string;
	etagere: string;
}

const AddThesis: React.FC = () => {
	const { t } = useI18n();
	const navigate = useNavigate();
	const { handleAddThesis, isSubmitting, error, initialDepartment } = useAddThesis();

	const [formData, setFormData] = useState<ThesisFormData>({
		title: '',
		author: '',
		supervisor: '',
		department: initialDepartment, // initialDepartment comes from useAddThesis hook
		year: new Date().getFullYear(),
		abstract: '',
		keywords: [], // Now correctly typed due to ThesisFormData
		matricule: '',
		etagere: '',
	});
	const [coverFile, setCoverFile] = useState<File | null>(null);
	const [pdfFile, setPdfFile] = useState<File | null>(null);
	const [preview, setPreview] = useState<string | null>(null);

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
		if (file) {
			setPdfFile(file);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// @ts-ignore
		handleAddThesis(formData, coverFile, pdfFile);
	};

	return (
		<div className="rounded-lg">
			<h1 className="text-2xl font-bold text-gray-800 mb-6">{t('pages:add_thesis.title', { department: initialDepartment, defaultValue: `Add New Thesis in ${initialDepartment}` })}</h1>

			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
					<p className="font-bold">{t('common:error')}</p>
					<p>{error}</p>
				</div>
			)}

			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4 p-4 bg-white rounded-md shadow-sm">
						<h3 className="font-semibold text-lg border-b pb-2">{t('pages:add_thesis.section_info', {defaultValue: "Thesis Information"})}</h3>
						<input name="title" value={formData.title} onChange={handleChange} placeholder="Thesis Title" className="form-input" required />
						<input name="author" value={formData.author} onChange={handleChange} placeholder="Author's Name" className="form-input" required />
						{/* NEW FIELDS */}
						<input name="matricule" value={formData.matricule} onChange={handleChange} placeholder="Author's ID / Matricule" className="form-input" />
						<input name="etagere" value={formData.etagere} onChange={handleChange} placeholder="Shelf Location (e.g., 1C)" className="form-input" />
						{/* END NEW FIELDS */}
						<input name="supervisor" value={formData.supervisor} onChange={handleChange} placeholder="Supervisor's Name" className="form-input" required />
						<input name="year" type="number" value={formData.year} onChange={handleChange} placeholder="Year" className="form-input" required />
						<input name="keywords" onChange={handleKeywordsChange} placeholder="Keywords (comma-separated)" className="form-input" />
						<textarea name="abstract" value={formData.abstract} onChange={handleChange} placeholder="Abstract" className="form-input w-full" rows={4} required></textarea>
					</div>

					<div className="space-y-4 p-4 bg-white rounded-md shadow-sm">
						<h3 className="font-semibold text-lg border-b pb-2">{t('pages:add_thesis.section_files', {defaultValue: "Files"})}</h3>
						<div className="w-full h-48 bg-secondary-100 rounded-md flex items-center justify-center">
							{preview ? <img src={preview} alt="Cover Preview" className="w-full h-full object-contain p-2" /> : <span className="text-secondary-500">Cover Preview</span>}
						</div>
						<label htmlFor="cover-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-secondary-100">
							<FiUpload /> <span>Upload Cover Image</span>
						</label>
						<input id="cover-upload" type="file" onChange={handleCoverChange} className="hidden" accept="image/*" required />
						<div className="mt-4">
							<label htmlFor="pdf-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-gray-400 rounded-md cursor-pointer hover:bg-secondary-100">
								<FiFileText /> <span>{pdfFile ? pdfFile.name : "Upload PDF Document"}</span>
							</label>
							<input id="pdf-upload" type="file" onChange={handlePdfChange} className="hidden" accept=".pdf" required />
						</div>
					</div>
				</div>

				<div className="flex justify-end gap-4 pt-4 border-t">
					<Button variant="outline" type="button" onClick={() => navigate(-1)} disabled={isSubmitting}>
						<FiXCircle className="mr-2" /> {t('common:cancel')}
					</Button>
					<Button type="submit" isLoading={isSubmitting}>
						<FiSave className="mr-2" /> {t('common:save')}
					</Button>
				</div>
			</form>
		</div>
	);
};

export default AddThesis;