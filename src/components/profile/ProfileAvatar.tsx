import React, { useRef, useState } from 'react';

interface ProfileAvatarProps {
  imageUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  isUploading?: boolean;
  onImageChange?: (file: File) => void;
}

const sizeMap = {
  sm: 'w-20 h-20',
  md: 'w-28 h-28',
  lg: 'w-36 h-36'
};

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  imageUrl,
  size = 'md',
  editable = false,
  isUploading = false,
  onImageChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Format de fichier non supporté.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La taille du fichier dépasse 5 Mo.');
      return;
    }

    setError(null);
    onImageChange?.(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`relative rounded-full overflow-hidden bg-gray-100 border ${sizeMap[size]} flex items-center justify-center`}
        onDrop={editable ? handleDrop : undefined}
        onDragOver={editable ? e => e.preventDefault() : undefined}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Avatar de l'utilisateur"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">
            Ajouter une photo
          </span>
        )}

        {editable && !isUploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-sm"
          >
            Modifier
          </button>
        )}

        {isUploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm">
            Téléversement en cours...
          </div>
        )}
      </div>

      {editable && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleInputChange}
          />

          <p className="text-xs text-gray-500 text-center">
            Formats supportés : JPG, PNG, GIF (max 5Mo)
          </p>
        </>
      )}

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default ProfileAvatar;
