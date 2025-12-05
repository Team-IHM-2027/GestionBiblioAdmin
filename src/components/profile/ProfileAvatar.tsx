// components/profile/ProfileAvatar.tsx
import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import useI18n from '../../hooks/useI18n';

interface ProfileAvatarProps {
  imageUrl?: string;
  isUploading: boolean;
  onImageChange: (file: File) => void;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
}

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  isUploading,
  onImageChange,
  size = 'lg',
  editable = true
}) => {
  const { t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Avatar Container */}
      <div className={`relative ${sizeClasses[size]} group`}>
        {/* Avatar Image */}
        <div
          className={`
            ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-lg
            ${dragOver ? 'border-primary-500' : 'border-gray-200'}
            ${editable ? 'cursor-pointer' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={editable ? triggerFileInput : undefined}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Camera className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Upload Overlay */}
        {editable && (
          <div
            className={`
              absolute inset-0 bg-black bg-opacity-50 rounded-full 
              flex items-center justify-center opacity-0 group-hover:opacity-100 
              transition-opacity duration-200 cursor-pointer
              ${isUploading ? 'opacity-100' : ''}
            `}
            onClick={triggerFileInput}
          >
            <div className="text-white text-center">
              {isUploading ? (
                <div className="animate-spin">
                  <Upload className="w-6 h-6 mx-auto" />
                </div>
              ) : (
                <Camera className="w-6 h-6 mx-auto" />
              )}
              <p className="text-xs mt-1">
                {isUploading 
                  ? t('components:profile.uploading')
                  : t('components:profile.change_photo')
                }
              </p>
            </div>
          </div>
        )}

        {/* Drag & Drop Indicator */}
        {dragOver && editable && (
          <div className="absolute inset-0 border-2 border-dashed border-primary-500 rounded-full bg-primary-50 bg-opacity-75 flex items-center justify-center">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>
        )}
      </div>

      {/* Upload Instructions */}
      {editable && (
        <div className="text-center text-sm text-gray-500">
          <p>{t('components:profile.click_or_drag_image')}</p>
          <p className="text-xs mt-1">
            {t('components:profile.supported_formats')}
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default ProfileAvatar;