// components/dashboard/HelpBanner.tsx
import React from 'react';
import { Info } from 'lucide-react';
import useI18n from '../../hooks/useI18n';

interface HelpBannerProps {
  className?: string;
}

const HelpBanner: React.FC<HelpBannerProps> = ({ className = '' }) => {
  const { t } = useI18n();

  return (
    <div className={`
      flex items-center space-x-2 bg-yellow-50 border border-yellow-200 
      text-yellow-800 px-4 py-3 rounded-lg mb-6 shadow-sm
      ${className}
    `}>
      <Info size={16} className="text-yellow-600 flex-shrink-0" />
      <span className="text-sm font-medium">
        {t('components:dashboard.help_message')}
      </span>
    </div>
  );
};

export default HelpBanner;