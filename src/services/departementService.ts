// src/services/departmentService.ts
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase'; // Assumes your Firebase config is here
import type {Department} from "../types/departement.ts";

const departmentsCollectionRef = collection(db, 'Departements');

/**
 * Fetches all departments from the Firestore database.
 * @returns A promise that resolves to an array of Department objects.
 */
export const fetchDepartments = async (): Promise<Department[]> => {
	try {
		const querySnapshot = await getDocs(departmentsCollectionRef);
		const departments = querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data()
		})) as Department[];
		return departments;
	} catch (error) {
		console.error("Error fetching departments from service:", error);
		throw error; // Re-throw the error to be handled by the caller
	}
};

/**
 * Adds a new department to the Firestore database.
 * @param name - The name of the new department.
 * @param imageUrl - The Cloudinary URL for the department's image.
 * @returns A promise that resolves when the department is added.
 */
export const addDepartment = async (name: string, imageUrl: string): Promise<void> => {
	try {
		await addDoc(departmentsCollectionRef, {
			nom: name,
			image: imageUrl,
		});
	} catch (error) {
		console.error("Error adding department from service:", error);
		throw error;
	}
};