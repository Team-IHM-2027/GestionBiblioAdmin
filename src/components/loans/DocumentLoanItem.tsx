// components/loans/DocumentLoanItem.tsx
import React from 'react';
import { FaBook, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import type { DocumentLoanItemProps } from '../../types';
import useI18n from '../../hooks/useI18n';

const DocumentLoanItem: React.FC<DocumentLoanItemProps> = ({ document, isProcessing, onReturn }) => {
  const { t } = useI18n();

  const formatDate = (date: any) => {
    try {
      // Si c'est un Timestamp Firestore
      if (date && typeof date === 'object' && 'seconds' in date) {
        const jsDate = new Date(date.seconds * 1000);
        return jsDate.toLocaleString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Si c'est déjà un objet Date
      if (date instanceof Date) {
        return date.toLocaleString('fr-FR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      }
      
      // Si c'est une string
      if (typeof date === 'string') {
        return date.slice(0, 16).replace('T', ' ');
      }
      
      return 'Date invalide';
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date invalide';
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      {/* Document Info */}
      <div className="flex-1 flex items-center space-x-4 min-w-0">
        {/* Image */}
        <div className="flex-shrink-0">
          {document.imageUrl ? (
            <img
              src={document.imageUrl}
              alt={document.name}
              className="w-16 h-20 object-cover rounded border shadow-sm"
            />
          ) : (
            <div className="w-16 h-20 bg-gray-200 rounded border flex items-center justify-center">
              <FaBook className="text-gray-400 text-lg" />
            </div>
          )}
        </div>

        {/* Text Info */}
        <div className="flex-1 flex flex-wrap items-center gap-4 min-w-0 text-sm text-gray-700">
          <span className="text-gray-500">
            <FaCalendarAlt className="inline mr-1" size={12} />
            {t('components:loans.borrowed_on')}: {formatDate(document.borrowDate)}
          </span>
          {document.collection && (
            <span className="text-gray-500">
              <span className="font-medium">{t('components:loans.collection')}:</span> {document.collection}
            </span>
          )}
        </div>
      </div>

      {/* Return Button */}
      <div className="ml-4 flex-shrink-0 w-32">
        <button
          onClick={onReturn}
          disabled={isProcessing}
          className={`
            flex items-center justify-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors
            ${isProcessing
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1'
            }
          `}
        >
          {isProcessing ? (
            <>
              <FaClock className="animate-spin" size={14} />
              <span>{t('components:loans.processing')}</span>
            </>
          ) : (
            <>
              <FaCheckCircle size={14} />
              <span>{t('components:loans.validate_return')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentLoanItem;