import { collection, doc, updateDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import { fetchMaximumSimultaneousLoans } from './configService';
import type { ProcessedUserReservation, ReservationSlot, UserReservation } from '../types/reservations';

export class ReservationService {
  private readonly userCollection = collection(db, 'BiblioUser');

  /**
   * Convertit une date de n'importe quel format en string ISO
   * Gère Timestamp Firebase, Date JS, string ISO et objet {seconds, nanoseconds}
   */
  public ensureStringDate(date: Timestamp | string | Date | { seconds: number; nanoseconds: number } | null | undefined): string {
  if (!date) return new Date().toISOString();
  
  // Si c'est déjà une string, vérifier qu'elle est valide
  if (typeof date === 'string') {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? new Date().toISOString() : date;
  }
  
  if (date instanceof Timestamp) return date.toDate().toISOString();
  if (date instanceof Date) return date.toISOString();
  
  if (typeof date === 'object' && 'seconds' in date) {
    return new Timestamp(date.seconds, date.nanoseconds).toDate().toISOString();
  }
  
  console.warn('Format de date non reconnu:', date);
  return new Date().toISOString();
}

  async getMaxLoans(): Promise<number> {
    return await fetchMaximumSimultaneousLoans();
  }

  processUserReservationData(userData: UserReservation, maxLoans: number): ProcessedUserReservation {
    const reservationSlots: ReservationSlot[] = [];

    for (let i = 1; i <= maxLoans; i++) {
      const status = userData[`etat${i}`] as 'reserv' | 'emprunt' | 'ras';
      const tabData = userData[`tabEtat${i}`] as [string, string, string, number, string, string];

      if (status === 'reserv' && tabData?.[0]) {
        reservationSlots.push({
          slotNumber: i,
          status,
          document: {
            name: tabData[0],
            category: tabData[1],
            imageUrl: tabData[2],
            exemplaires: tabData[3],
            collection: tabData[4],
            reservationDate: this.ensureStringDate(tabData[5])
          }
        });
      }
    }

    return {
      email: userData.email,
      name: userData.name,
      niveau: userData.niveau,
      matricule: userData.matricule,
      imageUri: userData.imageUri,
      reservationSlots,
      totalActiveReservations: reservationSlots.length
    };
  }

  async getActiveReservations(): Promise<ProcessedUserReservation[]> {
    try {
      const maxLoans = await this.getMaxLoans();
      const snapshot = await getDocs(this.userCollection);
      const users: ProcessedUserReservation[] = [];
      
      snapshot.forEach((docSnap) => {
        const userData = { ...docSnap.data(), email: docSnap.id } as UserReservation;
        
        // Vérifie s'il y a des réservations actives
        const hasActiveReservations = Array.from({ length: maxLoans }, (_, i) => i + 1)
          .some(i => userData[`etat${i}`] === 'reserv');
        
        if (hasActiveReservations) {
          users.push(this.processUserReservationData(userData, maxLoans));
        }
      });
      
      return users;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw new Error('Impossible de récupérer les réservations');
    }
  }

  async validateReservation(
    userEmail: string,
    slot: number,
    documentData: [string, string, string, number, string, string]
  ): Promise<void> {
    try {
      const [documentName, , , , collectionName = 'BiblioBooks'] = documentData;
      const currentDate = new Date().toISOString();

      // Décrémenter les exemplaires
      const docQuery = query(
        collection(db, collectionName), 
        where('name', '==', documentName)
      );
      const docSnapshot = await getDocs(docQuery);

      if (!docSnapshot.empty) {
        const docRef = docSnapshot.docs[0].ref;
        const currentExemplaire = docSnapshot.docs[0].data().exemplaire || 0;
        await updateDoc(docRef, {
          exemplaire: Math.max(0, currentExemplaire - 1)
        });
      }

      // Mettre à jour l'état utilisateur
      await updateDoc(doc(this.userCollection, userEmail), {
        [`etat${slot}`]: 'emprunt',
        [`tabEtat${slot}`]: [...documentData.slice(0, 5), currentDate]
      });

    } catch (error) {
      console.error('Erreur lors de la validation de la réservation:', error);
      throw error;
    }
  }

  async validateReservationForProcessedUser(
    user: ProcessedUserReservation, 
    slot: number
  ): Promise<void> {
    const slotData = user.reservationSlots.find(s => s.slotNumber === slot);
    
    if (!slotData?.document) {
      throw new Error(`Aucune réservation trouvée dans le slot ${slot}`);
    }

    const { name, category, imageUrl, exemplaires, collection } = slotData.document;
    return this.validateReservation(
      user.email, 
      slot,
      [name, category, imageUrl, exemplaires, collection, '']
    );
  }

  async getReservationStatistics() {
    try {
      const [maxLoans, users] = await Promise.all([
        this.getMaxLoans(),
        this.getActiveReservations()
      ]);
      
      const totalActiveReservations = users.reduce(
        (total, user) => total + user.totalActiveReservations, 0
      );

      return {
        totalActiveReservations,
        totalUsers: users.length,
        averageReservationsPerUser: users.length > 0 
          ? totalActiveReservations / users.length 
          : 0,
        maxLoansAllowed: maxLoans
      };
    } catch (error) {
      console.error('Erreur lors du calcul des statistiques:', error);
      return { 
        totalActiveReservations: 0, 
        totalUsers: 0, 
        averageReservationsPerUser: 0, 
        maxLoansAllowed: 3 
      };
    }
  }
}

export const reservationService = new ReservationService();