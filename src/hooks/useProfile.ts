// hooks/useProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { profileService } from '../services/profileService';
import type { UserProfile, ProfileFormData, ProfileStats,} from '../types/profile';
import type { NotificationState } from '../types';

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats>({
    totalLogins: 0,
    lastLoginDays: 0,
    documentsManaged: 0,
    accountAge: 0
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [notification, setNotification] = useState<NotificationState>({
    visible: false,
    type: 'success',
    message: ''
  });

  // Charger le profil utilisateur
  const loadProfile = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const [userProfile, profileStats] = await Promise.all([
        profileService.getUserProfile(userId),
        profileService.getProfileStats(userId)
      ]);

      setProfile(userProfile);
      setStats(profileStats);
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
      showNotification('error', 'Erreur lors du chargement du profil');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Afficher une notification
  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setNotification({ visible: true, type, message });
    setTimeout(() => {
      setNotification({ visible: false, type: 'success', message: '' });
    }, 4000);
  }, []);

  // Mettre à jour le profil
  const updateProfile = useCallback(async (
    data: ProfileFormData,
    t: (key: string) => string
  ) => {
    if (!userId) return;

    try {
      await profileService.updateProfile(userId, data);
      
      // Recharger le profil
      await loadProfile();
      
      setIsEditing(false);
      showNotification('success', t('profile_updated_successfully'));
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      showNotification('error', t('update_error'));
    }
  }, [userId, loadProfile, showNotification]);

  // Mettre à jour l'image de profil
  const updateProfileImage = useCallback(async (
    file: File,
    t: (key: string) => string
  ) => {
    if (!userId || !profile) return;

    try {
      setIsImageUploading(true);
      const newImageUrl = await profileService.updateProfileImage(
        userId, 
        file, 
        profile.image
      );

      // Mettre à jour le profil local
      setProfile(prev => prev ? { ...prev, image: newImageUrl } : null);
      
      showNotification('success', t('image_updated_successfully'));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      showNotification('error', t('image_update_error'));
    } finally {
      setIsImageUploading(false);
    }
  }, [userId, profile, showNotification]);

  // Prévisualiser l'image avant upload
  const previewImage = useCallback((file: File): string => {
    return URL.createObjectURL(file);
  }, []);

  // Charger les données au montage
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    stats,
    loading,
    isEditing,
    setIsEditing,
    isImageUploading,
    notification,
    updateProfile,
    updateProfileImage,
    previewImage,
    showNotification,
    loadProfile
  };
};