import React from 'react';
import { Calendar, Clock, FileText, Activity } from 'lucide-react';
import type { ProfileStats } from '../../types/profile';

interface ProfileStatsProps {
  stats: ProfileStats;
  className?: string;
}

const ProfileStatsComponent: React.FC<ProfileStatsProps> = ({ stats, className = '' }) => {
  const statItems = [
    { icon: Calendar, label: 'Jours depuis l’inscription', value: stats.accountAge },
    { icon: Clock, label: 'Dernière connexion (jours)', value: stats.lastLoginDays },
    { icon: FileText, label: 'Documents gérés', value: stats.documentsManaged },
    { icon: Activity, label: 'Sessions totales', value: stats.totalLogins }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques du compte</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
        {statItems.map((item, index) => (
          <div key={index}>
            <div className="inline-flex p-3 rounded-full bg-gray-100 mb-3 items-center justify-center">
              <item.icon className="w-6 h-6 text-gray-700" />
            </div>
            <p className="text-2xl font-bold">{item.value}</p>
            <p className="text-sm text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStatsComponent;
