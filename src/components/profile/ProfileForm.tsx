import React, { useState, useEffect } from 'react';
import { Edit, Save, X, User, Mail, Phone, Building, FileText } from 'lucide-react';
import type { UserProfile, ProfileFormData } from '../../types/profile';

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
  const [formData, setFormData] = useState<ProfileFormData>({
    name: profile.name ?? '',
    email: profile.email ?? '',
    gender: profile.gender ?? '',
    phone: profile.phone ?? '',
    department: profile.department ?? '',
    bio: profile.bio ?? ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<ProfileFormData>>({});

  useEffect(() => {
    setFormData({
      name: profile.name ?? '',
      email: profile.email ?? '',
      gender: profile.gender ?? '',
      phone: profile.phone ?? '',
      department: profile.department ?? '',
      bio: profile.bio ?? ''
    });
  }, [profile]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const newErrors: Partial<ProfileFormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis.';
    if (!formData.email.trim()) newErrors.email = 'L’email est requis.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'L’email est invalide.';
    if (formData.phone && formData.phone.length < 8) newErrors.phone = 'Le numéro est invalide.';
    if (formData.bio && formData.bio.length > 500) newErrors.bio = 'La biographie ne peut dépasser 500 caractères.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onToggleEdit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name ?? '',
      email: profile.email ?? '',
      gender: profile.gender ?? '',
      phone: profile.phone ?? '',
      department: profile.department ?? '',
      bio: profile.bio ?? ''
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
    options = null,
    error = ''
  }: {
    icon: React.ElementType;
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    options?: { value: string; label: string }[] | null;
    error?: string;
  }) => (
    <div className="space-y-2">
      <label className="flex items-center text-sm font-medium text-gray-700">
        <Icon className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>

      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          className={`w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${!isEditing ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
        >
          <option value="">Sélectionner</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          rows={3}
          maxLength={500}
          className={`w-full px-3 py-2 border rounded-md shadow-sm resize-none
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${!isEditing ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          placeholder={isEditing ? 'Écrivez une courte biographie...' : ''}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={!isEditing}
          className={`w-full px-3 py-2 border rounded-md shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500
            ${!isEditing ? 'bg-gray-50 text-gray-500 border-gray-200' : 'bg-white border-gray-300'}
            ${error ? 'border-red-500 ring-1 ring-red-500' : ''}`}
          placeholder={isEditing ? `Entrez ${label.toLowerCase()}` : ''}
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {type === 'textarea' && isEditing && (
        <p className="text-xs text-gray-500 text-right">{value.length}/500 caractères</p>
      )}
    </div>
  );

  const genderOptions = [
    { value: 'Male', label: 'Masculin' },
    { value: 'Female', label: 'Féminin' }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
        {!isEditing ? (
          <button onClick={onToggleEdit} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md">
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
        ) : (
          <button type="button" onClick={handleCancel} className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-md">
            <X className="w-4 h-4" />
            <span>Annuler</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField icon={User} label="Nom complet" value={formData.name} onChange={(v) => handleInputChange('name', v)} error={errors.name ?? ''} />
          <FormField icon={Mail} label="Email" value={formData.email} onChange={(v) => handleInputChange('email', v)} type="email" error={errors.email ?? ''} />
          <FormField icon={Phone} label="Téléphone" value={formData.phone ?? ''} onChange={(v) => handleInputChange('phone', v)} error={errors.phone ?? ''} />
          <FormField icon={User} label="Genre" value={formData.gender ?? ''} onChange={(v) => handleInputChange('gender', v)} options={genderOptions} />
          <FormField icon={Building} label="Département" value={formData.department ?? ''} onChange={(v) => handleInputChange('department', v)} />
          <FormField icon={FileText} label="Biographie" value={formData.bio ?? ''} onChange={(v) => handleInputChange('bio', v)} type="textarea" error={errors.bio ?? ''} />
        </div>

        {isEditing && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Enregistrement...' : 'Enregistrer'}</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProfileForm;
