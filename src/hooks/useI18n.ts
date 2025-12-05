import { useTranslation } from 'react-i18next';

/**
 * Custom hook for internationalization
 */
export const useI18n = () => {
  // Ajouter le namespace 'profile' pour toutes les traductions de profil
  const { t, i18n } = useTranslation(['common', 'components', 'pages', 'profile']);

  /**
   * Change language
   * @param lang Language code ('fr' or 'en')
   */
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  /**
   * Toggle language between French and English
   */
  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'en' : 'fr';
    changeLanguage(newLang);
  };

  /**
   * Get current language
   */
  const getCurrentLanguage = () => {
    return i18n.language;
  };

  /**
   * Check if language is English
   */
  const isEnglish = () => {
    return i18n.language === 'en';
  };

  /**
   * Check if language is French
   */
  const isFrench = () => {
    return i18n.language === 'fr';
  };

  return {
    t,
    i18n,
    changeLanguage,
    toggleLanguage,
    getCurrentLanguage,
    isEnglish,
    isFrench
  };
};

export default useI18n;
