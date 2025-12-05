// types/reservations.ts
export interface UserReservation {
  email: string;
  name: string;
  niveau: string;
  matricule?: string;
  imageUri?: string;
  // États et tableaux dynamiques basés sur MaximumSimultaneousLoans
  [key: string]: any; // Pour permettre etat1, etat2, ..., etatN et tabEtat1, tabEtat2, ..., tabEtatN
}

export interface ReservationSlot {
  slotNumber: number;
  status: 'reserv' | 'emprunt' | 'ras';
  document: {
    name: string;
    category: string;
    imageUrl: string;
    exemplaires: number;
    collection: string;
     reservationDate: string;

  };
}

export interface ProcessedUserReservation {
  email: string;
  name: string;
  niveau: string;
  matricule?: string;
  imageUri?: string;
  reservationSlots: ReservationSlot[];
  totalActiveReservations: number;
}

export interface ReservationFilters {
  searchTerm: string;
  status: 'all' | 'reserv' | 'emprunt';
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}