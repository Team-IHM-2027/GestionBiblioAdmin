import { Timestamp } from 'firebase/firestore';

export interface ArchiveItem {
  nomEtudiant: string;
  nomDoc: string;
  heure: string; // Toujours en string ISO
  id?: string;
}

export interface ArchivesData {
  tableauArchives: Array<{
    nomEtudiant: string;
    nomDoc: string;
    heure: Timestamp | string;
  }>;
}

export interface ArchiveStats {
  totalArchives: number;
  lastArchiveDate: string | null;
}

export interface ArchiveTableProps {
  items: ArchiveItem[];
  translations: {
    client_info: string;
    document_name: string;
    return_date: string;
    status: string;
    returned: string;
    no_data_title: string;
    no_data_message: string;
    refresh?: string;
  };
  currentPage: number;
  itemsPerPage: number;
  className?: string;
  onRefresh?: () => void;
}

export interface ArchiveTableHeaderProps {
  translations: {
    client_info: string;
    document_name: string;
    return_date: string;
    status: string;
  };
}

export interface ArchiveTableRowProps {
  item: ArchiveItem;
  index: number;
  returnedText: string;
}