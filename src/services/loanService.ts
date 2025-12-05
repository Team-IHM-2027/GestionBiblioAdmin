// services/loanService.ts
import { collection, doc, updateDoc, arrayUnion, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserLoan, ProcessedUserLoan, UserLoanSlot } from '../types';
import { fetchMaximumSimultaneousLoans } from './configService';

export class LoanService {
  private userCollection = collection(db, 'BiblioUser');
  private archiveCollection = collection(db, 'ArchivesBiblio');

  // Récupérer le nombre maximum d'emprunts
  async getMaxLoans(): Promise<number> {
    return await fetchMaximumSimultaneousLoans();
  }

  // Traiter les données utilisateur pour extraire les slots actifs
  processUserLoanData(userData: UserLoan, maxLoans: number): ProcessedUserLoan {
    const activeSlots: UserLoanSlot[] = [];

    for (let i = 1; i <= maxLoans; i++) {
      const etatKey = `etat${i}`;
      const tabKey = `tabEtat${i}`;

      const status = userData[etatKey] as 'emprunt' | 'ras';
      const tabData = userData[tabKey] as [string, string, string, number, string, string];

      if (status === 'emprunt' && tabData && Array.isArray(tabData) && tabData[0]) {
        activeSlots.push({
          slotNumber: i,
          status: 'emprunt',
          document: {
            name: tabData[0],
            category: tabData[1],
            imageUrl: tabData[2],
            exemplaires: tabData[3],
            collection: tabData[4],
            borrowDate: tabData[5]
          }
        });
      }
    }

    return {
      email: userData.email,
      name: userData.name,
      niveau: userData.niveau,
      imageUri: userData.imageUri,
      activeSlots,
      totalActiveLoans: activeSlots.length
    };
  }

  // Récupérer tous les emprunts actifs
  async getActiveLoans(): Promise<ProcessedUserLoan[]> {
    try {
      const maxLoans = await this.getMaxLoans();
      const snapshot = await getDocs(this.userCollection);
      const users: ProcessedUserLoan[] = [];

      snapshot.forEach((docSnap) => {
        const userData = { ...docSnap.data(), email: docSnap.id } as UserLoan;
        let hasActiveLoans = false;
        for (let i = 1; i <= maxLoans; i++) {
          if (userData[`etat${i}`] === 'emprunt') {
            hasActiveLoans = true;
            break;
          }
        }
        if (hasActiveLoans) {
          const processedUser = this.processUserLoanData(userData, maxLoans);
          users.push(processedUser);
        }
      });

      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des emprunts:', error);
      throw new Error('Impossible de récupérer les emprunts');
    }
  }

  // Obtenir les données d'un document pour un slot donné
  async getDocumentDataForSlot(userEmail: string, slot: number): Promise<[string, string, string, number, string, string] | null> {
    try {
      const userRef = doc(this.userCollection, userEmail);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return null;

      const userData = userSnap.data() as UserLoan;
      const tabKey = `tabEtat${slot}`;
      const tabData = userData[tabKey];

      return Array.isArray(tabData) ? (tabData as [string, string, string, number, string, string]) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données du document:', error);
      return null;
    }
  }

  // Ajouter à l'archive
  private async addToArchive(studentName: string, documentName: string): Promise<void> {
    try {
      const archiveRef = doc(this.archiveCollection, 'Arch');
      const currentDate = new Date().toISOString().slice(0, 25);

      await updateDoc(archiveRef, {
        tableauArchives: arrayUnion({
          nomEtudiant: studentName,
          nomDoc: documentName,
          heure: currentDate
        })
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout à l\'archive:', error);
      throw new Error('Impossible d\'ajouter à l\'archive');
    }
  }

  // Retourner un document (version avec ID direct)
  async returnDocument(
    userEmail: string,
    documentSlot: number,
    documentData: [string, string, string, number, string, string],
    userName: string
  ): Promise<void> {
    try {
      const [documentId, , , exemplaires] = documentData;
      const collectionName = 'BiblioBooks';

      // Accès direct via ID
      const docRef = doc(db, collectionName, documentId);

      // Vérifier que le document existe
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error(`Document ${documentId} introuvable dans la collection ${collectionName}`);

      // Mettre à jour le nombre d'exemplaires
      await updateDoc(docRef, { exemplaire: exemplaires + 1 });

      // Ajouter à l'archive
      await this.addToArchive(userName, documentId);

      // Mettre à jour l'état de l'utilisateur
      const userRef = doc(this.userCollection, userEmail);
      const updateData: any = {};
      updateData[`etat${documentSlot}`] = 'ras';
      updateData[`tabEtat${documentSlot}`] = ['', '', '', 0, '', ''];
      await updateDoc(userRef, updateData);
    } catch (error) {
      console.error('Erreur lors du retour du document:', error);
      throw error;
    }
  }

  // Retourner document pour un slot donné d'un utilisateur traité
  async returnDocumentForProcessedUser(user: ProcessedUserLoan, slot: number): Promise<void> {
    const slotData = user.activeSlots.find(s => s.slotNumber === slot);
    if (!slotData || !slotData.document) throw new Error(`Aucun document emprunté trouvé dans le slot ${slot}`);

    const documentData: [string, string, string, number, string, string] = [
      slotData.document.name,
      slotData.document.category,
      slotData.document.imageUrl,
      slotData.document.exemplaires,
      slotData.document.collection,
      slotData.document.borrowDate
    ];

    return this.returnDocument(user.email, slot, documentData, user.name);
  }

  // Statistiques
  async getLoanStatistics(): Promise<{
    totalActiveLoans: number;
    totalUsers: number;
    averageLoansPerUser: number;
    maxLoansAllowed: number;
  }> {
    try {
      const maxLoans = await this.getMaxLoans();
      const users = await this.getActiveLoans();
      const totalActiveLoans = users.reduce((total, user) => total + user.totalActiveLoans, 0);

      return {
        totalActiveLoans,
        totalUsers: users.length,
        averageLoansPerUser: users.length > 0 ? totalActiveLoans / users.length : 0,
        maxLoansAllowed: maxLoans
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return { totalActiveLoans: 0, totalUsers: 0, averageLoansPerUser: 0, maxLoansAllowed: 3 };
    }
  }

  // Vérifier si un utilisateur peut emprunter
  async canUserBorrow(userEmail: string): Promise<{ canBorrow: boolean; reason?: string }> {
    try {
      const maxLoans = await this.getMaxLoans();
      const userRef = doc(this.userCollection, userEmail);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return { canBorrow: false, reason: 'Utilisateur non trouvé' };

      const userData = userSnap.data() as UserLoan;
      const currentLoans = Array.from({ length: maxLoans }, (_, i) => userData[`etat${i + 1}`]).filter(e => e === 'emprunt').length;

      if (currentLoans >= maxLoans) return { canBorrow: false, reason: `Limite de ${maxLoans} emprunts simultanés atteinte (${currentLoans}/${maxLoans})` };
      return { canBorrow: true };
    } catch (error) {
      console.error('Erreur lors de la vérification des emprunts:', error);
      return { canBorrow: false, reason: 'Erreur lors de la vérification' };
    }
  }

  // Trouver slot libre
  async findNextAvailableSlot(userEmail: string): Promise<number | null> {
    try {
      const maxLoans = await this.getMaxLoans();
      const userRef = doc(this.userCollection, userEmail);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return null;

      const userData = userSnap.data() as UserLoan;
      for (let i = 1; i <= maxLoans; i++) if (userData[`etat${i}`] !== 'emprunt') return i;
      return null;
    } catch (error) {
      console.error('Erreur lors de la recherche de slot libre:', error);
      return null;
    }
  }
}

// Instance singleton
export const loanService = new LoanService();
