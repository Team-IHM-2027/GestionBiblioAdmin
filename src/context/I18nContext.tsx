// Dans src/context/I18nContext.tsx
import React, { createContext, useState, useEffect } from 'react';
import type {  ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { I18nContextType } from '../types/i18n';

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
	children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
	const { t, i18n } = useTranslation(['common', 'components', 'pages']);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Simuler le chargement initial des traductions
		setLoading(false);
	}, []);

	const toggleLanguage = () => {
		const newLanguage = i18n.language === 'en' ? 'fr' : 'en';
		i18n.changeLanguage(newLanguage);
	};

	const getCurrentLanguage = () => i18n.language;
	const isEnglish = () => getCurrentLanguage().startsWith('en');
	const isFrench = () => getCurrentLanguage().startsWith('fr');

	const contextValue: I18nContextType = {
		t,
		i18n,
		language: getCurrentLanguage(),
		loading,
		changeLanguage: i18n.changeLanguage,
		toggleLanguage,
		getCurrentLanguage,
		isEnglish,
		isFrench
	};

	return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
};