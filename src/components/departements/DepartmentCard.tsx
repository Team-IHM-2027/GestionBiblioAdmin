import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Department {
	id: string;
	nom: string;
	image: string;
}

interface DepartmentCardProps {
	department: Department;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ department }: DepartmentCardProps) => {
	const navigate = useNavigate();

	const handleViewBooks = () => {
		// This should navigate to the catalogue page for this department
		// navigate(`/dashboard/books/${department.nom}`);
		navigate(encodeURIComponent(department.nom));
		console.log(`Navigating to books for department: ${department.nom}`);
	};

	return (
		<div
			onClick={handleViewBooks}
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
					<div
						className="translate-y-8 transform opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100"
					>
						<p className="text-sm text-white">
							View books, theses, and manage resources for the {department.nom} department.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DepartmentCard;