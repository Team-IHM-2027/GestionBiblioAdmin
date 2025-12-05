// components/dashboard/BookList.tsx
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface BookListItem {
  name: string;
  count?: number;
  date?: string;
  info?: string;
}

interface BookListProps {
  title: string;
  books: BookListItem[];
  icon?: keyof typeof LucideIcons;
  className?: string;
  emptyMessage?: string;
}

const BookList: React.FC<BookListProps> = ({
  title,
  books,
  icon,
  className = '',
  emptyMessage = 'Aucune donnée disponible'
}) => {
  const IconComponent = icon ? LucideIcons[icon] as React.ComponentType<any> : null;

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-2 mb-4">
        {IconComponent && (
          <IconComponent size={20} className="text-primary-600" />
        )}
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1">
        {books.length > 0 ? (
          <div className="space-y-3">
            {books.map((book, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {book.name}
                  </p>
                </div>
                <div className="text-sm text-gray-600 ml-2">
                  {book.count !== undefined ? book.count : (book.date || book.info)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <p className="text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookList;