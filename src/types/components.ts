// types/components.ts

// Types pour la pagination
export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage?: (page: number) => void;
  className?: string;
  showPageInfo?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Types pour les notifications
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationProps {
  visible: boolean;
  type: NotificationType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center';
}

// Types pour le loading spinner
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'white' | 'gray';
  text?: string;
  className?: string;
}

// Types pour l'état vide
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

// Types pour les composants de prêts
export interface LoanCardProps {
  user: import('./loans').ProcessedUserLoan;
  processingItem: string | null;
  onReturnDocument: (user: import('./loans').ProcessedUserLoan, slot: number) => void;
}

// Types pour les composants de réservations
export interface ReservationCardProps {
  user: import('./reservations').ProcessedUserReservation;
  processingItem: string | null;
  onValidateReservation: (user: import('./reservations').ProcessedUserReservation, slot: number) => void;
}

export interface ReservationItemProps {
  reservation: import('./reservations').ReservationSlot;
  userEmail: string;
  isProcessing: boolean;
  onValidate: () => void;
}

export interface DocumentLoanItemProps {
  document: import('./loans').DocumentLoan;
  isProcessing: boolean;
  onReturn: () => void;
}
// Types pour les composants du dashboard
export interface StatCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  description?: string;
  icon: string;
  color?: string;
  className?: string;
}

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  height?: number;
}

export interface BookListProps {
  title: string;
  books: Array<{
    name: string;
    count?: number;
    date?: string;
    info?: string;
  }>;
  icon?: string;
  className?: string;
  emptyMessage?: string;
}

export interface DocumentLoanItemProps {
  document: import('./loans').DocumentLoan;
  isProcessing: boolean;
  onReturn: () => void;
}