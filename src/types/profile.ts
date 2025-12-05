// types/profile.ts
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  gender: 'Male' | 'Female' | '';
  image?: string;
  role?: 'admin' | 'user';
  created_at?: Date;
  updated_at?: Date;
  phone?: string;
  department?: string;
  bio?: string;
  lastLoginAt?: Date;
  isActive?: boolean;
}

export interface ProfileFormData {
  name: string;
  email: string;
  gender: 'Male' | 'Female' | '';
  phone?: string;
  department?: string;
  bio?: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ProfileStats {
  totalLogins: number;
  lastLoginDays: number;
  documentsManaged: number;
  accountAge: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: Date;
  details?: string;
  ipAddress?: string;
}