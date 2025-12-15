// src/services/authService.ts
import { auth, db } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface AdminData {
  uid: string;
  email: string;
  name: string;
  role: string;
  gender: string;
  isVerified: boolean;
  etat: 'ras' | 'bloc';
}

/**
 * INSCRIPTION + EMAIL DE VÉRIFICATION
 */
export const registerAdmin = async (
  name: string,
  email: string,
  password: string,
  gender: string
): Promise<void> => {

  // 1. Créer le compte Firebase Auth
  const cred = await createUserWithEmailAndPassword(auth, email, password);

  // 2. Envoyer le mail de vérification (GMAIL RÉEL)
  await sendEmailVerification(cred.user);

  // 3. Créer le profil Firestore
  await setDoc(doc(db, 'BiblioAdmin', cred.user.uid), {
    name,
    email,
    gender,
    role: 'bibliothecaire',
    createdAt: new Date(),
    isVerified: false,
    etat: 'ras'
  });
};

/**
 * CONNEXION (INTERDITE SI EMAIL NON VÉRIFIÉ)
 */
export const loginAdmin = async (
  email: string,
  password: string
): Promise<AdminData> => {

  const cred = await signInWithEmailAndPassword(auth, email, password);

  if (!cred.user.emailVerified) {
    await signOut(auth);
    throw new Error("Veuillez vérifier votre email avant de vous connecter.");
  }

  const snap = await getDoc(doc(db, 'BiblioAdmin', cred.user.uid));
  if (!snap.exists()) {
    throw new Error("Profil utilisateur introuvable.");
  }

  const data = snap.data();

  if (data.etat === 'bloc') {
    throw new Error("Votre compte est bloqué.");
  }

  return {
    uid: cred.user.uid,
    email: cred.user.email!,
    name: data.name,
    role: data.role,
    gender: data.gender,
    isVerified: true,
    etat: data.etat
  };
};

export const logout = async () => {
  await signOut(auth);
};
