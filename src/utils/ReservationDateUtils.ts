import { reservationService } from '../services/reservationService';
import type { Timestamp } from 'firebase/firestore';

export const formatReservationDate = (
  date: Timestamp | string | Date | { seconds: number; nanoseconds: number } | null | undefined,
  format: 'date' | 'datetime' | 'time' = 'date'
): string => {
  try {
    // Utilise la fonction du service pour convertir en string ISO
    const isoString = reservationService.ensureStringDate(date);
    const dateObj = new Date(isoString);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...(format === 'datetime' && {
        hour: '2-digit',
        minute: '2-digit'
      }),
      ...(format === 'time' && {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    return dateObj.toLocaleDateString('fr-FR', options);
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};