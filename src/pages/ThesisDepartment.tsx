// src/pages/ThesisDepartments.tsx
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useDepartments } from '../hooks/useDepartement';
import useI18n from '../hooks/useI18n';
import Spinner from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { AddDepartmentModal } from '../components/departements/AddDepartmentModal';
import { useNavigate } from 'react-router-dom';

interface Department {
	id: string;
	nom: string;
	image: string;
}

// This is a special card just for this page to handle the correct navigation
const ThesisDepartmentCard: React.FC<{ department: Department }> = ({ department }) => {
	const navigate = useNavigate();

	const handleViewTheses = () => {
		// Navigate to the new thesis catalogue route
		navigate(`/dashboard/thesis/${encodeURIComponent(department.nom)}`);
	};

	return (
		<div
			onClick={handleViewTheses}
			className="group relative block bg-black rounded-lg shadow-lg overflow-hidden cursor-pointer"
		>
			<img
				alt={department.nom}
				src={department.image}
				className="absolute inset-0 h-full w-full object-cover opacity-75 transition-opacity group-hover:opacity-50"
			/>
			<div className="relative p-4 sm:p-6 lg:p-8">
				<p className="text-sm bg-primary-100 rounded-md w-fit font-medium uppercase tracking-widest text-secondary-500">
					Department
				</p>
				<p className="text-xl font-bold text-white sm:text-2xl">{department.nom}</p>
				<div className="mt-32 sm:mt-48 lg:mt-64">
					<div className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
						<p className="text-sm text-white">
							View theses and academic research for the {department.nom} department.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};


const ThesisDepartments: React.FC = () => {
	const { t } = useI18n();
	const { departments, isLoading, isSubmitting, createDepartment, error } = useDepartments();
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<div className="p-6">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">
					{/* You may want a new translation key here */}
					{t('components:departments.admin_title', {defaultValue: "Browse Theses by Department"})}
				</h1>
				<Button onClick={() => setIsModalOpen(true)}>
					<FaPlus className="mr-2" />
					{t('components:departments.add_button')}
				</Button>
			</div>

			{error && (
				<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
					<p>{error}</p>
				</div>
			)}

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
						<ThesisDepartmentCard key={dept.id} department={dept} />
					))}
				</div>
			)}

			<AddDepartmentModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAdd={createDepartment}
				isSubmitting={isSubmitting}
			/>
		</div>
	);
};

export default ThesisDepartments;