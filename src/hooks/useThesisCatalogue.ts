// src/hooks/useThesisCatalogue.ts
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as thesisService from '../services/thesisService';
import type { Thesis } from '../types/thesis';
import { useSearchContext } from "../context/SearchContext.tsx";

export const useThesisCatalogue = () => {
	const { departmentName } = useParams<{ departmentName: string }>();
	const { registerSearch, unregisterSearch } = useSearchContext();

	const decodedDepartmentName = useMemo(() => departmentName ? decodeURIComponent(departmentName) : '', [departmentName]);

	const [theses, setTheses] = useState<Thesis[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');

	const loadTheses = useCallback(async () => {
		if (!decodedDepartmentName) {
			setTheses([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const data = await thesisService.fetchThesesByDepartment(decodedDepartmentName);
			setTheses(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			setIsLoading(false);
		}
	}, [decodedDepartmentName]);

	useEffect(() => {
		loadTheses();
	}, [loadTheses]);

	useEffect(() => {
		const searchHandler = (term: string) => setSearchTerm(term);
		registerSearch(searchHandler);
		return () => unregisterSearch();
	}, [registerSearch, unregisterSearch]);

	const filteredTheses = useMemo(() => {
		return theses.filter(thesis =>
			thesis.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			thesis.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
			thesis.keywords.some(k => k.toLowerCase().includes(searchTerm.toLowerCase()))
		).sort((a, b) => b.year - a.year); // Sort by most recent year
	}, [theses, searchTerm]);

	return {
		theses: filteredTheses,
		isLoading,
		error,
		departmentName: decodedDepartmentName,
	};
};