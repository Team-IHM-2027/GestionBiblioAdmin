// src/pages/Catalogue.tsx
import React from 'react';
import { useCatalogue } from '../hooks/useCatalogue.ts';
import BookCard from '../components/catalogue/BookCard';
import Spinner from '../components/common/Spinner';

import CatalogueFilters from "../components/catalogue/CatalogueFilters.tsx";
import { Button } from '../components/common/Button';
import {FiPlus} from "react-icons/fi";
import useI18n from "../hooks/useI18n.ts";
import {useNavigate} from "react-router-dom";

const Catalogue: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useI18n();
	const {
		paginatedBooks,
		isLoading,
		error,
		departmentName,
		// currentPage,
		// totalPages,
		setSortOption,
		// setCurrentPage,
	} = useCatalogue();

	if (isLoading) return <Spinner />;
	if (error) return <div className="text-center text-red-500">{error}</div>;

	return (
		<div>
			{/* Header with Add Button */}
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-700">
					{t('pages:book_details.browsing', { department: departmentName })}
				</h2>
				<Button onClick={() => navigate('add')}> {/* Relative navigation to 'add' */}
					<FiPlus className="mr-2" />
					{t('pages:book_details.add_new')}
				</Button>
			</div>

			<div className="flex justify-end">
				<CatalogueFilters
					onSortChange={setSortOption}
				/>
			</div>


			{paginatedBooks.length > 0 ? (
				<>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{paginatedBooks.map(book => (
							<BookCard key={book.id} book={book} />
						))}
					</div>

				</>
			) : (
				<div className="text-center py-10 bg-secondary-100 rounded-lg">
					<p className="text-secondary-600">{t('pages:book_details.add_new')}</p>
				</div>
			)}
		</div>
	);
};

export default Catalogue;