// components/dashboard/ChartCard.tsx
import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  children, 
  className = '',
  height = 300 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        {title}
      </h3>
      <div style={{ height: `${height}px` }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;