// hooks/useReservations.ts
import { useState, useEffect, useCallback } from 'react';
import { reservationService } from '../services/reservationService';
import type { ProcessedUserReservation } from '../types/reservations';
import type { NotificationState } from '../types';
;

export const useReservations = () => {
  const [reservations, setReservations] = useState<ProcessedUserReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingItem, setProcessingItem] = useState<string | null>(null);
  const [maxLoans, setMaxLoans] = useState<number>(3);
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    type: 'success',
    message: ''
  });

  // Charger les réservations
  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      
      // Charger en parallèle les réservations et la configuration
      const [activeReservations, maxLoansConfig] = await Promise.all([
        reservationService.getActiveReservations(),
        reservationService.getMaxLoans()
      ]);
      
      setReservations(activeReservations);
      setMaxLoans(maxLoansConfig);
    } catch (error) {
      showNotification('error', 'Erreur lors du chargement des réservations');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Afficher une notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ visible: true, type, message });
    setTimeout(() => {
      setNotification({ visible: false, type: 'success', message: '' });
    }, 3000);
  }, []);

  // Valider une réservation (la transformer en emprunt)
  const validateReservation = useCallback(async (
    user: ProcessedUserReservation, 
    slot: number,
    t: (key: string) => string
  ) => {
    const processingKey = `${user.email}-${slot}`;
    setProcessingItem(processingKey);

    try {
      const slotData = user.reservationSlots.find(s => s.slotNumber === slot);
      
      if (!slotData || !slotData.document) {
        throw new Error(`Aucune réservation trouvée pour le slot ${slot}`);
      }

      await reservationService.validateReservationForProcessedUser(user, slot);
      
      const documentName = slotData.document.name;
      showNotification('success', `${t('document')} "${documentName}" ${t('borrowed_successfully')}`);
      
      // Recharger les données
      await loadReservations();
      
    } catch (error) {
      console.error('Erreur lors de la validation:', error);
      showNotification('error', t('validation_error'));
    } finally {
      setProcessingItem(null);
    }
  }, [loadReservations, showNotification]);

  // Charger les données au montage
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  return {
    reservations,
    loading,
    processingItem,
    notification,
    maxLoans,
    validateReservation,
    loadReservations,
    showNotification
  };
};