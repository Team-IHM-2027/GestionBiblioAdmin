// components/common/LoadingSpinner.tsx
import React from 'react';
import type { LoadingSpinnerProps } from '../../types';

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    white: 'text-white',
    gray: 'text-gray-500'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative">
        {/* Spinning circle */}
        <div
          className={`
            ${sizeClasses[size]} ${colorClasses[color]}
            animate-spin rounded-full border-2 border-current border-t-transparent
          `}
        />
        
        {/* Optional inner dot for more visual appeal */}
        <div
          className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            ${size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4'}
            ${colorClasses[color]} rounded-full animate-pulse
          `}
        />
      </div>
      
      {text && (
        <p className={`mt-3 ${textSizeClasses[size]} ${colorClasses[color]} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Variante avec des points qui rebondissent (alternative)
export const BouncingDotsSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className = ''
}) => {
  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4'
  };

  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    white: 'bg-white',
    gray: 'bg-gray-500'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`
              ${dotSizeClasses[size]} ${colorClasses[color]}
              rounded-full animate-bounce
            `}
            style={{
              animationDelay: `${index * 0.1}s`,
              animationDuration: '0.6s'
            }}
          />
        ))}
      </div>
      
      {text && (
        <p className={`mt-3 ${textSizeClasses[size]} text-gray-600 font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Variante avec effet de vague (pour les tableaux/listes)
export const SkeletonLoader: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className = ''
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="flex space-x-4 mb-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;