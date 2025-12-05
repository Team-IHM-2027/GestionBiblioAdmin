import React from 'react';
import { BiGlobe } from 'react-icons/bi';
import useI18n from '../../hooks/useI18n';

interface LanguageSwitcherProps {
	variant?: 'navbar' | 'landing';
	className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
	                                                           variant = 'navbar',
	                                                           className = ''
                                                           }) => {
	const { t, toggleLanguage, isEnglish } = useI18n();

	if (variant === 'navbar') {
		return (
			<button
				onClick={toggleLanguage}
				className={`flex items-center space-x-2 p-2 rounded-full hover:bg-secondary-100 transition-colors ${className}`}
				title={t('language')}
			>
				<BiGlobe className="text-primary-800 text-xl" />
				<span className="text-sm font-medium">
          {isEnglish() ? 'EN' : 'FR'}
        </span>
			</button>
		);
	}

	return (
		<button
			onClick={toggleLanguage}
			className={`flex items-center space-x-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded transition-colors ${className}`}
		>
			<BiGlobe className="text-lg" />
			<span className="text-sm font-medium">
        {isEnglish() ? t('common:switch_to_french') : t('common:switch_to_english')}
      </span>
		</button>
	);
};

export default LanguageSwitcher;