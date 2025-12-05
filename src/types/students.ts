// src/types/students.ts

export interface Student {
  id: string;
  email: string;
  name: string;
  matricule: string;
  niveau: string;
  tel: string;
  image?: string;
  etat: 'ras' | 'bloc';
  heure: string; // Date d'inscription
  created_at?: Date;
  updated_at?: Date;
  department?: string;
  gender?: 'Male' | 'Female';
  address?: string;
  birthDate?: string;
}

export interface StudentsFilters {
  search: string;
  status: 'all' | 'ras' | 'bloc';
  level: string;
  department: string;
  sortBy: 'recent' | 'old' | 'name' | 'level';
}

export interface StudentsStats {
  total: number;
  active: number;
  blocked: number;
  byLevel: Record<string, number>;
  byDepartment: Record<string, number>;
  recentRegistrations: number;
}

export interface StudentUpdateRequest {
  studentId: string;
  field: keyof Student;
  value: any;
}

export interface StudentBulkAction {
  studentIds: string[];
  action: 'block' | 'unblock' | 'delete';
}

export interface StudentSearchFilters {
  query: string;
  status?: 'ras' | 'bloc';
  level?: string;
  department?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface StudentsTableState {
  data: Student[];
  filteredData: Student[];
  loading: boolean;
  error: string | null;
  filters: StudentsFilters;
  pagination: PaginationData;
  selectedStudents: string[];
  sortDirection: 'asc' | 'desc';
}

// Types pour les actions de gestion
export interface StudentAction {
  id: string;
  type: 'block' | 'unblock' | 'update' | 'delete';
  timestamp: Date;
  performedBy: string;
  details?: string;
}

export interface StudentExport {
  format: 'csv' | 'excel' | 'pdf';
  fields: (keyof Student)[];
  filters?: StudentsFilters;
}

// Types pour les notifications
export interface StudentNotification {
  id: string;
  studentId: string;
  type: 'account_blocked' | 'account_unblocked' | 'profile_updated';
  message: string;
  sent: boolean;
  sentAt?: Date;
}