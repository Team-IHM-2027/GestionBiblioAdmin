import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
	// Load translations from backend
	.use(Backend)
	// Detect user language
	.use(LanguageDetector)
	// Pass i18n instance to react-i18next
	.use(initReactI18next)
	// Initialize i18next
	.init({
		// Default language
		fallbackLng: 'fr',
		// Default namespace
		defaultNS: 'common',
		// Debug mode for development
		debug: process.env.NODE_ENV === 'development',
		// Interpolation configuration
		interpolation: {
			escapeValue: false, // React already escapes variables
		},
		// Backend configuration
		backend: {
			// Path to translation files
			loadPath: '/locales/{{lng}}/{{ns}}.json',
		},
		// Detection options (prefer localStorage)
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
		// Resources structure
		ns: ['common', 'components', 'pages'],
		// Support for RTL languages if needed in future
		supportedLngs: ['fr', 'en'],
	});

export default i18n;