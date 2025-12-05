// src/pages/ThesisDetails.tsx
import React, { useState } from 'react';
import { useThesisDetails } from '../hooks/useThesisDetails';
import { ThesisDetailDisplay } from '../components/thesis/ThesisDetailDisplay';
import { EditThesisModal } from '../components/thesis/EditThesisModal';
import { Button } from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import useI18n from '../hooks/useI18n';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

const ThesisDetails: React.FC = () => {
	const { thesis, isLoading, error, isSubmitting, updateThesisDetails, removeThesis } = useThesisDetails();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const { t } = useI18n();

	if (isLoading) return <Spinner />;
	if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
	if (!thesis) return <div className="text-center text-gray-500 p-8">Thesis not found.</div>;

	const handleDeleteClick = () => {
		if (window.confirm(`Are you sure you want to delete "${thesis.title}"? This action cannot be undone.`)) {
			removeThesis().catch(err => alert(`Failed to delete the thesis: ${err.message}`));
		}
	};

	return (
		<div className="max-w-7xl mx-auto">
			<div className="flex justify-end items-center gap-4 mb-6">
				<Button onClick={() => setIsEditModalOpen(true)}>
					<FiEdit className="mr-2" />
					Edit
				</Button>
				<Button variant="outline" onClick={handleDeleteClick} disabled={isSubmitting} className="border-red-500 text-red-500 hover:bg-red-50">
					<FiTrash2 className="mr-2" />
					{t('common:delete')}
				</Button>
			</div>

			<ThesisDetailDisplay thesis={thesis} />

			<EditThesisModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				thesis={thesis}
				onSave={updateThesisDetails}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
};

export default ThesisDetails;