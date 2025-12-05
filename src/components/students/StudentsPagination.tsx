// src/components/students/StudentsPagination.tsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { PaginationData } from '../../types/students';
import useI18n from '../../hooks/useI18n';

interface StudentsPaginationProps {
  pagination: PaginationData;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPrevPage: () => void;
}

const StudentsPagination: React.FC<StudentsPaginationProps> = ({
  pagination,
  onPageChange,
  onNextPage,
  onPrevPage
}) => {
  const { t } = useI18n();

  // Ne pas afficher la pagination s'il n'y a qu'une page
  if (pagination.totalPages <= 1) {
    return null;
  }

  const generatePageNumbers = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Afficher jusqu'à 5 numéros de page
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    // Ajuster si on est près de la fin
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      {/* Mobile: Boutons précédent/suivant uniquement */}
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={onPrevPage}
          disabled={!pagination.hasPrevPage}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            pagination.hasPrevPage
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
          }`}
        >
          <FaChevronLeft className="mr-1" />
          {t('components:students.previous')}
        </button>

        <button
          onClick={onNextPage}
          disabled={!pagination.hasNextPage}
          className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            pagination.hasNextPage
              ? 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
              : 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
          }`}
        >
          {t('components:students.next')}
          <FaChevronRight className="ml-1" />
        </button>
      </div>

      {/* Desktop: Pagination complète */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {/* Informations sur les résultats */}
        <div>
          <p className="text-sm text-gray-700">
            {t('components:students.showing')}{' '}
            <span className="font-medium">
              {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}
            </span>{' '}
            {t('components:students.to')}{' '}
            <span className="font-medium">
              {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}
            </span>{' '}
            {t('components:students.of')}{' '}
            <span className="font-medium">{pagination.totalItems}</span>{' '}
            {t('components:students.results')}
          </p>
        </div>

        {/* Navigation */}
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Bouton précédent */}
            <button
              onClick={onPrevPage}
              disabled={!pagination.hasPrevPage}
              className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium ${
                pagination.hasPrevPage
                  ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="sr-only">{t('components:students.previous')}</span>
              <FaChevronLeft className="h-4 w-4" />
            </button>

            {/* Numéros de page */}
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                onClick={() => onPageChange(pageNumber)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  pageNumber === pagination.currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {pageNumber}
              </button>
            ))}

            {/* Points de suspension si nécessaire */}
            {pagination.totalPages > 5 && pageNumbers[pageNumbers.length - 1] < pagination.totalPages && (
              <>
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
                <button
                  onClick={() => onPageChange(pagination.totalPages)}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  {pagination.totalPages}
                </button>
              </>
            )}

            {/* Bouton suivant */}
            <button
              onClick={onNextPage}
              disabled={!pagination.hasNextPage}
              className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium ${
                pagination.hasNextPage
                  ? 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  : 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
              }`}
            >
              <span className="sr-only">{t('components:students.next')}</span>
              <FaChevronRight className="h-4 w-4" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StudentsPagination;