// src/services/authService.tsx
import { db } from '../config/firebase';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

export interface AdminData {
	uid: string;
	email: string;
	password?: string;
	name: string;
	role: string;
	gender: string;
	createdAt: Date;
	isVerified: boolean; // Nous gardons ce champ pour une utilisation future
	etat: 'ras' | 'bloc';
}

/**
 * Crée un nouvel admin dans la collection BiblioAdmin.
 * Le compte est vérifié par défaut.
 */
export const registerAdmin = async (name: string, email: string, password: string, gender: string): Promise<void> => {
	const q = query(collection(db, 'BiblioAdmin'), where('email', '==', email));
	const querySnapshot = await getDocs(q);
	if (!querySnapshot.empty) {
		throw new Error('Cette adresse e-mail est déjà utilisée.');
	}

	const hashedPassword = await bcrypt.hash(password, 10);
	const adminDocRef = doc(db, 'BiblioAdmin', email);

	await setDoc(adminDocRef, {
		name,
		email,
		gender,
		password: hashedPassword,
		role: 'bibliothecaire',
		imageUrl: "", // L'image peut être ajoutée plus tard
		createdAt: new Date(),
		isVerified: true, // L'utilisateur est vérifié par défaut
	});
};

/**
 * Connecte un admin en vérifiant l'email et le mot de passe.
 */
export const loginAdmin = async (email: string, password: string): Promise<AdminData> => {
	const q = query(collection(db, 'BiblioAdmin'), where('email', '==', email));
	const querySnapshot = await getDocs(q);

	if (querySnapshot.empty) {
		throw new Error("L'email ou le mot de passe est incorrect.");
	}

	const adminDocSnap = querySnapshot.docs[0];
	const adminData = adminDocSnap.data();

	if (!adminData.isVerified) {
		// Cette vérification reste au cas où vous changeriez manuellement le statut dans la DB
		throw new Error("Ce compte n'est pas activé. Veuillez contacter le support.");
	}

	const isMatch = await bcrypt.compare(password, adminData.password);
	if (!isMatch) {
		throw new Error("L'email ou le mot de passe est incorrect.");
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { password: _, adminInfo } = adminData;
	return { uid: adminDocSnap.id, ...adminInfo } as AdminData;
};

/**
 * Envoie un e-mail de réinitialisation de mot de passe.
 * Note: Cette fonction est un placeholder. Vous devez implémenter l'envoi d'e-mail via votre service d'e-mail.
 */
