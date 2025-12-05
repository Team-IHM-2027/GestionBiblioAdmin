// components/common/EmptyState.tsx
import React from 'react';
import type { EmptyStateProps } from '../../types';

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      icon: 'text-4xl mb-3',
      title: 'text-lg',
      description: 'text-sm',
      button: 'px-3 py-2 text-sm'
    },
    md: {
      container: 'py-12',
      icon: 'text-5xl mb-4',
      title: 'text-xl',
      description: 'text-base',
      button: 'px-4 py-2 text-sm'
    },
    lg: {
      container: 'py-16',
      icon: 'text-6xl mb-6',
      title: 'text-2xl',
      description: 'text-lg',
      button: 'px-6 py-3 text-base'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`
      flex flex-col items-center justify-center text-center ${currentSize.container} ${className}
    `}>
      {/* Icon */}
      {icon && (
        <div className={`text-gray-300 ${currentSize.icon}`}>
          {icon}
        </div>
      )}

      {/* Title */}
      <h3 className={`font-semibold text-gray-700 mb-2 ${currentSize.title}`}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className={`text-gray-500 max-w-md mx-auto mb-6 ${currentSize.description}`}>
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className={`
            ${currentSize.button} font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
            ${action.variant === 'secondary'
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500'
              : 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500'
            }
          `}
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;