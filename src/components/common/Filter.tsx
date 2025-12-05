// components/common/Filters.tsx
import React from 'react';
import { FiSearch } from 'react-icons/fi';
import useI18n from '../../hooks/useI18n';

export type SortOption<T extends string = string> = {
  value: T;
  label: string;
};

export interface FiltersProps<T extends string = string> {
  searchPlaceholder?: string;
  sortOptions: SortOption<T>[];
  sortValue: T;
  onSortChange: (value: T) => void;
  onSearchChange: (query: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  searchDebounce?: number;
}

const Filters = <T extends string = string>({
  searchPlaceholder,
  sortOptions,
  sortValue,
  onSortChange,
  onSearchChange,
  className = '',
  size = 'md',
  searchDebounce = 300,
}: FiltersProps<T>) => {
  const { t } = useI18n();
  const [searchInput, setSearchInput] = React.useState('');
  const debounceTimer = React.useRef<NodeJS.Timeout | null>(null);

  // Styles basés sur la taille (comme dans votre Pagination)
  const sizeClasses = {
    sm: {
      input: 'px-2 py-1 text-xs h-8',
      icon: 14,
    },
    md: {
      input: 'px-3 py-2 text-sm h-10',
      icon: 16,
    },
    lg: {
      input: 'px-4 py-3 text-base h-12',
      icon: 18,
    },
  };

  const currentSize = sizeClasses[size];

  React.useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, searchDebounce);
  };

  return (
    <div className={`flex flex-wrap items-center gap-4 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-grow max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiSearch size={currentSize.icon} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder={searchPlaceholder || t('common:filters.search_placeholder')}
          className={`block w-full pl-10 pr-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${currentSize.input}`}
        />
      </div>

      {/* Sort Select */}
      <div className="flex-shrink-0">
        <select
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value as T)}
          className={`border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${currentSize.input}`}
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;