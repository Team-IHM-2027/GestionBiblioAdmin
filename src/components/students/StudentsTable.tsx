// src/components/students/StudentsTable.tsx
import React from 'react';
import type { Student } from '../../types/students';
import StudentTableRow from './StudentsTableRow';
import useI18n from '../../hooks/useI18n';

interface StudentsTableProps {
  students: Student[];
  onStatusUpdate: (studentId: string, newStatus: 'ras' | 'bloc') => Promise<void>;
  loading?: boolean;
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  onStatusUpdate,
  loading = false
}) => {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">{t('components:students.loading')}</span>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-2">
          {t('components:students.no_students_found')}
        </div>
        <div className="text-gray-400 text-sm">
          {t('components:students.no_students_message')}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow ">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th 
              className="px-4 py-4 text-center font-bold text-lg border-b"
              style={{ 
                backgroundColor: "#E7DAC1FF", 
                color: "chocolate",
                width: "200px"
              }}
            >
              {t('components:students.profile_picture')}
            </th>
            <th 
              className="px-4 py-4 text-center font-bold text-lg border-b"
              style={{ 
                backgroundColor: "#E7DAC1FF", 
                color: "chocolate",
                width: "300px"
              }}
            >
              {t('components:students.information')}
            </th>
            <th 
              className="px-4 py-4 text-center font-bold text-lg border-b"
              style={{ 
                backgroundColor: "#E7DAC1FF", 
                color: "chocolate",
                width: "200px"
              }}
            >
              {t('components:students.phone')}
            </th>
            <th 
              className="px-4 py-4 text-center font-bold text-lg border-b"
              style={{ 
                backgroundColor: "#E7DAC1FF", 
                color: "chocolate",
                width: "150px"
              }}
            >
              {t('components:students.status')}
            </th>
            <th 
              className="px-4 py-4 text-center font-bold text-lg border-b"
              style={{ 
                backgroundColor: "#E7DAC1FF", 
                color: "chocolate",
                width: "150px"
              }}
            >
              {t('components:students.possible_action')}
            </th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <StudentTableRow
              key={student.id}
              student={student}
              index={index}
              onStatusUpdate={onStatusUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsTable;