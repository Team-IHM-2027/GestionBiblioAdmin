// src/hooks/useBookDetails.ts
import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as bookService from '../services/bookService';
import { useCloudinaryUpload } from './useCloudinaryUpload';
import type { Book, Comment } from '../types/book';
import {Timestamp} from "firebase/firestore";

export const useBookDetails = () => {
	const { bookId } = useParams<{ bookId: string }>();
	const location = useLocation();
	const navigate = useNavigate();

	const [book, setBook] = useState<Book | null>(location.state?.book || null);
	const [isLoading, setIsLoading] = useState(!book);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isDeletable, setIsDeletable] = useState(true);
	const [deleteReason, setDeleteReason] = useState('');

	const { uploadFile, isUploading: isCloudinaryUploading } = useCloudinaryUpload();

	// Fetch book details if not passed via route state or if ID changes
	useEffect(() => {
		if (!bookId) {
			setError("Book ID is missing.");
			setIsLoading(false);
			return;
		}

		// Only fetch if we don't have the book data already
		if (!book || book.id !== bookId) {
			setIsLoading(true);
			bookService.fetchBookById(bookId)
				.then(data => setBook(data))
				.catch(err => setError(err.message))
				.finally(() => setIsLoading(false));
		}
	}, [bookId, book]);

	// Check if the book can be deleted whenever it changes
	useEffect(() => {
		if (book?.name) {
			bookService.isBookInUse(book.name).then(result => {
				setIsDeletable(!result.inUse);
				setDeleteReason(result.reason);
			});
		}
	}, [book]);

	/**
	 * Adds a new comment to the current book.
	 * @param text The content of the comment.
	 * @param rating The star rating given by the user.
	 */
	const addComment = async (text: string, rating: number): Promise<void> => {
		if (!bookId || !book) return;

		setIsSubmitting(true);
		try {
			const newComment: Comment = {
				texte: text,
				note: rating,
				nomUser: 'Admin User', // Replace with actual logged-in user name
				heure: Timestamp.now(), // Use Firestore Timestamp for consistency
			};

			// Perform the database update
			await bookService.addCommentToBook(bookId, newComment);

			// Optimistic UI Update: Add the comment to the local state immediately
			// This makes the UI feel instantaneous.
			setBook(prevBook => {
				if (!prevBook) return null;
				const existingComments = prevBook.commentaire || [];
				return {
					...prevBook,
					commentaire: [...existingComments, newComment],
				};
			});
		} catch (err) {
			console.error(err);
			// Re-throw the error to be handled by the UI component (e.g., show an alert)
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	const updateBookDetails = async (updatedData: Partial<Book>, imageFile?: File | null) => {
		if (!bookId) return;
		setIsSubmitting(true);
		try {
			let imageUrl = updatedData.image;
			if (imageFile) {
				imageUrl = await uploadFile(imageFile) || book?.image;
			}
			const finalData = { ...updatedData, image: imageUrl };
			await bookService.updateBook(bookId, finalData);
			// setBook(prev => prev ? { ...prev, ...finalData } : null); // Update local state
			setBook(prev => prev ? { ...prev, ...finalData, image: imageUrl ?? prev.image } as Book : null); // Update local state
		} catch (err) {
			console.error(err);
			throw err; // Re-throw to be caught in the component
		} finally {
			setIsSubmitting(false);
		}
	};

	const removeBook = async () => {
		if (!bookId || !isDeletable) return;
		setIsSubmitting(true);
		try {
			await bookService.deleteBook(bookId);
			navigate(-1); // Go back after deletion
		} catch (err) {
			console.error(err);
			throw err;
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		book,
		isLoading,
		isSubmitting: isSubmitting || isCloudinaryUploading,
		error,
		isDeletable,
		deleteReason,
		addComment,
		updateBookDetails,
		removeBook
	};
};