// types/dashboard.ts
export interface DashboardStats {
  totalBooks: number;
  totalTheses: number;
  booksByCathegorie: Record<string, number>;
  thesesByDepartment: Record<string, number>;
  totalStudents: number;
  suspendedStudents: number;
  totalReservations: number;
  borrowedDocuments: number;
  returnedDocuments: number;
  monthlyBorrows: MonthlyBorrow[];
  departmentBorrowStats: DepartmentBorrowStat[];
  totalEmprunts: number;
  empruntsByDepartment: Record<string, number>;
  totalBookExemplaires: number;
  availableExemplaires: number;
  reservedNotPickedUp: number;
  topBorrowedBooks: TopBorrowedBook[];
  lowStockBooks: LowStockBook[];
  currentWeekBorrows: WeeklyBorrow[];
  recentlyReturnedBooks: RecentlyReturnedBook[];
  reservationToBorrowRatio: number;
}

export interface MonthlyBorrow {
  month: string;
  borrows: number;
}

export interface DepartmentBorrowStat {
  department: string;
  borrows: number;
}

export interface TopBorrowedBook {
  name: string;
  count: number;
}

export interface LowStockBook {
  name: string;
  available: number;
  total: number;
  percentage: string;
}

export interface WeeklyBorrow {
  day: string;
  borrows: number;
}

export interface RecentlyReturnedBook {
  titre: string;
  etudiant: string;
  date: string;
}

export interface StatCard {
  id: string;
  title: string;
  value: number | string;
  percentage?: number;
  description?: string;
  icon: string;
  color?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}