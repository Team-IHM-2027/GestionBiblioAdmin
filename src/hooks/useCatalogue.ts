// src/hooks/useCatalogue.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as bookService from '../services/bookService';
import type { Book } from '../types/book';
import {useSearchContext} from "../context/SearchContext.tsx";
import type { SortOption } from '../types/book.ts';

export const useCatalogue = () => {
	const { departmentName } = useParams<{ departmentName: string }>();
	const { registerSearch, unregisterSearch } = useSearchContext();

	const decodedDepartmentName = useMemo(() => {
		const decoded = departmentName ? decodeURIComponent(departmentName) : '';
		// Add a log to see the decoded value
		console.log(`[useCatalogue] URL param decoded to: "${decoded}"`);
		return decoded;
	}, [departmentName]);


	const [books, setBooks] = useState<Book[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [searchTerm, setSearchTerm] = useState('');
	const [sortOption, setSortOption] = useState<SortOption>('nameAsc');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;

	// The rest of your hook can stay as it is from the previous correction.
	// The logging above is the key addition for debugging.

	const loadBooks = useCallback(async () => {
		if (!decodedDepartmentName) {
			setBooks([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const data = await bookService.fetchBooksByDepartment(decodedDepartmentName);
			setBooks(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setIsLoading(false);
		}
	}, [decodedDepartmentName]);

	useEffect(() => {
		loadBooks();
	}, [loadBooks]);

	// This effect registers the search handler when the page mounts
	// and unregisters it when it unmounts. This is the key to the dynamic navbar.
	useEffect(() => {
		// The function we provide is what the Navbar will use for searching.
		const searchHandler = (term: string) => {
			setSearchTerm(term);
		};

		registerSearch(searchHandler);

		// Cleanup function: This runs when the component unmounts.
		return () => {
			unregisterSearch();
		};
	}, [registerSearch, unregisterSearch]);

	// Memoized logic for filtering, sorting, and paginating books
	const processedBooks = useMemo(() => {
		const filtered = books.filter(book =>
			book.name.toLowerCase().includes(searchTerm.toLowerCase())
		);

		filtered.sort((a, b) => {
			switch (sortOption) {
				case 'nameAsc': return a.name.localeCompare(b.name);
				case 'nameDesc': return b.name.localeCompare(a.name);
				case 'stockAsc': return a.exemplaire - b.exemplaire;
				case 'stockDesc': return b.exemplaire - a.exemplaire;
				default: return 0;
			}
		});

		return filtered;
	}, [books, searchTerm, sortOption]);

	const paginatedBooks = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return processedBooks.slice(startIndex, startIndex + itemsPerPage);
	}, [processedBooks, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(processedBooks.length / itemsPerPage);

	// Reset to page 1 when filters change to avoid being on an empty page
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm, sortOption]);


	return {
		// Data and State
		paginatedBooks,
		isLoading,
		error,
		departmentName: decodedDepartmentName,
		totalPages,
		currentPage,
		// State Setters and Handlers
		setSortOption,
		setCurrentPage,
	};
	// ... rest of the hook
};