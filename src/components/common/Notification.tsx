// components/common/Notification.tsx
import React, { useEffect } from 'react';
import { FaCheckCircle, FaTimes, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
import type { NotificationProps } from '../../types';

const Notification: React.FC<NotificationProps> = ({
  visible,
  type,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 3000,
  position = 'top-right'
}) => {
  useEffect(() => {
    if (visible && autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [visible, autoClose, autoCloseDelay, onClose]);

  if (!visible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-600" size={20} />;
      case 'error':
        return <FaTimes className="text-red-600" size={20} />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-600" size={20} />;
      case 'info':
        return <FaInfoCircle className="text-blue-600" size={20} />;
      default:
        return <FaInfoCircle className="text-gray-600" size={20} />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  return (
    <div
      className={`
        fixed ${getPositionClasses()} z-50 max-w-sm w-full mx-auto
        animate-in slide-in-from-top-2 fade-in duration-300
      `}
    >
      <div className={`
        flex items-start p-4 border rounded-lg shadow-lg backdrop-blur-sm
        ${getColors()}
      `}>
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 p-1 rounded-md hover:bg-white hover:bg-opacity-20 transition-colors"
            aria-label="Fermer la notification"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Notification;