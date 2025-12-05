// components/dashboard/StatCard.tsx
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  percentage?: number;
  description?: string;
  icon: keyof typeof LucideIcons;
  color?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  percentage,
  description,
  icon,
  color = 'primary',
  className = ''
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Récupérer l'icône dynamiquement
  const IconComponent = LucideIcons[icon] as React.ComponentType<any>;

  const getColorClasses = (colorName: string) => {
    const colorMap = {
      primary: 'bg-primary-100 text-primary-600',
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      yellow: 'bg-yellow-100 text-yellow-600',
      red: 'bg-red-100 text-red-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colorMap[colorName as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div 
      className={`
        relative bg-white rounded-lg p-4 shadow-sm border border-gray-200 
        transition-all duration-200 hover:shadow-md hover:scale-105 cursor-pointer
        ${className}
      `}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Card Header */}
      <div className="flex items-center space-x-3">
        {/* Icon Container */}
        <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
          {IconComponent && <IconComponent size={24} />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">
            {title}
          </p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-2xl font-bold text-gray-900">
              {value}
            </span>
            {percentage !== undefined && (
              <span className="text-sm font-medium text-green-600">
                {percentage.toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && description && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 max-w-xs whitespace-normal shadow-lg">
            {description}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;