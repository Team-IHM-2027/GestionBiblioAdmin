// components/profile/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Save, X, User, Mail, Phone, Building, FileText } from 'lucide-react';
import type { UserProfile, ProfileFormData } from '../../types/profile';
import useI18n from '../../hooks/useI18n';

interface ProfileFormProps {
  profile: UserProfile;
  isEditing: boolean;
  onToggleEdit: () => void;
  onSave: (data: ProfileFormData) => Promise<void>;
  className?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  isEditing,
  onToggleEdit,
  onSave,
  className = ''
}) => {
  const { t } = useI18n();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name || '',
    email: profile.email || '',
    gender: profile.gender || '',
    phone: profile.phone || '',
    department: profile.department || '',
    bio: profile.bio || ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  // Mettre à jour le formulaire quand le profil change
  useEffect(() => {
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      gender: profile.gender || '',
      phone: profile.phone || '',
      department: profile.department || '',
      bio: profile.bio || ''
    });
  }, [profile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ProfileFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('components:profile.name_required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('components:profile.email_required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('components:profile.email_invalid');
    }

    if (formData.phone && formData.phone.length < 8) {
      newErrors.phone = t('components:profile.phone_invalid');
    }

    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = t('components:profile.bio_too_long');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      gender: profile.gender || '',
      phone: profile.phone || '',
      department: profile.department || '',
      bio: profile.bio || ''
    });
    setErrors({});
    onToggleEdit();
  };

  const FormField = ({ 
    icon: Icon, 
    label, 
    value, 
    onChange, 
    type = 'text',
    required = false,
    options = null,
    error = ''
  }: {
    icon: any;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    required?: boolean;
    options?: { value: string; label: string }[] | null;
    error?: string;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${!isEditing ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          `}
        >
          <option value="">{t('components:profile.select_option')}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          rows={3}
          maxLength={500}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            resize-none
            ${!isEditing ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          `}
          placeholder={!isEditing ? '' : t('components:profile.bio_placeholder')}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${!isEditing ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}
          `}
          placeholder={!isEditing ? '' : `${t('components:profile.enter')} ${label.toLowerCase()}`}
        />
      )}
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {type === 'textarea' && isEditing && (
        <p className="text-xs text-gray-500 text-right">
          {value.length}/500 {t('components:profile.characters')}
        </p>
      )}
    </div>
  );

  const genderOptions = [
    { value: 'Male', label: t('components:profile.male') },
    { value: 'Female', label: t('components:profile.female') }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {t('components:profile.personal_information')}
        </h3>
        
        {!isEditing ? (
          <button
            onClick={onToggleEdit}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors duration-200"
          >
            <Edit className="w-4 h-4" />
            <span>{t('components:profile.edit')}</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              <span>{t('components:profile.cancel')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            icon={User}
            label={t('components:profile.name')}
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            required
            error={errors.name || ''}
          />

          {/* Email */}
          <FormField
            icon={Mail}
            label={t('components:profile.email')}
            value={formData.email}
            onChange={(value) => handleInputChange('email', value)}
            type="email"
            required
            error={errors.email || ''}
          />

          {/* Phone */}
          <FormField
            icon={Phone}
            label={t('components:profile.phone')}
            value={formData.phone || ''}
            onChange={(value) => handleInputChange('phone', value)}
            type="tel"
            error={errors.phone || ''}
          />

          {/* Gender */}
          <FormField
            icon={User}
            label={t('components:profile.gender')}
            value={formData.gender}
            onChange={(value) => handleInputChange('gender', value)}
            options={genderOptions}
          />

          {/* Department - Full width */}
          <div className="md:col-span-2">
            <FormField
              icon={Building}
              label={t('components:profile.department')}
              value={formData.department || ''}
              onChange={(value) => handleInputChange('department', value)}
            />
          </div>

          {/* Bio - Full width */}
          <div className="md:col-span-2">
            <FormField
              icon={FileText}
              label={t('components:profile.bio')}
              value={formData.bio || ''}
              onChange={(value) => handleInputChange('bio', value)}
              type="textarea"
              error={errors.bio || ''}
            />
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>
                {isSubmitting 
                  ? t('components:profile.saving') 
                  : t('components:profile.save_changes')
                }
              </span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;