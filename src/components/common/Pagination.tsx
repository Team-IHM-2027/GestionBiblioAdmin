// components/common/Pagination.tsx
import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import type { PaginationProps } from '../../types';
import useI18n from '../../hooks/useI18n';

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  onGoToPage,
  className = '',
  showPageInfo = true,
  size = 'md'
}) => {
  const { t } = useI18n();

  // Styles basés sur la taille
  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-xs',
      icon: 10,
      spacing: 'space-x-1'
    },
    md: {
      button: 'px-3 py-2 text-sm',
      icon: 12,
      spacing: 'space-x-2'
    },
    lg: {
      button: 'px-4 py-3 text-base',
      icon: 14,
      spacing: 'space-x-3'
    }
  };

  const currentSize = sizeClasses[size];

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = size === 'sm' ? 3 : 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Toujours afficher la première page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Pages autour de la page courante
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Toujours afficher la dernière page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center ${currentSize.spacing} ${className}`}>
      {/* Previous Button */}
      <button
        onClick={onPrevPage}
        disabled={!hasPrevPage}
        className={`
          flex items-center space-x-2 ${currentSize.button} rounded-md font-medium border transition-colors
          ${hasPrevPage
            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500'
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }
        `}
        title={t('components:pagination.previous')}
      >
        <FaArrowLeft size={currentSize.icon} />
        <span className="hidden sm:inline">{t('common:pagination.previous')}</span>
      </button>

      {/* Page Numbers */}
      <div className={`flex items-center ${size === 'sm' ? 'space-x-1' : 'space-x-1'}`}>
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className={`${currentSize.button} text-gray-400`}>...</span>
            ) : (
              <button
                onClick={() => onGoToPage && onGoToPage(page as number)}
                className={`
                  ${currentSize.button} font-medium rounded-md transition-colors
                  ${currentPage === page
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500'
                  }
                `}
                title={`${t('common:pagination.go_to_page')} ${page}`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Next Button */}
      <button
        onClick={onNextPage}
        disabled={!hasNextPage}
        className={`
          flex items-center space-x-2 ${currentSize.button} rounded-md font-medium border transition-colors
          ${hasNextPage
            ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500'
            : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
          }
        `}
        title={t('common:pagination.next')}
      >
        <span className="hidden sm:inline">{t('common:pagination.next')}</span>
        <FaArrowRight size={currentSize.icon} />
      </button>

      {/* Page Info */}
      {showPageInfo && (
        <div className={`hidden md:flex items-center text-gray-600 ml-4 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'}`}>
          <span>
            {t('common:pagination.page')} {currentPage} {t('common:pagination.of')} {totalPages}
          </span>
        </div>
      )}
    </div>
  );
};

export default Pagination;