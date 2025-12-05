// components/common/FormattedDate.tsx
import { useI18n } from '../../hooks/useI18n';
import { Timestamp } from 'firebase/firestore';

interface FormattedDateProps {
  date: string | Date | Timestamp | { seconds: number; nanoseconds: number };
  format?: 'date' | 'datetime' | 'time';
  className?: string;
}

export const FormattedDate = ({ 
  date, 
  format = 'date',
  className = ''
}: FormattedDateProps) => {
  const { t } = useI18n();
  
  if (!date) return null;

  // Conversion en Date JavaScript
  const convertToDate = () => {
    if (date instanceof Timestamp) return date.toDate();
    if (typeof date === 'object' && 'seconds' in date) {
      return new Timestamp(date.seconds, date.nanoseconds).toDate();
    }
    return typeof date === 'string' ? new Date(date) : date;
  };

  const dateObj = convertToDate();

  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date);
    return <span className={className}>Invalid date</span>;
  }

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...(format === 'datetime' && {
      hour: '2-digit',
      minute: '2-digit'
    }),
    ...(format === 'time' && {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  return (
    <span className={className}>
      {dateObj.toLocaleDateString(t('common:locale') || 'fr-FR', options)}
    </span>
  );
};