// src/utils/imageUtils.ts

/**
 * Utilitaires pour la gestion des images
 */

export interface ImageValidation {
  isValid: boolean;
  error?: string;
}

/**
 * Valide un fichier image
 */
export const validateImage = (file: File): ImageValidation => {
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'Format non supporté. Utilisez JPG, PNG ou WebP.'
    };
  }

  if (file.size > MAX_SIZE) {
    return {
      isValid: false,
      error: 'L\'image est trop volumineuse. Maximum 5MB.'
    };
  }

  return { isValid: true };
};

/**
 * Compresse une image
 */
export const compressImage = (file: File, maxWidth: number = 800, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculer les nouvelles dimensions
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      // Dessiner l'image redimensionnée
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convertir en blob puis en file
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback vers le fichier original
          }
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};

/**
 * Crée une URL de prévisualisation pour un fichier
 */
export const createPreviewUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Nettoie une URL de prévisualisation
 */
export const cleanupPreviewUrl = (url: string): void => {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

/**
 * Formate la taille d'un fichier en format lisible
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Obtient les dimensions d'une image
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};