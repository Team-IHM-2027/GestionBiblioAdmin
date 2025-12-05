import type { Timestamp } from 'firebase/firestore';

export type SortOption = 'nameAsc' | 'nameDesc' | 'stockAsc' | 'stockDesc';

export interface CatalogueFiltersProps {
	onSortChange: (option: 'nameAsc' | 'nameDesc' | 'stockAsc' | 'stockDesc') => void;
}
/**
 * Defines the structure for a single comment on a book.
 */
export interface Comment {
	heure: Timestamp; // Using Firestore's Timestamp for accurate sorting
	nomUser: string;
	texte: string;
	note: number;
}

/**
 * Defines the data structure for a single book in the library.
 */
export interface Book {
	id: string; // The unique ID from Firestore (was nomBD)
	name: string;
	cathegorie: string; // Department/Category
	exemplaire: number; // Current available copies
	initialExemplaire: number; // Total copies in inventory
	etagere: string; // Shelf number
	salle: string;   // Room number
	desc: string;
	image: string; // Cloudinary URL
	auteur?: string;
	edition?: string;
	commentaire?: Comment[];

}

/**
 * Defines the structure for a department.
 */
export interface Department {
	id: string;    // Firestore document ID
	nom: string;   // Name of the department (e.g., "Genie Informatique")
	image: string; // URL of the department's image
	// Add any other fields that might be part of a department document, if known.
	// For now, these are the core fields based on usage in components like DepartementCard.
}