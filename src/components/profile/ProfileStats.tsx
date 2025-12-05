// components/profile/ProfileStats.tsx
import React from 'react';
import { Calendar, Activity, FileText, Clock } from 'lucide-react';
import type { ProfileStats } from '../../types/profile';
import useI18n from '../../hooks/useI18n';

interface ProfileStatsProps {
  stats: ProfileStats;
  className?: string;
}

const ProfileStatsComponent: React.FC<ProfileStatsProps> = ({ stats, className = '' }) => {
  const { t } = useI18n();

  const formatDays = (days: number) => {
    if (days === 0) return t('components:profile.today');
    if (days === 1) return t('components:profile.yesterday');
    if (days < 7) return t('components:profile.days_ago', { count: days });
    if (days < 30) return t('components:profile.weeks_ago', { count: Math.floor(days / 7) });
    if (days < 365) return t('components:profile.months_ago', { count: Math.floor(days / 30) });
    return t('components:profile.years_ago', { count: Math.floor(days / 365) });
  };

  const statItems = [
    {
      icon: Calendar,
      label: t('components:profile.account_age'),
      value: formatDays(stats.accountAge),
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Clock,
      label: t('components:profile.last_login'),
      value: formatDays(stats.lastLoginDays),
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: FileText,
      label: t('components:profile.documents_managed'),
      value: stats.documentsManaged.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Activity,
      label: t('components:profile.total_sessions'),
      value: stats.totalLogins.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t('components:profile.account_statistics')}
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <div key={index} className="text-center">
            <div className={`inline-flex p-3 rounded-full ${item.bgColor} mb-3`}>
              <item.icon className={`w-6 h-6 ${item.color}`} />
            </div>
            <p className="text-sm font-medium text-gray-900">{item.value}</p>
            <p className="text-xs text-gray-500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileStatsComponent;