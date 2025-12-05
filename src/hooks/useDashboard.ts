// hooks/useDashboard.ts
import { useState, useEffect, useCallback } from 'react';
import { dashboardService } from '../services/dashboardService';
import type { DashboardStats } from '../types/dashboard';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    totalTheses: 0,
    booksByCathegorie: {},
    thesesByDepartment: {},
    totalStudents: 0,
    suspendedStudents: 0,
    totalReservations: 0,
    borrowedDocuments: 0,
    returnedDocuments: 0,
    monthlyBorrows: [],
    departmentBorrowStats: [],
    totalEmprunts: 0,
    empruntsByDepartment: {},
    totalBookExemplaires: 0,
    availableExemplaires: 0,
    reservedNotPickedUp: 0,
    topBorrowedBooks: [],
    lowStockBooks: [],
    currentWeekBorrows: [],
    recentlyReturnedBooks: [],
    reservationToBorrowRatio: 0
  });

  const [loading, setLoading] = useState(true);

  // Mettre à jour les statistiques partielles
  const updateStats = useCallback((newStats: Partial<DashboardStats>) => {
    setStats(prevStats => ({ ...prevStats, ...newStats }));
  }, []);

  // Charger les données asynchrones
  const loadAsyncData = useCallback(async () => {
    try {
      const [topBorrowedBooks, currentWeekBorrows, recentlyReturnedBooks] = await Promise.all([
        dashboardService.getTopBorrowedBooks(),
        dashboardService.getCurrentWeekBorrows(),
        dashboardService.getRecentlyReturnedBooks()
      ]);

      updateStats({
        topBorrowedBooks,
        currentWeekBorrows,
        recentlyReturnedBooks
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données asynchrones:', error);
    }
  }, [updateStats]);

  useEffect(() => {
    let unsubscribeMemories: (() => void) | undefined;
    let unsubscribeBooks: (() => void) | undefined;
    let unsubscribeUsers: (() => void) | undefined;
    let unsubscribeArchives: (() => void) | undefined;

    const initializeData = async () => {
      try {
        setLoading(true);

        // S'abonner aux changements en temps réel
        unsubscribeMemories = dashboardService.subscribeToMemoriesStats(updateStats);
        unsubscribeBooks = dashboardService.subscribeToBooksStats(updateStats);
        unsubscribeUsers = dashboardService.subscribeToUsersStats(updateStats);
        unsubscribeArchives = dashboardService.subscribeToMonthlyBorrows(updateStats);

        // Charger les données asynchrones
        await loadAsyncData();

        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de l\'initialisation du dashboard:', error);
        setLoading(false);
      }
    };

    initializeData();

    // Nettoyer les souscriptions
    return () => {
      if (unsubscribeMemories) unsubscribeMemories();
      if (unsubscribeBooks) unsubscribeBooks();
      if (unsubscribeUsers) unsubscribeUsers();
      if (unsubscribeArchives) unsubscribeArchives();
    };
  }, [updateStats, loadAsyncData]);

  // Calculer les métriques dérivées
  const physicallyPresentBooks = stats.totalBookExemplaires - stats.borrowedDocuments;

  const derivedStats = {
    ...stats,
    physicallyPresentBooks
  };

  return {
    stats: derivedStats,
    loading,
    refreshData: loadAsyncData
  };
};