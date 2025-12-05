import React, { useState } from 'react';
import { useBookDetails } from '../hooks/useBookDetails';
import { BookDetailDisplay } from '../components/books/BookDetailDisplay';
import { EditBookModal } from '../components/books/EditBookModal';
import { Button } from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import useI18n from '../hooks/useI18n';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import {CommentList} from "../components/books/CommentList.tsx";

const BookDetails: React.FC = () => {
	const { book, isLoading, error, isSubmitting, isDeletable, deleteReason, updateBookDetails, removeBook } = useBookDetails();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const { t } = useI18n();

	if (isLoading) return <Spinner />;
	if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
	if (!book) return <div className="text-center text-gray-500 p-8">Book not found.</div>;

	const handleDeleteClick = () => {
		if (isDeletable && window.confirm(t('pages:pages:book_details.confirm_delete', { bookName: book.name }))) {
			removeBook().catch(
				err => alert(t('pages:book_details.delete_failed')
					+ `: ${err.message}`

				));
		}
	};


	return (
		<div>
			<div className="max-w-7xl mx-auto">
				{/* Action Buttons */}
				<div className="flex justify-end items-center gap-4 mb-6">
					<Button onClick={() => setIsEditModalOpen(true)}>
						<FiEdit className="mr-2" />
						{t('pages:book_details.edit_book')}
					</Button>
					<div title={!isDeletable ? deleteReason : ''}>
						<Button
							variant="outline"
							onClick={handleDeleteClick}
							disabled={!isDeletable || isSubmitting}
							className={!isDeletable ? 'cursor-not-allowed border-red-200 text-red-300' : 'border-red-500 text-red-500 hover:bg-red-50'}
						>
							<FiTrash2 className="mr-2" />
							{t('common:delete')}
						</Button>
					</div>
				</div>

				{/* Main Display */}
				<BookDetailDisplay book={book} />

				{/* Comment Section */}
				<div className="mt-12">
					<CommentList comments={book.commentaire || []} />
				</div>

				{/* Edit Modal */}
				<EditBookModal
					isOpen={isEditModalOpen}
					onClose={() => setIsEditModalOpen(false)}
					book={book}
					onSave={updateBookDetails}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	);
};

export default BookDetails;