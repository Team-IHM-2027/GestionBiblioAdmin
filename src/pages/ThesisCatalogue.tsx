import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useThesisCatalogue } from '../hooks/useThesisCatalogue';
import ThesisCard from '../components/thesis/ThesisCard';
import Spinner from '../components/common/Spinner';
import { Button } from '../components/common/Button';
import { FiPlus, FiCheckCircle } from 'react-icons/fi';
import useI18n from '../hooks/useI18n';

const ThesisCatalogue: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useI18n();

	const { theses, isLoading, error, departmentName } = useThesisCatalogue();

	// Message de confirmation après ajout
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		if (location.state?.successMessage) {
			setSuccessMessage(location.state.successMessage);

			// Nettoyer l'état pour éviter l'affichage après refresh
			window.history.replaceState({}, document.title);

			// Masquer le message après 4 secondes
			const timer = setTimeout(() => {
				setSuccessMessage(null);
			}, 4000);

			return () => clearTimeout(timer);
		}
	}, [location.state]);

	if (isLoading) return <Spinner />;
	if (error) return <div className="text-center text-red-500">{error}</div>;

	return (
		<div>
			{/* Message de succès */}
			{successMessage && (
				<div className="mb-6 flex items-center gap-3 rounded-lg bg-green-100 text-green-700 px-4 py-3">
					<FiCheckCircle className="text-xl" />
					<span className="font-medium">{successMessage}</span>
				</div>
			)}

			<div className="flex justify-between items-center mb-6">
				<h2 className="text-2xl font-bold text-gray-700">
					{t('pages:thesis_catalogue.browsing', {
						department: departmentName,
						defaultValue: `Mémoires du département ${departmentName}`,
					})}
				</h2>

				<Button onClick={() => navigate('add')}>
					<FiPlus className="mr-2" />
					Ajouter un mémoire
				</Button>
			</div>

			{theses.length > 0 ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{theses.map((thesis) => (
						<ThesisCard key={thesis.id} thesis={thesis} />
					))}
				</div>
			) : (
				<div className="text-center py-10 bg-secondary-100 rounded-lg">
					<p className="text-secondary-600">
						{t('pages:thesis_catalogue.no_theses_found', {
							defaultValue: 'Aucun mémoire trouvé dans ce département.',
						})}
					</p>
				</div>
			)}
		</div>
	);
};

export default ThesisCatalogue;
