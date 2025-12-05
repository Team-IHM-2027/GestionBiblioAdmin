// components/loans/LoanCard.tsx
import React from 'react';
import { FaUser, FaBook } from 'react-icons/fa';
import type { LoanCardProps } from '../../types';
import DocumentLoanItem from './DocumentLoanItem';
import useI18n from '../../hooks/useI18n';

const LoanCard: React.FC<LoanCardProps> = ({ user, processingItem, onReturnDocument }) => {
  const { t } = useI18n();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* User Info Section */}
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          {/* Avatar */}
          <div className="relative">
            {user.imageUri ? (
              <img
                src={user.imageUri}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <FaUser className="text-primary-600 text-xl" />
              </div>
            )}
            {/* Online indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          {/* User Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {user.name}
            </h3>
            <div className="flex flex-wrap gap-4 mt-1 text-sm text-gray-600">
              <span className="truncate">
                <span className="font-medium">{t('components:loans.email')}:</span> {user.email}
              </span>
              <span>
                <span className="font-medium">{t('components:loans.level')}:</span> {user.niveau || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            {t('components:loans.borrowed_documents')}
          </h4>
          <div className="flex items-center text-primary-600">
            <FaBook className="mr-1" size={14} />
            <span className="text-sm font-medium">
              {user.totalActiveLoans}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {user.activeSlots.map((slot) => (
            <DocumentLoanItem
              key={slot.slotNumber}
              document={slot.document!}
              isProcessing={processingItem === `${user.email}-${slot.slotNumber}`}
              onReturn={() => onReturnDocument(user, slot.slotNumber)}
            />
          ))}
        </div>

        {/* Message si aucun emprunt actif */}
        {user.activeSlots.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            <FaBook className="mx-auto text-2xl mb-2 opacity-50" />
            <p className="text-sm">{t('components:loans.no_active_loans')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanCard;
