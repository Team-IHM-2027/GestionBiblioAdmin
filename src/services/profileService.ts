// services/profileService.ts
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import type { UserProfile, ProfileFormData, ProfileStats } from '../types/profile';

export class ProfileService {
  private adminCollection = 'BiblioAdmin';
  private userCollection = 'BiblioUser';

  // Configuration Cloudinary
  private cloudinaryConfig = {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
  };

  // Récupérer le profil utilisateur
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // D'abord chercher dans les admins
      const adminDoc = await getDoc(doc(db, this.adminCollection, userId));
      if (adminDoc.exists()) {
        return { id: adminDoc.id, ...adminDoc.data() } as UserProfile;
      }

      // Puis dans les utilisateurs
      const userDoc = await getDoc(doc(db, this.userCollection, userId));
      if (userDoc.exists()) {
        return { id: userDoc.id, ...userDoc.data() } as UserProfile;
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération du profil:', error);
      throw new Error('Impossible de récupérer le profil utilisateur');
    }
  }

  // Mettre à jour le profil
  async updateProfile(userId: string, data: ProfileFormData): Promise<void> {
    try {
      // Déterminer dans quelle collection chercher
      const adminDoc = await getDoc(doc(db, this.adminCollection, userId));
      const collection = adminDoc.exists() ? this.adminCollection : this.userCollection;

      const updateData = {
        ...data,
        updated_at: new Date()
      };

      await updateDoc(doc(db, collection, userId), updateData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du profil:', error);
      throw new Error('Impossible de mettre à jour le profil');
    }
  }

  // Upload d'image vers Cloudinary
  async uploadProfileImage(file: File, userId: string): Promise<string> {
    try {
      // Créer le FormData pour Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.cloudinaryConfig.uploadPreset);
      formData.append('folder', 'profiles'); // Organiser dans un dossier profiles
      formData.append('public_id', `profile_${userId}_${Date.now()}`); // ID unique

      // Upload vers Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.cloudinaryConfig.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Erreur lors de l\'upload vers Cloudinary');
      }

      const result = await response.json();
      return result.secure_url; // URL sécurisée de l'image
    } catch (error) {
      console.error('Erreur lors de l\'upload de l\'image:', error);
      throw new Error('Impossible de télécharger l\'image');
    }
  }

  // Supprimer l'ancienne image de Cloudinary
  async deleteProfileImage(imageUrl: string): Promise<void> {
    try {
      if (!imageUrl || !imageUrl.includes('cloudinary.com')) {
        return; // Pas une image Cloudinary
      }

      // Extraire le public_id de l'URL Cloudinary
      const urlParts = imageUrl.split('/');
      const fileWithExtension = urlParts[urlParts.length - 1];
      const publicId = fileWithExtension.split('.')[0];
      const folder = urlParts[urlParts.length - 2];
      const fullPublicId = folder ? `${folder}/${publicId}` : publicId;

      // Préparer la signature pour l'API de suppression (optionnel)
      // const timestamp = Math.round(new Date().getTime() / 1000);
      
      // Note: Pour la suppression via API, vous devriez utiliser votre backend
      // car l'API secret ne doit pas être exposée côté client
      // Pour l'instant, on log juste l'information
      console.log('Image à supprimer:', fullPublicId);
      
      // Alternative: Marquer l'image comme supprimée dans votre base de données
      // ou implémenter un endpoint backend pour la suppression
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
      // Ne pas faire échouer l'opération si la suppression échoue
    }
  }

  // Mettre à jour l'image de profil
  async updateProfileImage(userId: string, file: File, oldImageUrl?: string): Promise<string> {
    try {
      // Upload de la nouvelle image
      const newImageUrl = await this.uploadProfileImage(file, userId);

      // Mettre à jour le profil avec la nouvelle URL
      const adminDoc = await getDoc(doc(db, this.adminCollection, userId));
      const collection = adminDoc.exists() ? this.adminCollection : this.userCollection;

      await updateDoc(doc(db, collection, userId), {
        image: newImageUrl,
        updated_at: new Date()
      });

      // Supprimer l'ancienne image si elle existe
      if (oldImageUrl) {
        await this.deleteProfileImage(oldImageUrl);
      }

      return newImageUrl;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      throw new Error('Impossible de mettre à jour l\'image de profil');
    }
  }

  // Optimiser l'image via Cloudinary (transformation à la volée)
  getOptimizedImageUrl(originalUrl: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  } = {}): string {
    if (!originalUrl || !originalUrl.includes('cloudinary.com')) {
      return originalUrl;
    }

    const { width = 400, height = 400, quality = 80, format = 'auto' } = options;

    try {
      // Insérer les transformations dans l'URL Cloudinary
      const transformations = [
        `w_${width}`,
        `h_${height}`,
        `c_fill`, // crop and fill
        `f_${format}`,
        `q_${quality}`
      ].join(',');

      // Remplacer /upload/ par /upload/transformations/
      return originalUrl.replace('/upload/', `/upload/${transformations}/`);
    } catch (error) {
      console.error('Erreur lors de l\'optimisation de l\'image:', error);
      return originalUrl;
    }
  }

  // Récupérer les statistiques du profil
  async getProfileStats(userId: string): Promise<ProfileStats> {
    try {
      const profile = await this.getUserProfile(userId);
      if (!profile) {
        return { totalLogins: 0, lastLoginDays: 0, documentsManaged: 0, accountAge: 0 };
      }

      // Calculer l'âge du compte
      const accountAge = profile.created_at 
        ? Math.floor((new Date().getTime() - profile.created_at.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Calculer les jours depuis la dernière connexion
      const lastLoginDays = profile.lastLoginAt
        ? Math.floor((new Date().getTime() - profile.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      // Compter les documents gérés (exemple pour les admins)
      let documentsManaged = 0;
      if (profile.role === 'admin') {
        documentsManaged = await this.countManagedDocuments(userId);
      }

      return {
        totalLogins: 0, // À implémenter selon votre système de logs
        lastLoginDays,
        documentsManaged,
        accountAge
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return { totalLogins: 0, lastLoginDays: 0, documentsManaged: 0, accountAge: 0 };
    }
  }

  // Compter les documents gérés (à adapter selon vos besoins)
  private async countManagedDocuments(userId: string): Promise<number> {
    try {
      // Exemple : compter les livres dans BiblioInformatique
      const booksQuery = query(
        collection(db, 'BiblioInformatique'),
        where('addedBy', '==', userId) // Si vous trackez qui ajoute les livres
      );
      const booksSnapshot = await getDocs(booksQuery);
      return booksSnapshot.size;
    } catch (error) {
      console.error('Erreur lors du comptage des documents:', error);
      return 0;
    }
  }

  // Récupérer les logs d'activité récents
  // async getRecentActivity(userId: string, limit: number = 10): Promise<ActivityLog[]> {
  //   try {
  //     // À implémenter selon votre système de logs
  //     // Pour l'instant, retourner un tableau vide
  //     return [];
  //   } catch (error) {
  //     console.error('Erreur lors de la récupération de l\'activité:', error);
  //     return [];
  //   }
  // }
  //
  // // Valider le mot de passe (pour les changements)
  // async validateCurrentPassword(userId: string, password: string): Promise<boolean> {
  //   try {
  //     // Cette méthode dépend de votre système d'authentification
  //     // Firebase Auth ou votre propre système
  //     // Pour l'instant, retourner true
  //     return true;
  //   } catch (error) {
  //     console.error('Erreur lors de la validation du mot de passe:', error);
  //     return false;
  //   }
  // }
  //
  // // Changer le mot de passe
  // async changePassword(userId: string, newPassword: string): Promise<void> {
  //   try {
  //     // À implémenter selon votre système d'authentification
  //     // Firebase Auth ou votre propre système
  //     console.log('Changement de mot de passe pour:', userId);
  //   } catch (error) {
  //     console.error('Erreur lors du changement de mot de passe:', error);
  //     throw new Error('Impossible de changer le mot de passe');
  //   }
  // }

  // Valider le format d'image
  validateImageFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Format non supporté. Utilisez JPG, PNG ou WebP.'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'Image trop volumineuse. Maximum 5MB.'
      };
    }

    return { isValid: true };
  }
}

// Instance singleton
export const profileService = new ProfileService();