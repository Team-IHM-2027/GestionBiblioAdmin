// src/services/statisticsService.ts
import { collection, getCountFromServer } from 'firebase/firestore';
import { db } from '../config/firebase';

// Les noms de vos collections Firestore
const booksCollection = collection(db, 'BiblioBooks');
const usersCollection = collection(db, 'BiblioUser');
const departmentsCollection = collection(db, 'Departements');

export interface LandingPageStats {
	totalBooks: number;
	activeUsers: number;
	departmentCount: number;
}

/**
 * Récupère toutes les statistiques nécessaires pour la page d'accueil.
 * Utilise getCountFromServer pour une efficacité maximale (ne télécharge pas tous les documents).
 * @returns Un objet contenant les statistiques calculées.
 */
export const getLandingPageStats = async (): Promise<LandingPageStats> => {
	try {
		// Exécute toutes les requêtes de comptage en parallèle pour plus de rapidité
		const [
			booksSnapshot,
			usersSnapshot,
			departmentsSnapshot
		] = await Promise.all([
			getCountFromServer(booksCollection),
			getCountFromServer(usersCollection),
			getCountFromServer(departmentsCollection),
		]);

		// Extrait le nombre de chaque snapshot
		const stats: LandingPageStats = {
			totalBooks: booksSnapshot.data().count,
			activeUsers: usersSnapshot.data().count,
			departmentCount: departmentsSnapshot.data().count,
		};

		console.log("Statistiques récupérées :", stats);
		return stats;

	} catch (error) {
		console.error("Erreur lors de la récupération des statistiques :", error);
		// En cas d'erreur, renvoyer des valeurs par défaut pour ne pas casser la page
		return {
			totalBooks: 0,
			activeUsers: 0,
			departmentCount: 0,
		};
	}
};