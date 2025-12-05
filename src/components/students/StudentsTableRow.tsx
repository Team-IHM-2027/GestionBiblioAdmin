// src/components/students/StudentTableRow.tsx
import React, { useState } from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';
import type { Student } from '../../types/students';
import useI18n from '../../hooks/useI18n';

interface StudentTableRowProps {
  student: Student;
  index: number;
  onStatusUpdate: (studentId: string, newStatus: 'ras' | 'bloc') => Promise<void>;
}

const StudentTableRow: React.FC<StudentTableRowProps> = ({
  student,
  index,
  onStatusUpdate
}) => {
  const { t } = useI18n();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState('');

  const handleStatusToggle = async () => {
    setIsUpdating(true);
    try {
      const newStatus = student.etat === 'bloc' ? 'ras' : 'bloc';
      await onStatusUpdate(student.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMouseEnter = (text: string) => {
    setTooltipText(text);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const getActionTooltip = () => {
    return student.etat === 'bloc' 
      ? t('components:students.unlock') 
      : t('components:students.lock');
  };

  return (
    <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
      {/* Photo de profil */}
      <td className="text-center py-3">
        <a href={student.image} target="_blank" rel="noopener noreferrer">
          {student.image ? (
            <img
              src={student.image}
              alt={`Profil de ${student.name}`}
              className="w-20 h-20 rounded-full object-cover mx-auto border-2 border-gray-200 hover:border-blue-400 transition-colors duration-200"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-lg font-medium mx-auto">
              {student.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </a>
      </td>

      {/* Informations */}
      <td className="py-3 px-4">
        <div className="flex flex-col justify-between">
          <h5 className="font-semibold text-gray-900 text-lg mb-2">{student.name}</h5>
          <div className="flex justify-between mt-4 mx-3">
            <span className="text-xs">
              <span className="font-medium">
                {t('components:students.student_id')}:
              </span>
              <p className="text-gray-500 text-xs mt-1">{student.matricule}</p>
            </span>
            <span className="text-xs">
              <span className="font-medium">
                {t('components:students.level')}:
              </span>
              <p className="text-gray-500 text-xs mt-1">{student.niveau}</p>
            </span>
          </div>
        </div>
      </td>

      {/* Téléphone */}
      <td className="text-center py-3 font-bold">
        {student.tel || t('components:students.no_phone')}
      </td>

      {/* Statut */}
      <td className="text-center py-3 font-bold">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          student.etat === 'bloc' 
            ? 'bg-red-100 text-red-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {student.etat === 'bloc' 
            ? t('components:students.blocked') 
            : t('components:students.active')
          }
        </span>
      </td>

      {/* Actions */}
      <td className="text-center py-3">
        <div className="flex justify-center">
          <button
            onClick={handleStatusToggle}
            disabled={isUpdating}
            onMouseEnter={() => handleMouseEnter(getActionTooltip())}
            onMouseLeave={handleMouseLeave}
            className={`p-2 rounded-lg transition-all duration-200 ${
              isUpdating 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:bg-gray-100 active:scale-95'
            }`}
            title={getActionTooltip()}
          >
            {isUpdating ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
            ) : student.etat === 'bloc' ? (
              <FaUnlock className="w-5 h-5 text-green-600 hover:text-green-700" />
            ) : (
              <FaLock className="w-5 h-5 text-red-600 hover:text-red-700" />
            )}
          </button>
        </div>

        {/* Tooltip */}
        {showTooltip && !isUpdating && (
          <div className="fixed bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full">
            {tooltipText}
          </div>
        )}
      </td>
    </tr>
  );
};

export default StudentTableRow;