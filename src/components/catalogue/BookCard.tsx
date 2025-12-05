// src/components/catalogue/BookCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBook, FiGrid } from 'react-icons/fi';
import type { Book } from '../../types/book.ts';

interface BookCardProps {
	book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
	const navigate = useNavigate();

	// Handle click to navigate to a detailed view of the book
	const handleCardClick = () => {
		// Note: The route `/dashboard/book-details/${book.id}` needs to be defined in your router.
		navigate(book.id, { state: { book } });
	};

	const stockColor = book.exemplaire > 5 ? 'text-green-600' : book.exemplaire > 0 ? 'text-yellow-600' : 'text-red-600';

	return (
		<div
			onClick={handleCardClick}
			className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col overflow-hidden"
		>
			<div className="relative h-48 bg-secondary-100 overflow-hidden">
				<img
					src={book.image}
					alt={book.name}
					className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
				/>
				<div className={`absolute top-2 right-2 flex items-center bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold ${stockColor}`}>
					<FiGrid className="mr-1" />
					Stock: {book.exemplaire}
				</div>
			</div>
			<div className="p-4 flex flex-col flex-grow">
				<h3 className="font-bold text-md text-gray-800 truncate" title={book.name}>
					{book.name}
				</h3>
				<p className="text-sm text-gray-500 flex items-center mt-1">
					<FiBook className="mr-2" />
					{book.auteur || 'Author not specified'}
				</p>
			</div>
		</div>
	);
};

export default BookCard;