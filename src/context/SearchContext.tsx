// src/context/SearchContext.tsx
import React, { createContext, useState, useContext, useCallback } from 'react';
import type {ReactNode} from 'react';

// Define the shape of the context's state
interface SearchContextType {
	searchWord: string;
	setSearchWord: (word: string) => void;
	// This will hold the search function provided by the active page
	onSearch: ((term: string) => void) | null;
	// This function allows pages to register their search logic
	registerSearch: (handler: (term: string) => void) => void;
	// This function allows pages to unregister their search logic
	unregisterSearch: () => void;
}

// Create the context with a default value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Create the Provider component
export const SearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [searchWord, setSearchWord] = useState('');
	const [onSearch, setOnSearch] = useState<((term: string) => void) | null>(null);

	const handleSetSearchWord = (word: string) => {
		setSearchWord(word);
		// If a search handler is registered, call it immediately when the word changes.
		if (onSearch) {
			onSearch(word);
		}
	};

	const registerSearch = useCallback((handler: (term: string) => void) => {
		// console.log("Registering a search handler.");
		setOnSearch(() => handler);
	}, []);

	const unregisterSearch = useCallback(() => {
		// console.log("Unregistering search handler.");
		setOnSearch(null);
		setSearchWord(''); // Clear search word when leaving a searchable page
	}, []);

	const value = {
		searchWord,
		setSearchWord: handleSetSearchWord,
		onSearch,
		registerSearch,
		unregisterSearch,
	};

	return (
		<SearchContext.Provider value={value}>
			{children}
		</SearchContext.Provider>
	);
};

// Create a custom hook for easy access to the context
export const useSearchContext = () => {
	const context = useContext(SearchContext);
	if (context === undefined) {
		throw new Error('useSearchContext must be used within a SearchProvider');
	}
	return context;
};