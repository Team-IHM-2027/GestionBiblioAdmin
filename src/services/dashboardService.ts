// services/dashboardService.ts
import { collection, doc, getDocs, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { DashboardStats, TopBorrowedBook, LowStockBook, WeeklyBorrow, RecentlyReturnedBook } from '../types/dashboard';

export class DashboardService {
  // private getInitialStats(): DashboardStats {
  //   return {
  //     totalBooks: 0,
  //     totalTheses: 0,
  //     booksByCathegorie: {},
  //     thesesByDepartment: {},
  //     totalStudents: 0,
  //     suspendedStudents: 0,
  //     totalReservations: 0,
  //     borrowedDocuments: 0,
  //     returnedDocuments: 0,
  //     monthlyBorrows: [],
  //     departmentBorrowStats: [],
  //     totalEmprunts: 0,
  //     empruntsByDepartment: {},
  //     totalBookExemplaires: 0,
  //     availableExemplaires: 0,
  //     reservedNotPickedUp: 0,
  //     topBorrowedBooks: [],
  //     lowStockBooks: [],
  //     currentWeekBorrows: [],
  //     recentlyReturnedBooks: [],
  //     reservationToBorrowRatio: 0
  //   };
  // }

  // Récupérer les statistiques des mémoires
  subscribeToMemoriesStats(callback: (stats: Partial<DashboardStats>) => void) {
    const ref = collection(db, 'BiblioThesis');
    return onSnapshot(ref, (querySnapshot) => {
      const thesesByDepartment: Record<string, number> = {};
      let totalTheses = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalTheses++;
        
        if (data.département) {
          thesesByDepartment[data.département] = (thesesByDepartment[data.département] || 0) + 1;
        }
      });

      callback({ totalTheses, thesesByDepartment });
    });
  }

  // Récupérer les statistiques des livres
  // Récupérer les statistiques des livres
subscribeToBooksStats(callback: (stats: Partial<DashboardStats>) => void) {
  const ref = collection(db, 'BiblioBooks');
  return onSnapshot(ref, (querySnapshot) => {
    const booksByCathegorie: Record<string, number> = {};
    let totalBooks = 0;
    let totalBookExemplaires = 0;
    let availableExemplaires = 0;
    const lowStockBooks: LowStockBook[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalBooks++;

      // Compter par catégorie
      if (data.cathegorie) {
        booksByCathegorie[data.cathegorie] = (booksByCathegorie[data.cathegorie] || 0) + 1;
      }

      // Calculer le total des exemplaires (inventaire)
      if (data.initialExemplaire && typeof data.initialExemplaire === 'number') {
        totalBookExemplaires += data.initialExemplaire;
      }

      // Calculer les exemplaires disponibles - CORRECTION ICI
      if (data.exemplaire && typeof data.exemplaire === 'number') {
        availableExemplaires += data.exemplaire;
      }

      // Vérifier si le stock est faible (moins de 20% disponible)
      if (data.initialExemplaire && data.exemplaire && 
          typeof data.initialExemplaire === 'number' && 
          typeof data.exemplaire === 'number') {
        const availablePercentage = (data.exemplaire / data.initialExemplaire) * 100;
        if (availablePercentage <= 20) {
          lowStockBooks.push({
            name: data.name || 'Sans titre',
            available: data.exemplaire,
            total: data.initialExemplaire,
            percentage: availablePercentage.toFixed(1) + '%'
          });
        }
      }
    });

    // Trier et limiter les livres à faible stock
    lowStockBooks.sort((a, b) => parseFloat(a.percentage) - parseFloat(b.percentage));
    const topLowStock = lowStockBooks.slice(0, 5);

    // S'assurer que ce sont bien des nombres
    callback({
      totalBooks: Number(totalBooks) || 0,
      booksByCathegorie,
      totalBookExemplaires: Number(totalBookExemplaires) || 0,
      availableExemplaires: Number(availableExemplaires) || 0,
      lowStockBooks: topLowStock
    });
  });
}
  // Récupérer les statistiques des utilisateurs
  subscribeToUsersStats(callback: (stats: Partial<DashboardStats>) => void) {
    const ref = collection(db, 'BiblioUser');
    return onSnapshot(ref, (querySnapshot) => {
      let totalStudents = 0;
      let suspendedStudents = 0;
      let totalReservations = 0;
      let borrowedDocuments = 0;
      let reservedNotPickedUp = 0;
      const empruntsByDepartment: Record<string, number> = {};
      let totalEmprunts = 0;

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        totalStudents++;

        // Vérifier les étudiants suspendus
        if (data.etat === 'bloc') {
          suspendedStudents++;
        }

        // Comptabiliser les réservations, emprunts
        const states = [data.etat1, data.etat2, data.etat3];

        // Compter les livres réservés mais non retirés
        states.forEach((state: string) => {
          if (state === 'reserv') {
            reservedNotPickedUp++;
            totalReservations++;
          }
        });

        // Compter les emprunts par utilisateur
        if (states.includes('emprunt')) {
          totalEmprunts++;

          // Ajouter aux statistiques par département
          if (data.niveau) {
            empruntsByDepartment[data.niveau] = (empruntsByDepartment[data.niveau] || 0) + 1;
          }
        }

        // Compter le nombre total de documents empruntés
        states.forEach((state: string) => {
          if (state === 'emprunt') {
            borrowedDocuments++;
          }
        });
      });

      // Calculer le ratio réservation vers emprunt
      const reservationToBorrowRatio = totalReservations > 0
        ? ((borrowedDocuments / (borrowedDocuments + totalReservations)) * 100)
        : 0;

      callback({
        totalStudents,
        suspendedStudents,
        totalReservations,
        borrowedDocuments,
        totalEmprunts,
        empruntsByDepartment,
        reservedNotPickedUp,
        reservationToBorrowRatio
      });
    });
  }

  // Récupérer les livres les plus empruntés
  async getTopBorrowedBooks(): Promise<TopBorrowedBook[]> {
    try {
      const borrowedBooksMap = new Map();
      const usersSnapshot = await getDocs(collection(db, 'BiblioUser'));

      usersSnapshot.forEach(doc => {
        const userData = doc.data();

        // Analyser les états d'emprunt (etat1, etat2, etat3)
        ['tabEtat1', 'tabEtat2', 'tabEtat3'].forEach(tabKey => {
          if (userData[tabKey] && userData[tabKey][0]) {
            const bookTitle = userData[tabKey][0];
            borrowedBooksMap.set(bookTitle, (borrowedBooksMap.get(bookTitle) || 0) + 1);
          }
        });
      });

      // Convertir la Map en tableau et trier
      return Array.from(borrowedBooksMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

    } catch (error) {
      console.error("Erreur lors de la récupération des livres les plus empruntés:", error);
      return [];
    }
  }

  // Récupérer les emprunts de la semaine courante
  async getCurrentWeekBorrows(): Promise<WeeklyBorrow[]> {
    try {
      const currentDate = new Date();
      const firstDayOfWeek = new Date(currentDate);
      const dayOfWeek = currentDate.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      firstDayOfWeek.setDate(currentDate.getDate() - diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);

      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
      lastDayOfWeek.setHours(23, 59, 59, 999);

      const daysOfWeek = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
      const weekBorrows = daysOfWeek.map(day => ({ day, borrows: 0 }));

      const archivesSnapshot = await getDoc(doc(db, 'ArchivesBiblio', 'Arch'));
      const archives = archivesSnapshot.data();

      if (archives && archives.tableauArchives) {
        archives.tableauArchives.forEach((entry: any) => {
          const entryDate = new Date(entry.heure);

          if (entryDate >= firstDayOfWeek && entryDate <= lastDayOfWeek) {
            const dayIndex = entryDate.getDay() === 0 ? 6 : entryDate.getDay() - 1;
            weekBorrows[dayIndex].borrows += 1;
          }
        });
      }

      return weekBorrows;
    } catch (error) {
      console.error("Erreur lors de la récupération des emprunts de la semaine:", error);
      return [];
    }
  }

  // Récupérer les livres récemment retournés
  async getRecentlyReturnedBooks(): Promise<RecentlyReturnedBook[]> {
    try {
      const archivesSnapshot = await getDoc(doc(db, 'ArchivesBiblio', 'Arch'));
      const archives = archivesSnapshot.data();

      if (archives && archives.tableauArchives) {
        return [...archives.tableauArchives]
          .sort((a, b) => new Date(b.heure).getTime() - new Date(a.heure).getTime())
          .slice(0, 5)
          .map(entry => ({
            titre: entry.nomDoc,
            etudiant: entry.nomEtudiant,
            date: new Date(entry.heure).toLocaleDateString()
          }));
      }

      return [];
    } catch (error) {
      console.error("Erreur lors de la récupération des livres récemment retournés:", error);
      return [];
    }
  }

  // Récupérer les emprunts mensuels
  subscribeToMonthlyBorrows(callback: (stats: Partial<DashboardStats>) => void) {
    const ref = doc(db, 'ArchivesBiblio', 'Arch');
    return onSnapshot(ref, (doc) => {
      const data = doc.data();
      const monthlyBorrows: any[] = [];
      const departmentBorrowStats: any[] = [];

      if (data && data.tableauArchives) {
        const oneYearAgo = new Date();
        oneYearAgo.setMonth(oneYearAgo.getMonth() - 12);

        const recentEntries = data.tableauArchives.filter((entry: any) =>
          new Date(entry.heure) >= oneYearAgo
        );

        const monthsData: Record<string, number> = {};

        recentEntries.forEach((entry: any) => {
          const date = new Date(entry.heure);
          const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;

          monthsData[monthYear] = (monthsData[monthYear] || 0) + 1;

          // Analyser le département
          let department = "Inconnu";
          if (entry.nomDoc) {
            const parts = entry.nomDoc.split(' - ');
            department = parts.length > 1 ? parts[1] : entry.nomDoc;
          }

          const existingDepartment = departmentBorrowStats.find(d => d.department === department);
          if (existingDepartment) {
            existingDepartment.borrows++;
          } else {
            departmentBorrowStats.push({ department, borrows: 1 });
          }
        });

        // Convertir en tableau pour le graphique
        for (const [monthYear, count] of Object.entries(monthsData)) {
          monthlyBorrows.push({ month: monthYear, borrows: count });
        }

        monthlyBorrows.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
      }

      callback({ monthlyBorrows, departmentBorrowStats });
    });
  }
}

// Instance singleton
export const dashboardService = new DashboardService();