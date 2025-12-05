import React from 'react';
import { FaBook, FaCalendarAlt, FaCheckCircle, FaClock } from 'react-icons/fa';
import type { ReservationItemProps } from '../../types';
import useI18n from '../../hooks/useI18n';

const ReservationItem: React.FC<ReservationItemProps> = ({
  reservation,
  isProcessing,
  onValidate
}) => {
  const { t } = useI18n();

  // Vérifie l'URL de l'image dans la console
  console.log('Image URL du document :', reservation.document.imageUrl);

  // Fonction locale pour formater la date
  const formatDate = (dateString: string) => {
    try {
      return dateString.slice(0, 16).replace('T', ' ');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      {/* Document Info */}
      <div className="flex-1 flex items-center space-x-4 min-w-0">
        {/* Image */}
        <div className="flex-shrink-0">
          {reservation.document.imageUrl ? (
            <img
              src={reservation.document.imageUrl}
              alt={reservation.document.name}
              className="w-16 h-20 object-cover rounded border shadow-sm"
            />
          ) : (
            <div className="w-16 h-20 bg-gray-200 rounded border flex items-center justify-center">
              <FaBook className="text-gray-400 text-lg" />
            </div>
          )}
        </div>

        {/* Reserved Date & Collection */}
        <div className="flex-1 flex flex-col min-w-0 text-sm text-gray-700">
          <span className="text-gray-500 flex items-center">
            <FaCalendarAlt className="inline mr-1" size={12} />
            {t('components:reservations.reserved_on')}: {formatDate(reservation.document.reservationDate)}
          </span>
          {reservation.document.collection && (
            <span className="text-gray-500 mt-1">
              <span className="font-medium">{t('components:reservations.collection')}:</span> {reservation.document.collection}
            </span>
          )}
        </div>
      </div>

      {/* Validate Button */}
      <div className="ml-4 flex-shrink-0 w-32">
        <button
          onClick={onValidate}
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
              <span>{t('components:reservations.processing')}</span>
            </>
          ) : (
            <>
              <FaCheckCircle size={14} />
              <span>{t('components:reservations.validate_loan')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReservationItem;
