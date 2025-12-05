import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';

import { useDepartments } from '../hooks/useDepartement.ts';
import useI18n from '../hooks/useI18n';
import DepartmentCard from '../components/departements/DepartmentCard.tsx';
import { AddDepartmentModal } from '../components/departements/AddDepartmentModal.tsx';
import { Button } from '../components/common/Button';
import Spinner from '../components/common/Spinner';

const Departments: React.FC = () => {
	const { t } = useI18n();
	const { departments, isLoading, isSubmitting, createDepartment, error } = useDepartments();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="p-6">
			{/* Page Header */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">
					{t('components:departments.admin_title')}
				</h1>
				<Button onClick={() => setIsModalOpen(true)}>
					<FaPlus className="mr-2" />
					{t('components:departments.add_button')}
				</Button>
			</div>

			{/* Error Display */}
			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
					<p>{error}</p>
				</div>
			)}

			{/* Content Area */}
			{isLoading ? (
				<Spinner />
			) : departments.length === 0 ? (
				<div className="text-center py-10 my-4 bg-secondary-100 rounded-lg">
					<p className="text-secondary-600 mb-4">{t('components:departments.no_departments')}</p>
					<Button onClick={() => setIsModalOpen(true)}>
						<FaPlus className="mr-2" />
						{t('components:departments.create_first')}
					</Button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{departments.map(dept => (
						<DepartmentCard key={dept.id} department={dept} />
					))}
				</div>
			)}

			{/* Add Department Modal */}
			<AddDepartmentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAdd={createDepartment}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
};

export default Departments;