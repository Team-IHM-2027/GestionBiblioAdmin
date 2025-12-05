// src/components/layout/Navbar.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BiSearch, BiUserCircle, BiMessageDetail } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';
import LanguageSwitcher from '../common/LanguageSwitcher';
import useI18n from '../../hooks/useI18n';
import { useSearchContext } from '../../context/SearchContext';
import { useUnreadCount } from '../../hooks/useUnreadCount';

const Navbar: React.FC = () => {
	const { searchWord, setSearchWord, onSearch } = useSearchContext();
	const location = useLocation();
	const navigate = useNavigate();
	const { t } = useI18n();

	const unreadMessagesCount = useUnreadCount(); // Example count

	const shouldShowSearch = onSearch !== null;

	const handleMessagesClick = () => {
		navigate('/dashboard/messages');
	};
	/**
	 * Intelligently determines the title to display in the navbar based on the current URL.
	 * It handles static routes and dynamic routes with parameters.
	 */
	const getCurrentSectionName = () => {
		// 1. Get the path and split it into clean segments.
		// e.g., "/dashboard/books/Genie%20Informatique" -> ['dashboard', 'books', 'Genie%20Informatique']
		const pathSegments = location.pathname.split('/').filter(Boolean);

		if (pathSegments.length === 0) return t('pages:dashboard.overview');

		// 2. Check if we are inside the dashboard section.
		if (pathSegments[0] === 'dashboard') {
			if (pathSegments.length === 1) {
				return t('pages:dashboard.overview'); // Base /dashboard route
			}

			const mainSection = pathSegments[1]; // e.g., 'books'
			const dynamicParam = pathSegments[2]; // e.g., 'Genie%20Informatique'

			// 3. If a dynamic parameter exists, decode it for display.
			if (dynamicParam) {
				// This is the key change: decode the URL-encoded string.
				const decodedParam = decodeURIComponent(dynamicParam);
				const sectionTitle = t(`pages:dashboard.${mainSection}`, { defaultValue: mainSection.charAt(0).toUpperCase() + mainSection.slice(1) });
				// Return a combined title, e.g., "Books: Genie Informatique"
				return `${sectionTitle}: ${decodedParam}`;
			}

			// 4. For static dashboard sections like /dashboard/users.
			return t(`pages:dashboard.${mainSection}`, { defaultValue: mainSection.charAt(0).toUpperCase() + mainSection.slice(1) });
		}


		// 5. Fallback for any other top-level routes.
		return pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
	};

	// const shouldShowSearch = () => location.pathname.includes('/books') || location.pathname.includes('/users');
	const shouldShowBackButton = () => location.pathname !== '/dashboard';
	const goBack = () => navigate(-1);
	const goToProfile = () => navigate('/dashboard/profile'); // ✅ Correction: ajouter /dashboard

	return (
		<header className="bg-white shadow-sm sticky top-0 z-10">
			<div className="px-6 py-3 flex items-center justify-between flex-wrap">
				{/* Left section */}
				<div className="flex items-center">
					{shouldShowBackButton() && (
						<button onClick={goBack} className="mr-3 p-2 rounded-full hover:bg-secondary-100" title={t('components:navbar.back')}>
							<IoIosArrowBack className="text-primary-800 text-xl" />
						</button>
					)}
					<h1 className="text-xl font-semibold text-gray-800">
						{getCurrentSectionName()}
					</h1>
				</div>

				{/* Center section with a smarter search bar */}
				<div className="flex-grow max-w-lg mx-4 hidden md:block">
					{shouldShowSearch && (
						<div className="relative">
							<input
								type="text"
								value={searchWord}
								onChange={(e) => setSearchWord(e.target.value)}
								placeholder={t('common:search_placeholder')}
								className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
							/>
							<BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
						</div>
					)}
				</div>

				{/* Right section */}
				<div className="flex items-center space-x-2">
					<LanguageSwitcher />

					<button onClick={handleMessagesClick} className="relative p-2 rounded-full hover:bg-secondary-100" title={t('components:navbar.messages')}>

						<BiMessageDetail className="text-primary-800 text-xl" />
						{unreadMessagesCount > 0 && (
							<span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
                {unreadMessagesCount}
              </span>
						)}
					</button>
					
					{/* ✅ Correction: onClick sur le bouton parent */}
					<button 
						onClick={goToProfile}
						className="flex items-center space-x-2 ml-2 p-1 rounded-full hover:bg-secondary-100 cursor-pointer" 
						title={t('components:navbar.profile')}
					>
						<BiUserCircle className="text-primary-800 text-2xl" />
					
					</button>
				</div>
			</div>
		</header>
	);
};

export default Navbar;