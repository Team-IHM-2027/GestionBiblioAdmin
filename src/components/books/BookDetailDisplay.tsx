// src/components/books/BookDetailDisplay.tsx
import React from 'react';
import type { Book } from '../../types/book';
import useI18n from '../../hooks/useI18n';

interface BookDetailDisplayProps {
	book: Book;
}

const InfoRow: React.FC<{ label: string; value?: string | number; className?: string | undefined }> = ({ label, value, className }) => (
	<div className={`${className} flex justify-between py-3 border-b border-secondary-200`}>
		<span className="text-secondary-600">{label}</span>
		<span className="font-semibold text-gray-800 text-right">{value || 'N/A'}</span>
	</div>
);

export const BookDetailDisplay: React.FC<BookDetailDisplayProps> = ({ book }) => {
	const { t } = useI18n();

	const stockColor = book.exemplaire > 5 ? 'text-green-600' : book.exemplaire > 0 ? 'text-yellow-600' : 'text-red-600';

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
			{/* Left Column: Image */}
			<div className="md:col-span-1">
				<img src={book.image} alt={book.name} className="w-full h-auto object-contain rounded-lg shadow-lg" />
			</div>

			{/* Right Column: Details */}
			<div className="md:col-span-2">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">{book.name}</h1>
				<p className="text-lg text-secondary-700 mb-4">{t('pages:book_details.by_author', { author: book.auteur || 'Unknown' })}</p>

				{/* <Rating value={averageRating} readOnly precision={0.5} /> */}

				<p className="text-gray-600 leading-relaxed my-6">{book.desc || t('pages:book_details.no_description')}</p>

				<div className="bg-secondary-50 p-4 rounded-lg">
					<InfoRow label={t('pages:book_details.edition')} value={book.edition} />
					<InfoRow label={t('pages:book_details.category')} value={book.cathegorie} />
					<InfoRow label={t('pages:book_details.initial_stock')} value={book.initialExemplaire} />
					<InfoRow label={t('pages:book_details.current_stock')}className={stockColor} value={book.exemplaire} />
					<InfoRow label={t('pages:book_details.shelf')} value={book.etagere} />
					<InfoRow label={t('pages:book_details.room')} value={book.salle} />
				</div>
			</div>
		</div>
	);
};