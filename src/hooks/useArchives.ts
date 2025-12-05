// hooks/useArchives.ts
import { useState, useEffect, useCallback } from 'react';
import { archiveService } from '../services/archiveService';
import type { ArchiveItem, ArchiveStats } from '../types/archives';
import type { NotificationState } from '../types';

export const useArchives = () => {
  const [archives, setArchives] = useState<ArchiveItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ArchiveStats>({
    totalArchives: 0,
    lastArchiveDate: null
  });
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    type: 'success',
    message: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Charger les archives et les statistiques
  const loadArchives = useCallback(async () => {
    try {
      setLoading(true);
      
      // Charger en parallèle les archives et les statistiques
      const [archiveData, statsData] = await Promise.all([
        archiveService.getArchives(),
        archiveService.getArchiveStatistics()
      ]);
      
      setArchives(archiveData);
      setStats(statsData);
    } catch (error) {
      showNotification('error', 'Failed to load archives');
      console.error('Error:', error);
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

  // Filtrer les archives selon la recherche
  const filteredArchives = useCallback(() => {
    if (!searchQuery) return archives;
    
    return archives.filter(item => {
  const query = searchQuery.toLowerCase();
  return (
    (item.nomDoc && item.nomDoc.toLowerCase().includes(query)) ||
    (item.heure && item.heure.toLowerCase().includes(query)) ||
    (item.nomEtudiant && item.nomEtudiant.toLowerCase().includes(query))
  );
});
  }, [archives, searchQuery]);

  // Trier les archives
  const sortArchives = useCallback((items: ArchiveItem[], sortOrder: 'recent' | 'old') => {
    return [...items].sort((a, b) => {
      const dateA = new Date(a.heure);
      const dateB = new Date(b.heure);
      return sortOrder === 'recent' 
        ? dateB.getTime() - dateA.getTime() 
        : dateA.getTime() - dateB.getTime();
    });
  }, []);

  // Paginer les archives
  const paginateArchives = useCallback(
    (items: ArchiveItem[], currentPage: number, itemsPerPage: number) => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      return items.slice(startIndex, startIndex + itemsPerPage);
    },
    []
  );

  // Charger les données au montage
  useEffect(() => {
    loadArchives();
  }, [loadArchives]);

  return {
    archives,
    filteredArchives,
    sortArchives,
    paginateArchives,
    loading,
    stats,
    notification,
    searchQuery,
    setSearchQuery,
    loadArchives,
    showNotification
  };
};