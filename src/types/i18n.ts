// Dans src/types/i18n.ts
import type { TFunction } from 'i18next';
import type { i18n } from 'i18next';

export interface I18nContextType {
	t: TFunction<readonly ["common", "components", "pages"], undefined>;
	i18n: i18n;
	language: string;
	loading: boolean;
	changeLanguage: (lang: string) => void;
	toggleLanguage: () => void;
	getCurrentLanguage: () => string;
	isEnglish: () => boolean;
	isFrench: () => boolean;
}