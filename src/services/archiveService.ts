import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { ArchiveItem, ArchivesData, ArchiveStats } from '../types/archives';

export class ArchiveService {
  private archiveCollection = collection(db, 'ArchivesBiblio');

  private ensureStringDate(date: Timestamp | string | null): string | null {
    if (!date) return null;
    return date instanceof Timestamp ? date.toDate().toISOString() : date;
  }

  async getArchives(): Promise<ArchiveItem[]> {
    const snapshot = await getDocs(this.archiveCollection);
    const items: ArchiveItem[] = [];
    
    snapshot.forEach((doc) => {
      const data = doc.data() as ArchivesData;
      data.tableauArchives.forEach(item => {
        items.push({
          nomEtudiant: item.nomEtudiant,
          nomDoc: item.nomDoc,
          heure: this.ensureStringDate(item.heure) || new Date().toISOString(), // Fallback si null
          id: doc.id
        });
      });
    });

    return items;
  }

  async getArchiveStatistics(): Promise<ArchiveStats> {
    const archives = await this.getArchives();
    const sorted = [...archives].sort((a, b) => 
      new Date(b.heure).getTime() - new Date(a.heure).getTime()
    );

    return {
      totalArchives: archives.length,
      lastArchiveDate: this.ensureStringDate(sorted[0]?.heure || null)
    };
  }
}

export const archiveService = new ArchiveService();